package com.blasty.service.Implementation;

import com.blasty.dto.request.ReservationRequest;
import com.blasty.dto.response.ReservationResponse;
import com.blasty.exception.InvalidReservationException;
import com.blasty.exception.InvalidReservationStatusException;
import com.blasty.exception.PlaceNotAvailableException;
import com.blasty.exception.ResourceNotFoundException;
import com.blasty.mapper.ReservationMapper;
import com.blasty.model.Client;
import com.blasty.model.Place;
import com.blasty.model.Reservation;
import com.blasty.model.Vehicle;
import com.blasty.model.enums.ReservationStatus;
import com.blasty.model.enums.TypePlace;
import com.blasty.model.enums.VehiculeType;
import com.blasty.repository.ClientRepository;
import com.blasty.repository.PlaceRepository;
import com.blasty.repository.ReservationRepository;
import com.blasty.repository.VehicleRepository;
import com.blasty.service.Interface.PlaceService;
import com.blasty.service.Interface.ReservationService;
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
public class ReservationServiceImpl implements ReservationService {
    private final ReservationRepository reservationRepository;
    private final ClientRepository clientRepository;
    private final ReservationMapper reservationMapper;
    private final PlaceRepository placeRepository;
    private final PlaceService placeService;
    private final VehicleRepository vehicleRepository;

