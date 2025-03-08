package com.blasty.service.Implementation;

import com.blasty.dto.request.ParkingRequest;
import com.blasty.dto.response.ParkingOccupancyResponse;
import com.blasty.dto.response.ParkingResponse;
import com.blasty.dto.response.ParkingRevenueResponse;
import com.blasty.mapper.ParkingMapper;
import com.blasty.model.Parking;
import com.blasty.model.Transaction;
import com.blasty.repository.ParkingRepository;
import com.blasty.repository.TransactionRepository;
import com.blasty.service.Interface.ParkingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ParkingServiceImpl implements ParkingService {
    private final ParkingRepository parkingRepository;
    private final ParkingMapper parkingMapper;
    private final TransactionRepository transactionRepository;

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

        // Vérifier que le nombre de places occupées ne dépasse pas la capacité
        if (request.getOccupiedSpaces() > request.getCapacity()) {
            throw new RuntimeException("Le nombre de places occupées ne peut pas dépasser la capacité du parking");
        }

        parking.setName(request.getName());
        parking.setAddress(request.getAddress());
        parking.setCapacity(request.getCapacity());
        parking.setOccupiedSpaces(request.getOccupiedSpaces());
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

    @Override
    public List<ParkingOccupancyResponse> getParkingOccupancy() {
        return parkingRepository.findAll().stream()
                .map(parking -> ParkingOccupancyResponse.builder()
                        .parkingId(parking.getId())
                        .parkingName(parking.getName())
                        .totalCapacity(parking.getCapacity())
                        .occupiedSpaces(parking.getOccupiedSpaces())
                        .occupancyRate((double) parking.getOccupiedSpaces() / parking.getCapacity() * 100)
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public List<ParkingRevenueResponse> getParkingRevenue(String period) {
        // Exemple simplifié : calculer le revenu total pour chaque parking
        return parkingRepository.findAll().stream()
                .map(parking -> ParkingRevenueResponse.builder()
                        .parkingId(parking.getId())
                        .parkingName(parking.getName())
                        .totalRevenue(calculateRevenueForParking(parking, period))
                        .period(period)
                        .build())
                .collect(Collectors.toList());
    }

    private double calculateRevenueForParking(Parking parking, String period) {
//        LocalDate startDate;
//        LocalDate endDate = LocalDate.now();
//
//        startDate = switch (period.toLowerCase()) {
//            case "mois" -> endDate.with(TemporalAdjusters.firstDayOfMonth());
//            case "année" -> endDate.with(TemporalAdjusters.firstDayOfYear());
//            default -> throw new IllegalArgumentException("Période non valide. Utilisez 'mois' ou 'année'.");
//        };
//
//        List<Transaction> transactions = transactionRepository.findByParkingAndTransactionDateBetween(
//                parking, startDate.atStartOfDay(), endDate.atTime(23, 59, 59));
//
//        return transactions.stream()
//                .mapToDouble(Transaction::getAmount)
//                .sum();
        return 1000;

    }
}