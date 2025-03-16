package com.blasty.service.Implementation;

import com.blasty.dto.request.VehicleRequest;
import com.blasty.dto.response.VehicleResponse;
import com.blasty.exception.ResourceNotFoundException;
import com.blasty.mapper.VehicleMapper;
import com.blasty.model.Client;
import com.blasty.model.Vehicle;
import com.blasty.repository.ClientRepository;
import com.blasty.repository.VehicleRepository;
import com.blasty.service.Interface.VehicleService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;


@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class VehicleServiceImpl implements VehicleService {

    private final VehicleRepository vehicleRepository;
    private final ClientRepository clientRepository;
    private final VehicleMapper vehicleMapper;

    @Override
    @Transactional
    public VehicleResponse createVehicle(Long clientId, VehicleRequest requestDto) {
        // Check if client exists
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new ResourceNotFoundException("Client not found with id: " + clientId));

        // Check if client already has a vehicle
        if (vehicleRepository.existsByClientId(clientId)) {
            throw new IllegalArgumentException("Client already has a registered vehicle");
        }

        // Check if immatriculation already exists
        if (vehicleRepository.existsByImmatriculation(requestDto.getImmatriculation())) {
            throw new IllegalArgumentException("Vehicle with this immatriculation already exists");
        }

        // Create and save vehicle
        Vehicle vehicle = vehicleMapper.toEntity(requestDto);
        vehicle.setClient(client);
        Vehicle savedVehicle = vehicleRepository.save(vehicle);

        log.info("Created vehicle with id: {} for client: {}", savedVehicle.getId(), clientId);
        return vehicleMapper.toResponse(savedVehicle);
    }

    @Override
    public VehicleResponse getVehicleByClientId(Long clientId) {
        // Check if client exists
        if (!clientRepository.existsById(clientId)) {
            throw new ResourceNotFoundException("Client not found with id: " + clientId);
        }

        // Find vehicle by client id
        Vehicle vehicle = vehicleRepository.findByClientId(clientId)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found for client id: " + clientId));

        return vehicleMapper.toResponse(vehicle);
    }

    @Override
    @Transactional
    public VehicleResponse updateVehicleByClientId(Long clientId, VehicleRequest requestDto) {
        // Check if client exists
        if (!clientRepository.existsById(clientId)) {
            throw new ResourceNotFoundException("Client not found with id: " + clientId);
        }

        // Find vehicle by client id
        Vehicle vehicle = vehicleRepository.findByClientId(clientId)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found for client id: " + clientId));

        // Check if updating to an existing immatriculation
        if (!vehicle.getImmatriculation().equals(requestDto.getImmatriculation()) &&
                vehicleRepository.existsByImmatriculation(requestDto.getImmatriculation())) {
            throw new IllegalArgumentException("Vehicle with this immatriculation already exists");
        }

        // Update vehicle details
        vehicleMapper.updateEntity(vehicle, requestDto);
        Vehicle updatedVehicle = vehicleRepository.save(vehicle);

        log.info("Updated vehicle with id: {} for client: {}", updatedVehicle.getId(), clientId);
        return vehicleMapper.toResponse(updatedVehicle);
    }

    @Override
    @Transactional
    public void deleteVehicleByClientId(Long clientId) {
        // Check if client exists
        if (!clientRepository.existsById(clientId)) {
            throw new ResourceNotFoundException("Client not found with id: " + clientId);
        }

        // Find the vehicle by client id
        Vehicle vehicle = vehicleRepository.findByClientId(clientId)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found for client id: " + clientId));

        // Delete the vehicle by its ID
        vehicleRepository.deleteById(vehicle.getId());

        log.info("Deleted vehicle with id: {} for client: {}", vehicle.getId(), clientId);
    }

    @Override
    public boolean existsByClientId(Long clientId) {
        return vehicleRepository.existsByClientId(clientId);
    }
}