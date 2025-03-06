package com.blasty.service.Implementation;

import com.blasty.dto.request.PlaceRequest;
import com.blasty.dto.response.PlaceResponse;
import com.blasty.mapper.PlaceMapper;
import com.blasty.model.Parking;
import com.blasty.model.Place;
import com.blasty.repository.ParkingRepository;
import com.blasty.repository.PlaceRepository;
import com.blasty.service.Interface.PlaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlaceServiceImpl implements PlaceService {
    private final PlaceRepository placeRepository;
    private final ParkingRepository parkingRepository;
    private final PlaceMapper placeMapper;

    @Override
    public PlaceResponse createPlace(Long parkingId, PlaceRequest request) {
        Parking parking = parkingRepository.findById(parkingId)
                .orElseThrow(() -> new RuntimeException("Parking not found"));

        Place place = placeMapper.toEntity(request);
        place.setParking(parking);
        place = placeRepository.save(place);

        // Optionally, if you want to update the availablePlaces field in Parking:
        parking.setAvailablePlaces(parking.getAvailablePlaces() - 1);
        parkingRepository.save(parking);

        return placeMapper.toResponse(place);
    }


    @Override
    public PlaceResponse getPlaceById(Long id) {
        Place place = placeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Place non trouvée"));
        return placeMapper.toResponse(place);
    }

    @Override
    public List<PlaceResponse> getAllPlaces() {
        return placeRepository.findAll().stream()
                .map(placeMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public PlaceResponse updatePlace(Long id, PlaceRequest request) {
        Place place = placeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Place non trouvée"));
        place.setType(request.getType());
        place.setTarifHoraire(request.getTarifHoraire());
        return placeMapper.toResponse(placeRepository.save(place));
    }

    @Override
    public void deletePlace(Long id) {
        placeRepository.deleteById(id);
    }
}