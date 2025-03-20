package com.blasty.service.Implementation;

import com.blasty.exception.InvalidReservationStatusException;
import com.blasty.exception.InvalidTicketException;
import com.blasty.exception.ResourceNotFoundException;
import com.blasty.model.Place;
import com.blasty.model.Reservation;
import com.blasty.model.enums.ReservationStatus;
import com.blasty.repository.ReservationRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import com.blasty.dto.response.TicketResponse;
import com.blasty.mapper.TicketMapper;
import com.blasty.model.Ticket;
import com.blasty.repository.TicketRepository;
import com.blasty.service.Interface.TicketService;

import lombok.RequiredArgsConstructor;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TicketServiceImpl implements TicketService {
    private final TicketRepository ticketRepository;
    private final TicketMapper ticketMapper;
    private final Random random = new Random();
    private final ReservationRepository reservationRepository;

    @Override
    @Transactional
    public TicketResponse generateTicket(Long reservationId) {
        log.info("Generating ticket for reservation ID: {}", reservationId);

        // Get the reservation using the existing service
        Reservation reservation = reservationRepository.findById(reservationId).orElseThrow(()->new ResourceNotFoundException("Reservation not found"));

        // Check if reservation is confirmed
        if (reservation.getStatus() != ReservationStatus.CONFIRMED) {
            throw new InvalidReservationStatusException("Cannot generate ticket for unconfirmed reservation");
        }

        // Check if ticket already exists
        Optional<Ticket> existingTicket = ticketRepository.findByReservationId(reservationId);
        if (existingTicket.isPresent()) {
            log.info("Ticket already exists for reservation ID: {}", reservationId);
            return ticketMapper.toResponse(existingTicket.get());
        }

        // Calculate duration and price
        int durationHours = calculateDurationInHours(reservation.getStartDate(), reservation.getEndDate());
        double price = calculatePrice(reservation.getPlace(), durationHours);

        // Generate ticket
        Ticket ticket = Ticket.builder()
                .ticketNumber(generateUniqueTicketNumber())
                .reservation(reservation)
                .issueDate(LocalDateTime.now())
                .price(price)
                .durationHours(durationHours)
                .isUsed(false)
                .accessCode(generateAccessCode())
                .build();

        Ticket savedTicket = ticketRepository.save(ticket);
        log.info("Generated ticket with number: {} for reservation ID: {}", savedTicket.getTicketNumber(), reservationId);

        return ticketMapper.toResponse(savedTicket);
    }

    @Override
    public TicketResponse getTicketById(Long id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket non trouvé avec id: " + id));;
        return ticketMapper.toResponse(ticket);
    }

    @Override
    public TicketResponse getTicketByNumber(String ticketNumber) {
        Ticket ticket = ticketRepository.findByTicketNumber(ticketNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket non trouvé avec number: " + ticketNumber));
        return ticketMapper.toResponse(ticket);
    }

    @Override
    public List<TicketResponse> getTicketsByClientId(Long clientId) {
        List<Ticket> tickets = ticketRepository.findByReservationClientId(clientId);
        return tickets.stream()
                .map(ticketMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public TicketResponse validateTicket(String ticketNumber) {
        Ticket ticket = ticketRepository.findByTicketNumber(ticketNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket non trouvé avec number: " + ticketNumber));

        // Check if ticket is already used
        if (ticket.isUsed()) {
            throw new InvalidTicketException("Le ticket a déjà été utilisé");
        }

        // Check if reservation is still valid (not expired)
        Reservation reservation = ticket.getReservation();
        if (LocalDateTime.now().isAfter(reservation.getEndDate())) {
            throw new InvalidTicketException("Le ticket a expiré");
        }

        log.info("Ticket validated: {}", ticketNumber);
        return ticketMapper.toResponse(ticket);
    }

    @Override
    @Transactional
    public void markTicketAsUsed(String ticketNumber) {
        Ticket ticket = ticketRepository.findByTicketNumber(ticketNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket non trouvé avec number: " + ticketNumber));

        ticket.setUsed(true);
        ticketRepository.save(ticket);
        log.info("Ticket marked as used: {}", ticketNumber);
    }

    /**
     * Helper method to generate a unique ticket number
     */
    private String generateUniqueTicketNumber() {
        String ticketNumber;
        do {
            // Format: TKT-YYYYMMDD-XXXXX (where XXXXX is a random 5-digit number)
            LocalDate today = LocalDate.now();
            String datePart = today.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
            String randomPart = String.format("%05d", random.nextInt(100000));
            ticketNumber = "TKT-" + datePart + "-" + randomPart;
        } while (ticketRepository.findByTicketNumber(ticketNumber).isPresent());

        return ticketNumber;
    }

    /**
     * Helper method to generate an access code
     */
    private String generateAccessCode() {
        // Generate a 6-digit numeric code
        return String.format("%06d", random.nextInt(1000000));
    }

    /**
     * Calculate duration in hours between start and end dates
     */
    private int calculateDurationInHours(LocalDateTime startDate, LocalDateTime endDate) {
        Duration duration = Duration.between(startDate, endDate);
        return (int) Math.ceil(duration.toMinutes() / 60.0);
    }

    /**
     * Calculate price based on place type and duration
     */
    private double calculatePrice(Place place, int durationHours) {
        // Get hourly rate from place
        double hourlyRate = place.getTarifHoraire();

        // Calculate total price
        return hourlyRate * durationHours;
    }
}