    @Override
    @Transactional
    public ReservationResponse createReservation(ReservationRequest request) {

        log.info("1. Create reservation request: {}", request);
        // Validate client exists
        Client client = clientRepository.findById(request.getClientId())
                .orElseThrow(() -> new ResourceNotFoundException("Client not found with id: " + request.getClientId()));

        // Validate place exists
        Place place = placeRepository.findById(request.getPlaceId())
                .orElseThrow(() -> new ResourceNotFoundException("Place not found with id: " + request.getPlaceId()));

        // Validate vehicle exists and belongs to the client
        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + request.getVehicleId()));

        // Ensure vehicle belongs to the requesting client
        if (!vehicle.getClient().getId().equals(request.getClientId())) {
            throw new IllegalArgumentException("Vehicle does not belong to the requesting client");
        }

        // Validate vehicle type is compatible with place type
        validateVehiclePlaceCompatibility(vehicle, place);

        // Validate reservation date
        validateReservationDate(request.getReservationDate());

        // Check if the place is available at the specified time
        if (!placeService.isPlaceAvailableInTime(request.getPlaceId(), request.getReservationDate())) {
            throw new PlaceNotAvailableException("Place is not available at the requested time");
        }

        // Calculate end time (reservation duration)
        LocalDateTime endTime = request.getReservationDate().plusHours(1);
        // Reserve the place
        placeService.reservePlace(request.getPlaceId(), endTime);
        // Create a reservation entity
        Reservation reservation = reservationMapper.toEntity(request);
        reservation.setClient(client);
        reservation.setPlace(place);
        reservation.setVehicle(vehicle);
        reservation.setStatus(ReservationStatus.PENDING);
        reservation.setStartDate(request.getReservationDate());
        reservation.setEndDate(endTime);

        log.info("Reservation created successfully {} ", reservation);
        // Save and return the reservation
        Reservation savedReservation = reservationRepository.save(reservation);
        return reservationMapper.toResponse(savedReservation);

    }

    private void validateVehiclePlaceCompatibility(Vehicle vehicle, Place place) {
        TypePlace placeType = place.getType();
        VehiculeType vehicleType = vehicle.getType();

        switch (placeType) {
            case STANDARD:
                // Standard places can only accommodate cars
                if (vehicleType != VehiculeType.VOITURE) {
                    throw new InvalidReservationException("Standard places can only accommodate cars");
                }
                break;
            case HANDICAPE:
                // Handicap places can only accommodate cars
                if (vehicleType != VehiculeType.VOITURE) {
                    throw new InvalidReservationException("Handicap places can only accommodate cars");
                }
                break;
            case VIP:
                // Large places can accommodate all vehicle types
                break;
            default:
                throw new InvalidReservationException("Unknown place type");
        }
    }

    @Override
    public ReservationResponse getReservationById(Long id) {
        Reservation reservation = findReservationById(id);
        return reservationMapper.toResponse(reservation);
    }

    @Override
    public List<ReservationResponse> getAllReservations() {
        return reservationRepository.findAll().stream()
                .map(reservationMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReservationResponse> getReservationsByClientId(Long clientId) {
        // Validate client exists
        if (!clientRepository.existsById(clientId)) {
            throw new ResourceNotFoundException("Client not found with id: " + clientId);
        }

        List<Reservation> clientReservations = reservationRepository.findByClientId(clientId);
        return clientReservations.stream()
                .map(reservationMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ReservationResponse confirmReservation(Long id) {
        Reservation reservation = findReservationById(id);

        // Can only confirm if it's in PENDING status
        if (reservation.getStatus() != ReservationStatus.PENDING) {
            throw new InvalidReservationStatusException("Reservation is already " +
                    reservation.getStatus().toString().toLowerCase());
        }

        // Update place status to OCCUPEE
        placeService.occupyPlace(reservation.getPlace().getId());

        // Update reservation status
        reservation.setStatus(ReservationStatus.CONFIRMED);
        Reservation savedReservation = reservationRepository.save(reservation);
        log.info("Confirmed reservation with id: {}", id);
        return reservationMapper.toResponse(savedReservation);
    }

    @Override
    @Transactional
    public ReservationResponse cancelReservation(Long id) {
        Reservation reservation = findReservationById(id);

        // Can't cancel if already completed
        if (reservation.getStatus() == ReservationStatus.COMPLETED) {
            throw new InvalidReservationStatusException("Cannot cancel a completed reservation");
        }

        // Free the place
        placeService.freePlace(reservation.getPlace().getId());

        // Update reservation status
        reservation.setStatus(ReservationStatus.CANCELLED);
        Reservation savedReservation = reservationRepository.save(reservation);
        log.info("Cancelled reservation with id: {}", id);
        return reservationMapper.toResponse(savedReservation);
    }

    @Override
    @Transactional
    public void deleteReservation(Long id) {
        Reservation reservation = findReservationById(id);

        // If the reservation was active (confirmed or pending), free the place
        if (reservation.getStatus() == ReservationStatus.CONFIRMED ||
                reservation.getStatus() == ReservationStatus.PENDING) {
            placeService.freePlace(reservation.getPlace().getId());
        }

        reservationRepository.deleteById(id);
        log.info("Deleted reservation with id: {}", id);
    }

    @Override
    @Transactional
    public ReservationResponse completeReservation(Long id) {
        Reservation reservation = findReservationById(id);

        // Can only complete if it's confirmed
        if (reservation.getStatus() != ReservationStatus.CONFIRMED) {
            throw new InvalidReservationStatusException("Only confirmed reservations can be completed");
        }

        // Free the place
        placeService.freePlace(reservation.getPlace().getId());

        // Update reservation status
        reservation.setStatus(ReservationStatus.COMPLETED);
        Reservation savedReservation = reservationRepository.save(reservation);
        log.info("Completed reservation with id: {}", id);
        return reservationMapper.toResponse(savedReservation);
    }

    /**
     * Helper method to find a reservation by ID or throw a standardized exception
     */
    public Reservation findReservationById(Long id) {
        return reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + id));
    }

    /**
     * Validate that the reservation date is not in the past and is within allowed range
     */
    private void validateReservationDate(LocalDateTime reservationDate) {
        LocalDateTime now = LocalDateTime.now();

        if (reservationDate.isBefore(now)) {
            throw new InvalidReservationException("Reservation date cannot be in the past");
        }

        // Optional: Add more validation logic here, such as maximum advance booking time
        LocalDateTime maxAdvanceDate = now.plusDays(30); // Allow bookings up to 30 days in advance
        if (reservationDate.isAfter(maxAdvanceDate)) {
            throw new InvalidReservationException("Reservations can only be made up to 30 days in advance");
        }
    }
}