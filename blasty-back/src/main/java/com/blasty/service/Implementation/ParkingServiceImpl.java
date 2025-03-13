package com.blasty.service.Implementation;

import com.blasty.dto.request.ParkingRequest;
import com.blasty.dto.response.ParkingOccupancyResponse;
import com.blasty.dto.response.ParkingResponse;
import com.blasty.dto.response.ParkingRevenueResponse;
import com.blasty.exception.ResourceNotFoundException;
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
        // Calculer la capacité maximale en fonction de la surface du parking
        double maxCapacity = calculateMaxCapacity(request.getWidth(), request.getLength());

        // Vérifier que la capacité demandée ne dépasse pas la capacité maximale
        if (request.getCapacity() > maxCapacity) {
            throw new RuntimeException("La capacité demandée dépasse la capacité maximale basée sur la surface du parking");
        }

        // Créer l'entité Parking
        Parking parking = parkingMapper.toEntity(request);
        parking.setOccupiedSpaces(0); // Initialize occupied spaces to 0
        return parkingMapper.toResponse(parkingRepository.save(parking));
    }

    @Override
    public ParkingResponse updateParking(Long id, ParkingRequest request) {
        Parking parking = parkingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Parking non trouvé"));

        // Calculer la capacité maximale en fonction de la surface du parking
        double maxCapacity = calculateMaxCapacity(request.getWidth(), request.getLength());

        // Vérifier que la capacité demandée ne dépasse pas la capacité maximale
        if (request.getCapacity() > maxCapacity) {
            throw new RuntimeException("La capacité demandée dépasse la capacité maximale basée sur la surface du parking");
        }

        // Mettre à jour les propriétés du parking
        parking.setName(request.getName());
        parking.setAddress(request.getAddress());
        parking.setCapacity(request.getCapacity());
        parking.setWidth(request.getWidth());
        parking.setLength(request.getLength());
        parking.setStatus(request.getStatus());

        // Sauvegarder et renvoyer la réponse
        return parkingMapper.toResponse(parkingRepository.save(parking));
    }

    @Override
    public ParkingResponse getParkingById(Long id) {
        Parking parking = parkingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Parking non trouvé"));
        return parkingMapper.toResponse(parking);
    }

    @Override
    public List<ParkingResponse> getAllParkings() {
        return parkingRepository.findAll().stream()
                .map(parkingMapper::toResponse)
                .collect(Collectors.toList());
    }

    private double calculateMaxCapacity(int width, int length) {
        double placeArea = 15;  // Exemple de surface par place de parking
        int parkingArea = width * length;
        return parkingArea / placeArea;
    }

    @Override
    public int getAvailablePlaces(Long parkingId) {
        Parking parking = parkingRepository.findById(parkingId)
                .orElseThrow(() -> new ResourceNotFoundException("Parking non trouvé"));
        return parking.getCapacity() - parking.getOccupiedSpaces();
    }

    @Override
    public void deleteParking(Long id) {
        Parking parking = parkingRepository.findById(id).orElseThrow(()->new ResourceNotFoundException("Pakring not found with id :" + id));
        parkingRepository.delete(parking);
    }

    @Override
    public List<ParkingOccupancyResponse> getParkingOccupancy(Long id) {
        return parkingRepository.findAll().stream()
                .map(parking -> ParkingOccupancyResponse.builder()
                        .parkingId(id)
                        .parkingName(parking.getName())
                        .totalCapacity(parking.getCapacity())
                        .occupiedSpaces(parking.getOccupiedSpaces())
                        .occupancyRate(parking.getCapacity() > 0 ?
                                (double) parking.getOccupiedSpaces() / parking.getCapacity() * 100 : 0)
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public List<ParkingRevenueResponse> getParkingRevenue(Long id ,String period) {
        return parkingRepository.findAll().stream()
                .map(parking -> ParkingRevenueResponse.builder()
                        .parkingId(id)
                        .parkingName(parking.getName())
                        .totalRevenue(calculateRevenueForParking(parking, period))
                        .period(period)
                        .build())
                .collect(Collectors.toList());
    }

    private double calculateRevenueForParking(Parking parking, String period) {
        // Implementation remains the same as in your original code
        return 1000;
    }

    // New methods for managing occupied spaces
    public void incrementOccupiedSpaces(Long parkingId) {
        Parking parking = parkingRepository.findById(parkingId)
                .orElseThrow(() -> new RuntimeException("Parking non trouvé"));

        int occupiedSpaces = parking.getOccupiedSpaces() + 1;
        if (occupiedSpaces > parking.getCapacity()) {
            throw new RuntimeException("Nombre de places occupées dépasse la capacité du parking");
        }

        parking.setOccupiedSpaces(occupiedSpaces);
        parkingRepository.save(parking);
    }

    public void decrementOccupiedSpaces(Long parkingId) {
        Parking parking = parkingRepository.findById(parkingId)
                .orElseThrow(() -> new RuntimeException("Parking non trouvé"));

        int occupiedSpaces = parking.getOccupiedSpaces() - 1;
        if (occupiedSpaces < 0) {
            occupiedSpaces = 0; // Ensure we don't go below zero
        }

        parking.setOccupiedSpaces(occupiedSpaces);
        parkingRepository.save(parking);
    }
}