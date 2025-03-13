package com.blasty.service.Implementation;

import com.blasty.dto.request.PlaceRequest;
import com.blasty.dto.response.PlaceResponse;
import com.blasty.exception.PlaceNotAvailableException;
import com.blasty.exception.ResourceNotFoundException;
import com.blasty.mapper.PlaceMapper;
import com.blasty.model.Parking;
import com.blasty.model.Place;
import com.blasty.model.enums.PlaceStatus;
import com.blasty.repository.ParkingRepository;
import com.blasty.repository.PlaceRepository;
import com.blasty.service.Interface.ParkingService;
import com.blasty.service.Interface.PlaceService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PlaceServiceImpl implements PlaceService {
    private final PlaceRepository placeRepository;
    private final ParkingRepository parkingRepository;
    private final PlaceMapper placeMapper;
    private final ParkingService parkingService;

    @Override
    @Transactional
    public PlaceResponse createPlace(Long parkingId, PlaceRequest request) {
        Parking parking = parkingRepository.findById(parkingId)
                .orElseThrow(() -> new ResourceNotFoundException("Parking not found with id: " + parkingId));

        Place place = placeMapper.toEntity(request);
        place.setParking(parking);
        place.setEtat(PlaceStatus.DISPONIBLE); // Initialize as available
        place = placeRepository.save(place);

        log.info("Created new place with id: {} in parking: {}", place.getId(), parkingId);
        return placeMapper.toResponse(place);
    }

    @Override
    public PlaceResponse getPlaceById(Long id) {
        Place place = findPlaceById(id);
        return placeMapper.toResponse(place);
    }

    @Override
    public List<PlaceResponse> getAllPlaces() {
        return placeRepository.findAll().stream()
                .map(placeMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public PlaceResponse updatePlace(Long id, PlaceRequest request) {
        Place place = findPlaceById(id);

        // Only update fields that can be modified
        place.setType(request.getType());
        place.setTarifHoraire(request.getTarifHoraire());
        place.setNumero(request.getNumero());

        Place savedPlace = placeRepository.save(place);
        log.info("Updated place with id: {}", id);
        return placeMapper.toResponse(savedPlace);
    }

    @Override
    @Transactional
    public void deletePlace(Long id) {
        if (!placeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Place not found with id: " + id);
        }
        placeRepository.deleteById(id);
        log.info("Deleted place with id: {}", id);
    }

    @Override
    public boolean isPlaceAvailable(Long placeId) {
        Place place = findPlaceById(placeId);
        return place.getEtat() == PlaceStatus.DISPONIBLE;
    }

    @Override
    public boolean isPlaceAvailableInTime(Long placeId, LocalDateTime requestedTime) {
        Place place = findPlaceById(placeId);

        // If place is currently available, check if there are any future reservations
        if (place.getEtat() == PlaceStatus.DISPONIBLE) {
            return true;
        }

        // If place is reserved, check if the reservation ends before the requested time
        if (place.getEtat() == PlaceStatus.RESERVEE && place.getReservedUntil() != null) {
            return place.getReservedUntil().isBefore(requestedTime);
        }

        // If occupied, it's not available
        return false;
    }

    @Override
    @Transactional
    public PlaceResponse reservePlace(Long placeId, LocalDateTime reservedUntil) {
        Place place = findPlaceById(placeId);

        if (place.getEtat() != PlaceStatus.DISPONIBLE) {
            if (place.getEtat() == PlaceStatus.OCCUPEE) {
                throw new PlaceNotAvailableException("Place is already occupied");
            } else {
                throw new PlaceNotAvailableException("Place is already reserved");
            }
        }

        place.setEtat(PlaceStatus.RESERVEE);
        place.setReservedUntil(reservedUntil);

        Place savedPlace = placeRepository.save(place);
        log.info("Place with id: {} reserved until: {}", placeId, reservedUntil);
        return placeMapper.toResponse(savedPlace);
    }

    @Override
    @Transactional
    public PlaceResponse occupyPlace(Long placeId) {
        Place place = findPlaceById(placeId);

        if (place.getEtat() == PlaceStatus.OCCUPEE) {
            throw new PlaceNotAvailableException("Place is already occupied");
        }

        // Change status to occupied
        place.setEtat(PlaceStatus.OCCUPEE);

        // Increment occupied spaces in the parking
        parkingService.incrementOccupiedSpaces(place.getParking().getId());

        Place savedPlace = placeRepository.save(place);
        log.info("Place with id: {} is now occupied", placeId);
        return placeMapper.toResponse(savedPlace);
    }

    @Override
    @Transactional
    public PlaceResponse freePlace(Long placeId) {
        Place place = findPlaceById(placeId);

        // Only decrement if the place was actually occupied
        if (place.getEtat() == PlaceStatus.OCCUPEE) {
            parkingService.decrementOccupiedSpaces(place.getParking().getId());
        }

        place.setEtat(PlaceStatus.DISPONIBLE);
        place.setReservedUntil(null);

        Place savedPlace = placeRepository.save(place);
        log.info("Place with id: {} is now free", placeId);
        return placeMapper.toResponse(savedPlace);
    }

    /**
     * Helper method to find a place by ID or throw a standardized exception
     */
    private Place findPlaceById(Long id) {
        return placeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Place not found with id: " + id));
    }
}