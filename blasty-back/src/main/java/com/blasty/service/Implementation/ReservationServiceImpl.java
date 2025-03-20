package com.blasty.service.Implementation;

import com.blasty.dto.request.ReservationRequest;
import com.blasty.dto.response.ReservationResponse;
import com.blasty.exception.InvalidReservationException;
import com.blasty.exception.InvalidReservationStatusException;
import com.blasty.exception.PlaceNotAvailableException;
import com.blasty.exception.ResourceNotFoundException;
import com.blasty.mapper.ReservationMapper;
import com.blasty.model.*;
import com.blasty.model.enums.ReservationStatus;
import com.blasty.model.enums.TypePlace;
import com.blasty.model.enums.VehiculeType;
import com.blasty.repository.*;
import com.blasty.service.Interface.PlaceService;
import com.blasty.service.Interface.ReservationService;
import com.blasty.service.Interface.TicketService;
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
    private final ParkingRepository parkingRepository;
    private final TicketService ticketService;

    @Override
    @Transactional
    public ReservationResponse createReservation(ReservationRequest request) {
        log.info("1. Create reservation request: {}", request);

        // Validate that startDate is not null
        if (request.getStartDate() == null) {
            throw new IllegalArgumentException("La date de réservation ne peut pas être nulle");
        }

        Client client = clientRepository.findById(request.getClientId())
                .orElseThrow(() -> new ResourceNotFoundException("Client not found with id: " + request.getClientId()));

        Place place = placeRepository.findById(request.getPlaceId())
                .orElseThrow(() -> new ResourceNotFoundException("Place not found with id: " + request.getPlaceId()));

        Parking parking = parkingRepository.findById(place.getParking().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Parking not found"));

        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + request.getVehicleId()));

        if (!vehicle.getClient().getId().equals(request.getClientId())) {
            throw new IllegalArgumentException("Vehicle does not belong to the requesting client");
        }

        validateVehiclePlaceCompatibility(vehicle, place);

        validateStartDate(request.getStartDate());

        if (!placeService.isPlaceAvailableInTime(request.getPlaceId(), request.getStartDate())) {
            throw new PlaceNotAvailableException("Place is not available at the requested time");
        }

        LocalDateTime endTime = request.getStartDate().plusHours(1);

        placeService.reservePlace(request.getPlaceId(), endTime);

        Reservation reservation = reservationMapper.toEntity(request);
        reservation.setClient(client);
        reservation.setPlace(place);
        reservation.setParking(parking);
        reservation.setVehicle(vehicle);
        reservation.setStatus(ReservationStatus.PENDING);
        reservation.setStartDate(request.getStartDate());
        reservation.setEndDate(endTime);

        log.info("Reservation created successfully {} ", reservation);
        Reservation savedReservation = reservationRepository.save(reservation);
        return reservationMapper.toResponse(savedReservation);
    }

    private void validateVehiclePlaceCompatibility(Vehicle vehicle, Place place) {
        TypePlace placeType = place.getType();
        VehiculeType vehicleType = vehicle.getType();

        switch (placeType) {
            case STANDARD:
                if (vehicleType != VehiculeType.VOITURE) {
                    throw new InvalidReservationException("Standard places can only accommodate cars");
                }
                break;
            case HANDICAPE:
                if (vehicleType != VehiculeType.VOITURE) {
                    throw new InvalidReservationException("Handicap places can only accommodate cars");
                }
                break;
            case VIP:
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

        if (reservation.getStatus() != ReservationStatus.PENDING) {
            throw new InvalidReservationStatusException("Reservation is already " +
                    reservation.getStatus().toString().toLowerCase());
        }

        placeService.occupyPlace(reservation.getPlace().getId());

        reservation.setStatus(ReservationStatus.CONFIRMED);
        Reservation savedReservation = reservationRepository.save(reservation);
        log.info("Confirmed reservation with id: {}", id);

        // Generate ticket after confirmation
        try {
            ticketService.generateTicket(savedReservation.getId());
            log.info("Ticket generated for reservation id: {}", id);
        } catch (Exception e) {
            log.error("Failed to generate ticket for reservation id: {}", id, e);
            // Don't rollback reservation confirmation if ticket generation fails
        }

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
    private void validateStartDate(LocalDateTime startDate) {
        LocalDateTime now = LocalDateTime.now();

        if (startDate.isBefore(now)) {
            throw new InvalidReservationException("Reservation date cannot be in the past");
        }

        // Optional: Add more validation logic here, such as maximum advance booking time
        LocalDateTime maxAdvanceDate = now.plusDays(30); // Allow bookings up to 30 days in advance
        if (startDate.isAfter(maxAdvanceDate)) {
            throw new InvalidReservationException("Reservations can only be made up to 30 days in advance");
        }
    }
}