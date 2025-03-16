package com.blasty.controller;

import com.blasty.dto.request.VehicleRequest;
import com.blasty.dto.response.VehicleResponse;
import com.blasty.service.Interface.VehicleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RequiredArgsConstructor
@RestController
@RequestMapping("/api/{clientId}/my-vehicle")
public class VehicleController {

    private final VehicleService vehicleService;

    @PostMapping
    public ResponseEntity<VehicleResponse> registerVehicle(
            @PathVariable Long clientId,
            @Valid @RequestBody VehicleRequest requestDto) {
        VehicleResponse responseDto = vehicleService.createVehicle(clientId, requestDto);
        return new ResponseEntity<>(responseDto, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<VehicleResponse> getClientVehicle(@PathVariable Long clientId) {
        VehicleResponse vehicle = vehicleService.getVehicleByClientId(clientId);
        return ResponseEntity.ok(vehicle);
    }

    @PutMapping
    public ResponseEntity<VehicleResponse> updateClientVehicle(
            @PathVariable Long clientId,
            @Valid @RequestBody VehicleRequest requestDto) {
        VehicleResponse vehicle = vehicleService.updateVehicleByClientId(clientId, requestDto);
        return ResponseEntity.ok(vehicle);
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteClientVehicle(@PathVariable Long clientId) {
        vehicleService.deleteVehicleByClientId(clientId);
        return ResponseEntity.noContent().build();
    }
}
