package com.blasty.controller;

import com.blasty.dto.request.ParkingRequest;
import com.blasty.dto.response.ParkingResponse;
import com.blasty.service.Interface.ParkingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/parkings")
@RequiredArgsConstructor
public class ParkingController {
    private final ParkingService parkingService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ParkingResponse> createParking(@Valid @RequestBody ParkingRequest request) {
        ParkingResponse response = parkingService.createParking(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<ParkingResponse> getParkingById(@PathVariable Long id) {
        ParkingResponse response = parkingService.getParkingById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ParkingResponse>> getAllParkings() {
        List<ParkingResponse> responses = parkingService.getAllParkings();
        return ResponseEntity.ok(responses);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ParkingResponse> updateParking(@PathVariable Long id, @Valid @RequestBody ParkingRequest request) {
        ParkingResponse response = parkingService.updateParking(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteParking(@PathVariable Long id) {
        parkingService.deleteParking(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/available-places")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<Integer> getAvailablePlaces(@PathVariable Long id) {
        int availablePlaces = parkingService.getAvailablePlaces(id);
        return ResponseEntity.ok(availablePlaces);
    } 
}