package com.blasty.controller;

import com.blasty.dto.request.ParkingRequest;
import com.blasty.dto.response.ParkingOccupancyResponse;
import com.blasty.dto.response.ParkingResponse;
import com.blasty.dto.response.ParkingRevenueResponse;
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

    // Admin endpoints
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ParkingResponse> createParking(@Valid @RequestBody ParkingRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(parkingService.createParking(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ParkingResponse> updateParking(
            @PathVariable Long id,
            @Valid @RequestBody ParkingRequest request) {
        return ResponseEntity.ok(parkingService.updateParking(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteParking(@PathVariable Long id) {
        parkingService.deleteParking(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/occupancy")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ParkingOccupancyResponse>> getParkingOccupancy(@PathVariable Long id) {
        return ResponseEntity.ok(parkingService.getParkingOccupancy(id));
    }

    @GetMapping("/{id}/revenue")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ParkingRevenueResponse>> getParkingRevenue(
            @PathVariable Long id ,@RequestParam(defaultValue = "month") String period) {
        return ResponseEntity.ok(parkingService.getParkingRevenue(id, period));
    }

    // Client accessible endpoints
    @GetMapping("/{id}")
    public ResponseEntity<ParkingResponse> getParkingById(@PathVariable Long id) {
        return ResponseEntity.ok(parkingService.getParkingById(id));
    }

    @GetMapping
    public ResponseEntity<List<ParkingResponse>> getAllParkings() {
        return ResponseEntity.ok(parkingService.getAllParkings());
    }

    @GetMapping("/{id}/available-places")
    @PreAuthorize("hasAnyRole('ADMIN','CLIENT')")
    public ResponseEntity<Integer> getAvailablePlaces(@PathVariable Long id) {
        return ResponseEntity.ok(parkingService.getAvailablePlaces(id));
    }
}