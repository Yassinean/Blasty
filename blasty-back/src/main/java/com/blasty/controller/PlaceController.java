package com.blasty.controller;

import com.blasty.dto.request.PlaceRequest;
import com.blasty.dto.response.PlaceResponse;
import com.blasty.service.Implementation.PlaceServiceImpl;
import com.blasty.service.Interface.PlaceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
public class PlaceController {
    private final PlaceService placeService;

    // Admin endpoints
    @PostMapping("/parkings/{parkingId}/places")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PlaceResponse> createPlace(
            @PathVariable Long parkingId,
            @Valid @RequestBody PlaceRequest request) {
        log.info("Creating new place in parking with id: {}", parkingId);
        return ResponseEntity.status(HttpStatus.CREATED).body(placeService.createPlace(parkingId, request));
    }

    @PutMapping("/places/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PlaceResponse> updatePlace(
            @PathVariable Long id,
            @Valid @RequestBody PlaceRequest request) {
        log.info("Updating place with id: {}", id);
        return ResponseEntity.ok(placeService.updatePlace(id, request));
    }

    @DeleteMapping("/places/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletePlace(@PathVariable Long id) {
        log.info("Deleting place with id: {}", id);
        placeService.deletePlace(id);
        return ResponseEntity.noContent().build();
    }

    // Client accessible endpoints
    @GetMapping("/places/{id}")
    public ResponseEntity<PlaceResponse> getPlaceById(@PathVariable Long id) {
        log.debug("Fetching place with id: {}", id);
        return ResponseEntity.ok(placeService.getPlaceById(id));
    }

    @GetMapping("/places")
    public ResponseEntity<List<PlaceResponse>> getAllPlaces() {
        log.debug("Fetching all places");
        return ResponseEntity.ok(placeService.getAllPlaces());
    }

    // Availability check endpoints
    @GetMapping("/places/{id}/availability")
    public ResponseEntity<Boolean> checkPlaceAvailability(@PathVariable Long id) {
        log.debug("Checking availability for place with id: {}", id);
        return ResponseEntity.ok(placeService.isPlaceAvailable(id));
    }

    // Added new endpoint to check availability at a specific time
    @GetMapping("/places/{id}/availability-at")
    public ResponseEntity<Boolean> checkPlaceAvailabilityAtTime(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateTime) {
        log.debug("Checking availability for place with id: {} at time: {}", id, dateTime);
        return ResponseEntity.ok(placeService.isPlaceAvailableInTime(id, dateTime));
    }

    // Added endpoint to get places by parking
//    @GetMapping("/parkings/{parkingId}/places")
//    public ResponseEntity<List<PlaceResponse>> getPlacesByParking(@PathVariable Long parkingId) {
//        log.debug("Fetching places for parking with id: {}", parkingId);
//        List<PlaceResponse> places = placeService.getPlacesByParkingId(parkingId);
//        return ResponseEntity.ok(places);
//    }

    // Added endpoint to get available places by parking
//    @GetMapping("/parkings/{parkingId}/available-places")
//    public ResponseEntity<List<PlaceResponse>> getAvailablePlacesByParking(@PathVariable Long parkingId) {
//        log.debug("Fetching available places for parking with id: {}", parkingId);
//        List<PlaceResponse> places = placeService.getAvailablePlacesByParkingId(parkingId);
//        return ResponseEntity.ok(places);
//    }
}