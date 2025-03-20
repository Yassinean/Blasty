package com.blasty.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import com.blasty.dto.request.ParkingRequest;
import com.blasty.dto.response.ParkingOccupancyResponse;
import com.blasty.dto.response.ParkingResponse;
import com.blasty.dto.response.ParkingRevenueResponse;
import com.blasty.exception.ResourceNotFoundException;
import com.blasty.mapper.ParkingMapper;
import com.blasty.model.Parking;
import com.blasty.model.enums.ParkingStatus;
import com.blasty.repository.ParkingRepository;
import com.blasty.repository.ReservationRepository;
import com.blasty.service.Implementation.ParkingServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class ParkingServiceImplTest {

    @Mock
    private ParkingRepository parkingRepository;

    @Mock
    private ParkingMapper parkingMapper;

    @Mock
    private ReservationRepository reservationRepository;

    @InjectMocks
    private ParkingServiceImpl parkingService;

    private ParkingRequest parkingRequest;
    private Parking parking;
    private ParkingResponse parkingResponse;

    @BeforeEach
    void setUp() {
        parkingRequest = new ParkingRequest();
        parkingRequest.setName("Parking A");
        parkingRequest.setAddress("123 Main St");
        parkingRequest.setCapacity(100);
        parkingRequest.setWidth(50);
        parkingRequest.setLength(100);
        parkingRequest.setStatus(ParkingStatus.OPEN);

        parking = Parking.builder()
                .id(1L)
                .name("Parking A")
                .address("123 Main St")
                .capacity(100)
                .width(50)
                .length(100)
                .status(ParkingStatus.OPEN)
                .occupiedSpaces(0)
                .build();

        parkingResponse = ParkingResponse.builder()
                .id(1L)
                .name("Parking A")
                .address("123 Main St")
                .capacity(100)
                .occupiedSpaces(0)
                .availablePlaces(100)
                .status(ParkingStatus.OPEN)
                .width(50)
                .length(100)
                .surface(5000)
                .build();
    }

    @Test
    void testCreateParking_Success() {
        // Mock behavior
        when(parkingMapper.toEntity(parkingRequest)).thenReturn(parking);
        when(parkingRepository.save(parking)).thenReturn(parking);
        when(parkingMapper.toResponse(parking)).thenReturn(parkingResponse);

        // Call method
        ParkingResponse response = parkingService.createParking(parkingRequest);

        // Assertions
        assertNotNull(response);
        assertEquals(parkingResponse, response);
        verify(parkingMapper, times(1)).toEntity(parkingRequest);
        verify(parkingRepository, times(1)).save(parking);
        verify(parkingMapper, times(1)).toResponse(parking);
    }

    @Test
    void testCreateParking_CapacityExceedsMax() {
        // Set capacity to exceed max capacity
        parkingRequest.setCapacity(1000);

        // Call method and assert exception
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            parkingService.createParking(parkingRequest);
        });

        assertEquals("La capacité demandée dépasse la capacité maximale basée sur la surface du parking", exception.getMessage());
    }

    @Test
    void testUpdateParking_Success() {
        // Mock behavior
        when(parkingRepository.findById(1L)).thenReturn(Optional.of(parking));
        when(parkingRepository.save(parking)).thenReturn(parking);
        when(parkingMapper.toResponse(parking)).thenReturn(parkingResponse);

        // Call method
        ParkingResponse response = parkingService.updateParking(1L, parkingRequest);

        // Assertions
        assertNotNull(response);
        assertEquals(parkingResponse, response);
        verify(parkingRepository, times(1)).findById(1L);
        verify(parkingRepository, times(1)).save(parking);
        verify(parkingMapper, times(1)).toResponse(parking);
    }

    @Test
    void testUpdateParking_NotFound() {
        // Mock behavior
        when(parkingRepository.findById(1L)).thenReturn(Optional.empty());

        // Call method and assert exception
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            parkingService.updateParking(1L, parkingRequest);
        });

        assertEquals("Parking non trouvé", exception.getMessage());
    }

    @Test
    void testGetParkingById_Success() {
        // Mock behavior
        when(parkingRepository.findById(1L)).thenReturn(Optional.of(parking));
        when(parkingMapper.toResponse(parking)).thenReturn(parkingResponse);

        // Call method
        ParkingResponse response = parkingService.getParkingById(1L);

        // Assertions
        assertNotNull(response);
        assertEquals(parkingResponse, response);
        verify(parkingRepository, times(1)).findById(1L);
        verify(parkingMapper, times(1)).toResponse(parking);
    }

    @Test
    void testGetParkingById_NotFound() {
        // Mock behavior
        when(parkingRepository.findById(1L)).thenReturn(Optional.empty());

        // Call method and assert exception
        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class, () -> {
            parkingService.getParkingById(1L);
        });

        assertEquals("Parking non trouvé", exception.getMessage());
    }

    @Test
    void testGetAllParkings_Success() {
        // Mock behavior
        when(parkingRepository.findAll()).thenReturn(Collections.singletonList(parking));
        when(parkingMapper.toResponse(parking)).thenReturn(parkingResponse);

        // Call method
        List<ParkingResponse> responses = parkingService.getAllParkings();

        // Assertions
        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertEquals(parkingResponse, responses.get(0));
        verify(parkingRepository, times(1)).findAll();
        verify(parkingMapper, times(1)).toResponse(parking);
    }

    @Test
    void testDeleteParking_Success() {
        // Mock behavior
        when(parkingRepository.findById(1L)).thenReturn(Optional.of(parking));

        // Call method
        parkingService.deleteParking(1L);

        // Verify
        verify(parkingRepository, times(1)).findById(1L);
        verify(parkingRepository, times(1)).delete(parking);
    }

    @Test
    void testDeleteParking_NotFound() {
        // Mock behavior
        when(parkingRepository.findById(1L)).thenReturn(Optional.empty());

        // Call method and assert exception
        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class, () -> {
            parkingService.deleteParking(1L);
        });

        assertEquals("Pakring not found with id :1", exception.getMessage());
    }

    @Test
    void testGetParkingOccupancy_Success() {
        // Mock behavior
        when(parkingRepository.findById(1L)).thenReturn(Optional.of(parking));

        // Call method
        ParkingOccupancyResponse response = parkingService.getParkingOccupancy(1L);

        // Assertions
        assertNotNull(response);
        assertEquals(1L, response.getParkingId());
        assertEquals("Parking A", response.getParkingName());
        assertEquals(100, response.getTotalCapacity());
        assertEquals(0, response.getOccupiedSpaces());
        assertEquals(0.0, response.getOccupancyRate());
        verify(parkingRepository, times(1)).findById(1L);
    }

    @Test
    void testIncrementOccupiedSpaces_Success() {
        // Mock behavior
        when(parkingRepository.findById(1L)).thenReturn(Optional.of(parking));
        when(parkingRepository.save(parking)).thenReturn(parking);

        // Call method
        parkingService.incrementOccupiedSpaces(1L);

        // Assertions
        assertEquals(1, parking.getOccupiedSpaces());
        verify(parkingRepository, times(1)).findById(1L);
        verify(parkingRepository, times(1)).save(parking);
    }

    @Test
    void testDecrementOccupiedSpaces_Success() {
        // Set initial occupied spaces
        parking.setOccupiedSpaces(1);

        // Mock behavior
        when(parkingRepository.findById(1L)).thenReturn(Optional.of(parking));
        when(parkingRepository.save(parking)).thenReturn(parking);

        // Call method
        parkingService.decrementOccupiedSpaces(1L);

        // Assertions
        assertEquals(0, parking.getOccupiedSpaces());
        verify(parkingRepository, times(1)).findById(1L);
        verify(parkingRepository, times(1)).save(parking);
    }
}