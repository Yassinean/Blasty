package com.blasty.service.Implementation;

import com.blasty.dto.request.PlaceRequest;
import com.blasty.dto.response.PlaceResponse;
import com.blasty.mapper.PlaceMapper;
import com.blasty.model.Place;
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
    private final PlaceMapper placeMapper;

    @Override
    public PlaceResponse createPlace(PlaceRequest request) {
        Place place = placeMapper.toEntity(request);
        return placeMapper.toResponse(placeRepository.save(place));
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