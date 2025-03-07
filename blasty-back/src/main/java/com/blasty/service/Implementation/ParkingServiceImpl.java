package com.blasty.service.Implementation;

import com.blasty.dto.request.ParkingRequest;
import com.blasty.dto.response.ParkingResponse;
import com.blasty.mapper.ParkingMapper;
import com.blasty.model.Parking;
import com.blasty.repository.ParkingRepository;
import com.blasty.service.Interface.ParkingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ParkingServiceImpl implements ParkingService {
    private final ParkingRepository parkingRepository;
    private final ParkingMapper parkingMapper;

    @Override
    public ParkingResponse createParking(ParkingRequest request) {
        Parking parking = parkingMapper.toEntity(request);
        return parkingMapper.toResponse(parkingRepository.save(parking));
    }

    @Override
    public ParkingResponse getParkingById(Long id) {
        Parking parking = parkingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Parking non trouvé"));
        return parkingMapper.toResponse(parking);
    }

    @Override
    public List<ParkingResponse> getAllParkings() {
        return parkingRepository.findAll().stream()
                .map(parkingMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ParkingResponse updateParking(Long id, ParkingRequest request) {
        Parking parking = parkingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Parking non trouvé"));
        parking.setName(request.getName());
        parking.setAddress(request.getAddress());
        parking.setCapacity(request.getCapacity());
        parking.setStatus(request.getStatus());
        parking.setLatitude(request.getLatitude());
        parking.setLongitude(request.getLongitude());
        return parkingMapper.toResponse(parkingRepository.save(parking));
    }

    @Override
    public int getAvailablePlaces(Long parkingId) {
        Parking parking = parkingRepository.findById(parkingId)
                .orElseThrow(() -> new RuntimeException("Parking non trouvé"));
        return parking.getAvailablePlaces();
    }

    @Override
    public void deleteParking(Long id) {
        parkingRepository.deleteById(id);
    }
}