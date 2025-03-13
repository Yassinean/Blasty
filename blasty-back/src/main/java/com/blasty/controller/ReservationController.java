package com.blasty.controller;

import com.blasty.dto.request.ReservationRequest;
import com.blasty.dto.response.PlaceResponse;
import com.blasty.dto.response.ReservationResponse;
import com.blasty.model.Client;
import com.blasty.security.CustomUserDetails;
import com.blasty.service.Implementation.ReservationServiceImpl;
import com.blasty.service.Interface.ReservationService;
import com.sun.security.auth.UserPrincipal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

import static org.hibernate.query.sqm.tree.SqmNode.log;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
@Slf4j
public class ReservationController {
    private final ReservationService reservationService;

    // Client only endpoints
    @PostMapping
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<ReservationResponse> createReservation(
            @Valid @RequestBody ReservationRequest request,
            Authentication authentication) {
        // Verify that the clientId in the request matches the authenticated user
        Long authenticatedClientId = extractClientIdFromAuthentication(authentication);
        if (!authenticatedClientId.equals(request.getClientId())) {
            throw new AccessDeniedException("You can only create reservations for yourself");
        }

        log.info("Creating reservation for client: {} and place: {}", request.getClientId(), request.getPlaceId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(reservationService.createReservation(request));
    }

    @PutMapping("/{id}/cancel")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<ReservationResponse> cancelReservation(
            @PathVariable Long id,
            Authentication authentication) {
        // Verify that the reservation belongs to the authenticated user
        verifyReservationOwnership(id, authentication);

        log.info("Cancelling reservation with id: {}", id);
        return ResponseEntity.ok(reservationService.cancelReservation(id));
    }

    // Both client and admin accessible endpoints
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    public ResponseEntity<ReservationResponse> getReservationById(
            @PathVariable Long id,
            Authentication authentication) {
        // Verify that clients can only access their own reservations
        if (isClientRole(authentication) && !isReservationOwnedByClient(id, authentication)) {
            throw new AccessDeniedException("You can only view your own reservations");
        }

        log.debug("Fetching reservation with id: {}", id);
        return ResponseEntity.ok(reservationService.getReservationById(id));
    }

    // Admin only endpoints
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ReservationResponse>> getAllReservations() {
        log.debug("Fetching all reservations");
        return ResponseEntity.ok(reservationService.getAllReservations());
    }

    @PutMapping("/{id}/confirm")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReservationResponse> confirmReservation(@PathVariable Long id) {
        log.info("Confirming reservation with id: {}", id);
        return ResponseEntity.ok(reservationService.confirmReservation(id));
    }

    @PutMapping("/{id}/complete")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReservationResponse> completeReservation(@PathVariable Long id) {
        log.info("Completing reservation with id: {}", id);
        return ResponseEntity.ok(reservationService.completeReservation(id));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteReservation(@PathVariable Long id) {
        log.info("Deleting reservation with id: {}", id);
        reservationService.deleteReservation(id);
        return ResponseEntity.noContent().build();
    }

    // Client-specific endpoint to get their own reservations
    @GetMapping("/my-reservations")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<List<ReservationResponse>> getMyReservations(Authentication authentication) {
        Long clientId = extractClientIdFromAuthentication(authentication);
        log.debug("Fetching reservations for client with id: {}", clientId);
        return ResponseEntity.ok(reservationService.getReservationsByClientId(clientId));
    }


    // Helper method to extract client ID from authentication
    private Long extractClientIdFromAuthentication(Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        return userDetails.getUser().getId();
    }

    // Helper method to verify reservation ownership
    private void verifyReservationOwnership(Long reservationId, Authentication authentication) {
        if (!isReservationOwnedByClient(reservationId, authentication)) {
            throw new AccessDeniedException("You can only manage your own reservations");
        }
    }

    // Helper method to check if the authenticated user is a client
    private boolean isClientRole(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_CLIENT"));
    }

    // Helper method to check if a reservation is owned by the authenticated client
    private boolean isReservationOwnedByClient(Long reservationId, Authentication authentication) {
        Long clientId = extractClientIdFromAuthentication(authentication);
        ReservationResponse reservation = reservationService.getReservationById(reservationId);
        return reservation.getClientId().equals(clientId);
    }
}