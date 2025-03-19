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
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new ResourceNotFoundException("Client not found with id: " + clientId));

        if (vehicleRepository.existsByClientId(clientId)) {
            throw new IllegalArgumentException("Client already has a registered vehicle");
        }

        if (vehicleRepository.existsByImmatriculation(requestDto.getImmatriculation())) {
            throw new IllegalArgumentException("Vehicle with this immatriculation already exists");
        }

        Vehicle vehicle = vehicleMapper.toEntity(requestDto);
        vehicle.setClient(client);
        Vehicle savedVehicle = vehicleRepository.save(vehicle);

        log.info("Created vehicle with id: {} for client: {}", savedVehicle.getId(), clientId);
        return vehicleMapper.toResponse(savedVehicle);
    }

    @Override
    public VehicleResponse getVehicleByClientId(Long clientId) {
        if (!clientRepository.existsById(clientId)) {
            throw new ResourceNotFoundException("Client not found with id: " + clientId);
        }

        Vehicle vehicle = vehicleRepository.findByClientId(clientId)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found for client id: " + clientId));

        return vehicleMapper.toResponse(vehicle);
    }

    @Override
    @Transactional
    public VehicleResponse updateVehicleByClientId(Long clientId, VehicleRequest requestDto) {
        if (!clientRepository.existsById(clientId)) {
            throw new ResourceNotFoundException("Client not found with id: " + clientId);
        }

        Vehicle vehicle = vehicleRepository.findByClientId(clientId)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found for client id: " + clientId));

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
        if (!clientRepository.existsById(clientId)) {
            throw new ResourceNotFoundException("Client not found with id: " + clientId);
        }

        Vehicle vehicle = vehicleRepository.findByClientId(clientId)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found for client id: " + clientId));

        vehicleRepository.delete(vehicle);

        log.info("Deleted vehicle with id: {} for client: {}", vehicle.getId(), clientId);
    }

    @Override
    public boolean existsByClientId(Long clientId) {
        return vehicleRepository.existsByClientId(clientId);
    }
}