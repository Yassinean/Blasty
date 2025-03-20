package com.blasty.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Optional;

import com.blasty.dto.request.VehicleRequest;
import com.blasty.dto.response.VehicleResponse;
import com.blasty.exception.ResourceNotFoundException;
import com.blasty.mapper.VehicleMapper;
import com.blasty.model.Client;
import com.blasty.model.Vehicle;
import com.blasty.model.enums.VehiculeType;
import com.blasty.repository.ClientRepository;
import com.blasty.repository.VehicleRepository;
import com.blasty.service.Implementation.VehicleServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class VehicleServiceImplTest {

    @Mock
    private VehicleRepository vehicleRepository;

    @Mock
    private ClientRepository clientRepository;

    @Mock
    private VehicleMapper vehicleMapper;

    @InjectMocks
    private VehicleServiceImpl vehicleService;

    private VehicleRequest vehicleRequest;
    private Vehicle vehicle;
    private VehicleResponse vehicleResponse;
    private Client client;

    @BeforeEach
    void setUp() {
        vehicleRequest = VehicleRequest.builder()
                .immatriculation("ABC-123")
                .type(VehiculeType.VOITURE)
                .build();

        client = Client.builder()
                .id(1L)
                .build();

        vehicle = Vehicle.builder()
                .id(1L)
                .immatriculation("ABC-123")
                .type(VehiculeType.VOITURE)
                .client(client)
                .build();

        vehicleResponse = VehicleResponse.builder()
                .id(1L)
                .immatriculation("ABC-123")
                .type("VOITURE")
                .clientId(1L)
                .build();
    }

    @Test
    void testCreateVehicle_Success() {
        // Mock behavior
        when(clientRepository.findById(1L)).thenReturn(Optional.of(client));
        when(vehicleRepository.existsByClientId(1L)).thenReturn(false);
        when(vehicleRepository.existsByImmatriculation("ABC-123")).thenReturn(false);
        when(vehicleMapper.toEntity(vehicleRequest)).thenReturn(vehicle);
        when(vehicleRepository.save(vehicle)).thenReturn(vehicle);
        when(vehicleMapper.toResponse(vehicle)).thenReturn(vehicleResponse);

        // Call method
        VehicleResponse response = vehicleService.createVehicle(1L, vehicleRequest);

        // Assertions
        assertNotNull(response);
        assertEquals(vehicleResponse, response);
        verify(clientRepository, times(1)).findById(1L);
        verify(vehicleRepository, times(1)).existsByClientId(1L);
        verify(vehicleRepository, times(1)).existsByImmatriculation("ABC-123");
        verify(vehicleMapper, times(1)).toEntity(vehicleRequest);
        verify(vehicleRepository, times(1)).save(vehicle);
        verify(vehicleMapper, times(1)).toResponse(vehicle);
    }

    @Test
    void testCreateVehicle_ClientNotFound() {
        // Mock behavior
        when(clientRepository.findById(1L)).thenReturn(Optional.empty());

        // Call method and assert exception
        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class, () -> {
            vehicleService.createVehicle(1L, vehicleRequest);
        });

        assertEquals("Client not found with id: 1", exception.getMessage());
    }

    @Test
    void testCreateVehicle_ClientAlreadyHasVehicle() {
        // Mock behavior
        when(clientRepository.findById(1L)).thenReturn(Optional.of(client));
        when(vehicleRepository.existsByClientId(1L)).thenReturn(true);

        // Call method and assert exception
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            vehicleService.createVehicle(1L, vehicleRequest);
        });

        assertEquals("Client already has a registered vehicle", exception.getMessage());
    }

    @Test
    void testCreateVehicle_ImmatriculationAlreadyExists() {
        // Mock behavior
        when(clientRepository.findById(1L)).thenReturn(Optional.of(client));
        when(vehicleRepository.existsByClientId(1L)).thenReturn(false);
        when(vehicleRepository.existsByImmatriculation("ABC-123")).thenReturn(true);

        // Call method and assert exception
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            vehicleService.createVehicle(1L, vehicleRequest);
        });

        assertEquals("Vehicle with this immatriculation already exists", exception.getMessage());
    }

    @Test
    void testGetVehicleByClientId_Success() {
        // Mock behavior
        when(clientRepository.existsById(1L)).thenReturn(true);
        when(vehicleRepository.findByClientId(1L)).thenReturn(Optional.of(vehicle));
        when(vehicleMapper.toResponse(vehicle)).thenReturn(vehicleResponse);

        // Call method
        VehicleResponse response = vehicleService.getVehicleByClientId(1L);

        // Assertions
        assertNotNull(response);
        assertEquals(vehicleResponse, response);
        verify(clientRepository, times(1)).existsById(1L);
        verify(vehicleRepository, times(1)).findByClientId(1L);
        verify(vehicleMapper, times(1)).toResponse(vehicle);
    }

    @Test
    void testGetVehicleByClientId_ClientNotFound() {
        // Mock behavior
        when(clientRepository.existsById(1L)).thenReturn(false);

        // Call method and assert exception
        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class, () -> {
            vehicleService.getVehicleByClientId(1L);
        });

        assertEquals("Client not found with id: 1", exception.getMessage());
    }

    @Test
    void testGetVehicleByClientId_VehicleNotFound() {
        // Mock behavior
        when(clientRepository.existsById(1L)).thenReturn(true);
        when(vehicleRepository.findByClientId(1L)).thenReturn(Optional.empty());

        // Call method and assert exception
        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class, () -> {
            vehicleService.getVehicleByClientId(1L);
        });

        assertEquals("Vehicle not found for client id: 1", exception.getMessage());
    }

    @Test
    void testUpdateVehicleByClientId_Success() {
        // Mock behavior
        when(clientRepository.existsById(1L)).thenReturn(true);
        when(vehicleRepository.findByClientId(1L)).thenReturn(Optional.of(vehicle));
        when(vehicleRepository.existsByImmatriculation("NEW-123")).thenReturn(false); // New immatriculation
        when(vehicleRepository.save(vehicle)).thenReturn(vehicle);
        when(vehicleMapper.toResponse(vehicle)).thenReturn(vehicleResponse);

        // Set a new immatriculation in the request
        vehicleRequest.setImmatriculation("NEW-123");

        // Call method
        VehicleResponse response = vehicleService.updateVehicleByClientId(1L, vehicleRequest);

        // Assertions
        assertNotNull(response);
        assertEquals(vehicleResponse, response);
        verify(clientRepository, times(1)).existsById(1L);
        verify(vehicleRepository, times(1)).findByClientId(1L);
        verify(vehicleRepository, times(1)).existsByImmatriculation("NEW-123");
        verify(vehicleRepository, times(1)).save(vehicle);
        verify(vehicleMapper, times(1)).toResponse(vehicle);
    }

    @Test
    void testUpdateVehicleByClientId_ImmatriculationAlreadyExists() {
        // Mock behavior
        when(clientRepository.existsById(1L)).thenReturn(true);
        when(vehicleRepository.findByClientId(1L)).thenReturn(Optional.of(vehicle));
        when(vehicleRepository.existsByImmatriculation("NEW-123")).thenReturn(true); // New immatriculation already exists

        // Set a new immatriculation in the request
        vehicleRequest.setImmatriculation("NEW-123");

        // Call method and assert exception
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            vehicleService.updateVehicleByClientId(1L, vehicleRequest);
        });

        assertEquals("Vehicle with this immatriculation already exists", exception.getMessage());
        verify(clientRepository, times(1)).existsById(1L);
        verify(vehicleRepository, times(1)).findByClientId(1L);
        verify(vehicleRepository, times(1)).existsByImmatriculation("NEW-123");
    }

    @Test
    void testDeleteVehicleByClientId_Success() {
        // Mock behavior
        when(clientRepository.existsById(1L)).thenReturn(true);
        when(vehicleRepository.findByClientId(1L)).thenReturn(Optional.of(vehicle));

        // Call method
        vehicleService.deleteVehicleByClientId(1L);

        // Verify
        verify(clientRepository, times(1)).existsById(1L);
        verify(vehicleRepository, times(1)).findByClientId(1L);
        verify(vehicleRepository, times(1)).delete(vehicle); // Verify delete(entity) is called
    }

    @Test
    void testExistsByClientId_Success() {
        // Mock behavior
        when(vehicleRepository.existsByClientId(1L)).thenReturn(true);

        // Call method
        boolean exists = vehicleService.existsByClientId(1L);

        // Assertions
        assertTrue(exists);
        verify(vehicleRepository, times(1)).existsByClientId(1L);
    }
}