package com.blasty.service.Implementation;

import com.blasty.dto.request.PlaceRequest;
import com.blasty.dto.response.PlaceResponse;
import com.blasty.exception.PlaceNotAvailableException;
import com.blasty.exception.ResourceNotFoundException;
import com.blasty.mapper.PlaceMapper;
import com.blasty.model.Parking;
import com.blasty.model.Place;
import com.blasty.model.enums.PlaceStatus;
import com.blasty.model.enums.TypePlace;
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
                .orElseThrow(() -> new ResourceNotFoundException("Parking non trouvé avec id: " + parkingId));

        validateParkingCount(parking);
        if (placeRepository.existsByNumeroAndParkingId(request.getNumero(), parkingId)) {
            throw new IllegalArgumentException("Une place avec ce numéro existe déjà dans ce parking");
        }

        Place place = placeMapper.toEntity(request);
        place.setParking(parking);
        place.setEtat(PlaceStatus.DISPONIBLE);
        place.setType(request.getType());
        place.setTarifHoraire(calculateTarifHoraire(request.getType()));

        place = placeRepository.save(place);
        log.info("Created new place with id: {} in parking: {}", place.getId(), parkingId);
        return placeMapper.toResponse(place);
    }

    private double calculateTarifHoraire(TypePlace type) {
        switch (type) {
            case HANDICAPE:
                return 1.5;
            case STANDARD:
                return 5;
            case VIP:
                return 10;
            default:
                throw new IllegalArgumentException("Invalid place type: " + type);
        }
    }

    private void validateParkingCount(Parking parking) {
        long currentPlaceCount = placeRepository.countByParking(parking);
        log.info("Parking count: {}", currentPlaceCount);
        double capacity = parking.getCapacity();
        if (currentPlaceCount >= capacity) {
            throw new IllegalArgumentException("Le parking a atteint sa capacité maximale de " + capacity + " places.");
        }
    }

    @Override
    @Transactional
    public PlaceResponse getPlaceById(Long id) {
        Place place = findPlaceById(id);
        return placeMapper.toResponse(place);
    }

    @Override
    @Transactional
    public List<PlaceResponse> getAllPlaces() {
        return placeRepository.findAll().stream()
                .map(placeMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public PlaceResponse updatePlace(Long id, PlaceRequest request) {
        Place place = findPlaceById(id);

        if (place.getEtat() == PlaceStatus.DISPONIBLE) {
            place.setNumero(request.getNumero());
            place.setType(request.getType());
            place.setTarifHoraire(calculateTarifHoraire(request.getType()));
        } else {
            throw new IllegalStateException("You can't update reserved or occupied place");
        }

        Place savedPlace = placeRepository.save(place);
        log.info("Updated place with id: {}", id);
        return placeMapper.toResponse(savedPlace);
    }

    @Override
    @Transactional
    public void deletePlace(Long id) {
        Place place = findPlaceById(id);
        if (place.getEtat() == PlaceStatus.DISPONIBLE) {
            placeRepository.deleteById(id);
        } else {
            throw new IllegalStateException("You can't delete reserved or occupied place");
        }
        log.info("Deleted place with id: {}", id);
    }

    @Override
    @Transactional
    public boolean isPlaceAvailable(Long placeId) {
        Place place = findPlaceById(placeId);
        return place.getEtat() == PlaceStatus.DISPONIBLE;
    }

    @Override
    @Transactional
    public List<PlaceResponse> getPlacesByParkingId(Long parkingId) {
        Parking parking = parkingRepository.findById(parkingId)
                .orElseThrow(() -> new ResourceNotFoundException("Parking non trouvé avec id: " + parkingId));
        List<Place> places = placeRepository.findByParkingId(parking.getId());
        return places.stream()
                .map(placeMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public boolean isPlaceAvailableInTime(Long placeId, LocalDateTime requestedTime) {
        Place place = findPlaceById(placeId);

        if (place.getEtat() == PlaceStatus.DISPONIBLE) {
            return true;
        }

        if (place.getEtat() == PlaceStatus.RESERVEE && place.getReservedUntil() != null) {
            return place.getReservedUntil().isBefore(requestedTime);
        }

        return false;
    }

    @Override
    @Transactional
    public PlaceResponse reservePlace(Long placeId, LocalDateTime reservedUntil) {
        Place place = findPlaceById(placeId);

        if (place.getEtat() != PlaceStatus.DISPONIBLE) {
            throw new PlaceNotAvailableException("Place is already occupied");
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

        place.setEtat(PlaceStatus.OCCUPEE);
        parkingService.incrementOccupiedSpaces(place.getParking().getId());

        Place savedPlace = placeRepository.save(place);
        log.info("Place with id: {} is now occupied", placeId);
        return placeMapper.toResponse(savedPlace);
    }

    @Override
    @Transactional
    public PlaceResponse freePlace(Long placeId) {
        Place place = findPlaceById(placeId);

        if (place.getEtat() == PlaceStatus.OCCUPEE) {
            parkingService.decrementOccupiedSpaces(place.getParking().getId());
        }

        place.setEtat(PlaceStatus.DISPONIBLE);
        place.setReservedUntil(null);

        Place savedPlace = placeRepository.save(place);
        log.info("Place with id: {} is now free", placeId);
        return placeMapper.toResponse(savedPlace);
    }

    private Place findPlaceById(Long id) {
        return placeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Place non trouvé avec id: " + id));
    }
}