package com.blasty.service.Implementation;

import com.blasty.dto.request.ParkingRequest;
import com.blasty.dto.response.ParkingOccupancyResponse;
import com.blasty.dto.response.ParkingResponse;
import com.blasty.dto.response.ParkingRevenueResponse;
import com.blasty.exception.ResourceNotFoundException;
import com.blasty.mapper.ParkingMapper;
import com.blasty.model.Parking;
import com.blasty.model.Reservation;
import com.blasty.repository.ParkingRepository;
import com.blasty.repository.ReservationRepository;
import com.blasty.service.Interface.ParkingService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ParkingServiceImpl implements ParkingService {
    private final ParkingRepository parkingRepository;
    private final ParkingMapper parkingMapper;
    private final ReservationRepository reservationRepository;

    @Override
    @Transactional
    public ParkingResponse createParking(ParkingRequest request) {
        double maxCapacity = calculateMaxCapacity(request.getWidth(), request.getLength());

        if (request.getCapacity() > maxCapacity) {
            throw new IllegalArgumentException(
                    "La capacité demandée dépasse la capacité maximale basée sur la surface du parking");
        }

        Parking parking = parkingMapper.toEntity(request);
        parking.setOccupiedSpaces(0); // Initialize occupied spaces to 0
        return parkingMapper.toResponse(parkingRepository.save(parking));
    }

    @Override
    @Transactional
    public ParkingResponse updateParking(Long id, ParkingRequest request) {
        Parking parking = parkingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Parking non trouvé"));

        double maxCapacity = calculateMaxCapacity(request.getWidth(), request.getLength());

        if (request.getCapacity() > maxCapacity) {
            throw new IllegalArgumentException(
                    "La capacité demandée dépasse la capacité maximale basée sur la surface du parking");
        }

        parking.setName(request.getName());
        parking.setAddress(request.getAddress());
        parking.setCapacity(request.getCapacity());
        parking.setWidth(request.getWidth());
        parking.setLength(request.getLength());
        parking.setStatus(request.getStatus());

        return parkingMapper.toResponse(parkingRepository.save(parking));
    }

    @Override
    @Transactional
    public ParkingResponse getParkingById(Long id) {
        Parking parking = parkingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Parking non trouvé"));
        return parkingMapper.toResponse(parking);
    }

    @Override
    @Transactional
    public List<ParkingResponse> getAllParkings() {
        return parkingRepository.findAll().stream()
                .map(parkingMapper::toResponse)
                .collect(Collectors.toList());
    }

    private double calculateMaxCapacity(int width, int length) {
        double placeArea = 15; // Configurable value
        int parkingArea = width * length;
        return parkingArea / placeArea;
    }

    @Override
    @Transactional
    public int getAvailablePlaces(Long parkingId) {
        Parking parking = parkingRepository.findById(parkingId)
                .orElseThrow(() -> new ResourceNotFoundException("Parking non trouvé"));
        return parking.getCapacity() - parking.getOccupiedSpaces();
    }

    @Override
    @Transactional
    public void deleteParking(Long id) {
        Parking parking = parkingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Parking non trouvé avec id :" + id));
        parkingRepository.delete(parking);
    }

    @Override
    @Transactional
    public ParkingOccupancyResponse getParkingOccupancy(Long id) {
        Parking parking = findParkingById(id);
        return ParkingOccupancyResponse.builder()
                .parkingId(id)
                .parkingName(parking.getName())
                .totalCapacity(parking.getCapacity())
                .occupiedSpaces(parking.getOccupiedSpaces())
                .occupancyRate(
                        parking.getCapacity() > 0 ? (double) parking.getOccupiedSpaces() / parking.getCapacity() * 100
                                : 0)
                .build();
    }

    @Override
    @Transactional
    public List<ParkingOccupancyResponse> getAllParkingsOccupancy() {
        List<Parking> parkings = parkingRepository.findAll();
        return parkings.stream()
                .map(parking -> ParkingOccupancyResponse.builder()
                        .parkingId(parking.getId())
                        .parkingName(parking.getName())
                        .totalCapacity(parking.getCapacity())
                        .occupiedSpaces(parking.getOccupiedSpaces())
                        .occupancyRate(parking.getCapacity() > 0
                                ? (double) parking.getOccupiedSpaces() / parking.getCapacity() * 100
                                : 0)
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ParkingRevenueResponse getParkingRevenue(Long id, String period) {
        Parking parking = findParkingById(id);
        double revenue = calculateRevenueForParkingById(id, period);
        return ParkingRevenueResponse.builder()
                .parkingId(id)
                .parkingName(parking.getName())
                .totalRevenue(revenue)
                .period(period)
                .build();
    }

    @Override
    @Transactional
    public List<ParkingRevenueResponse> getAllParkingsRevenue(String period) {
        List<Parking> parkings = parkingRepository.findAll();
        return parkings.stream()
                .map(parking -> {
                    double revenue = calculateRevenueForParkingById(parking.getId(), period);
                    return ParkingRevenueResponse.builder()
                            .parkingId(parking.getId())
                            .parkingName(parking.getName())
                            .totalRevenue(revenue)
                            .period(period)
                            .build();
                })
                .collect(Collectors.toList());
    }

    private double calculateRevenueForParkingById(Long parkingId, String period) {
        LocalDate endDate = LocalDate.now();
        LocalDate startDate;

        switch (period.toLowerCase()) {
            case "day":
                startDate = endDate.minusDays(1);
                break;
            case "month":
                startDate = endDate.minusMonths(1);
                break;
            case "year":
                startDate = endDate.minusYears(1);
                break;
            default:
                throw new IllegalArgumentException("Invalid period: " + period);
        }

        List<Reservation> reservations = reservationRepository.findByParkingIdAndStartDateBetween(
                parkingId, startDate.atStartOfDay(), endDate.atTime(LocalTime.MAX));

        return reservations.stream()
                .mapToDouble(Reservation::calculateCost)
                .sum();
    }

    @Override
    @Transactional
    public void incrementOccupiedSpaces(Long parkingId) {
        Parking parking = findParkingById(parkingId);
        int occupiedSpaces = parking.getOccupiedSpaces() + 1;
        if (occupiedSpaces > parking.getCapacity()) {
            throw new IllegalStateException("Nombre de places occupées dépasse la capacité du parking");
        }
        parking.setOccupiedSpaces(occupiedSpaces);
        parkingRepository.save(parking);
    }

    @Override
    @Transactional
    public void decrementOccupiedSpaces(Long parkingId) {
        Parking parking = findParkingById(parkingId);
        int occupiedSpaces = parking.getOccupiedSpaces() - 1;
        if (occupiedSpaces < 0) {
            occupiedSpaces = 0;
        }
        parking.setOccupiedSpaces(occupiedSpaces);
        parkingRepository.save(parking);
    }

    private Parking findParkingById(Long id) {
        return parkingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Parking not found"));
    }
}