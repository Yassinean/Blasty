package com.blasty.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import com.blasty.dto.request.ReservationRequest;
import com.blasty.dto.response.ReservationResponse;
import com.blasty.exception.PlaceNotAvailableException;
import com.blasty.exception.ResourceNotFoundException;
import com.blasty.mapper.ReservationMapper;
import com.blasty.model.Client;
import com.blasty.model.Place;
import com.blasty.model.Reservation;
import com.blasty.model.Vehicle;
import com.blasty.model.enums.PlaceStatus;
import com.blasty.model.enums.ReservationStatus;
import com.blasty.model.enums.TypePlace;
import com.blasty.model.enums.VehiculeType;
import com.blasty.repository.ClientRepository;
import com.blasty.repository.PlaceRepository;
import com.blasty.repository.ReservationRepository;
import com.blasty.repository.VehicleRepository;
import com.blasty.service.Implementation.ReservationServiceImpl;
import com.blasty.service.Interface.PlaceService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class ReservationServiceImplTest {

    @Mock
    private ReservationRepository reservationRepository;

    @Mock
    private ClientRepository clientRepository;

    @Mock
    private PlaceRepository placeRepository;

    @Mock
    private VehicleRepository vehicleRepository;

    @Mock
    private PlaceService placeService;

    @Mock
    private ReservationMapper reservationMapper;

    @InjectMocks
    private ReservationServiceImpl reservationService;

    private ReservationRequest reservationRequest;
    private Reservation reservation;
    private ReservationResponse reservationResponse;
    private Client client;
    private Place place;
    private Vehicle vehicle;

    @BeforeEach
    void setUp() {
        reservationRequest = new ReservationRequest();
        reservationRequest.setClientId(1L);
        reservationRequest.setPlaceId(2L);
        reservationRequest.setVehicleId(3L);
        reservationRequest.setReservationDate(LocalDateTime.now().plusHours(1));

        client = new Client();
        client.setId(1L);

        place = Place.builder()
                .id(2L)
                .type(TypePlace.STANDARD)
                .etat(PlaceStatus.DISPONIBLE)
                .build();

        vehicle = Vehicle.builder()
                .id(3L)
                .type(VehiculeType.VOITURE)
                .client(client)
                .build();

        reservation = Reservation.builder()
                .id(1L)
                .client(client)
                .place(place)
                .vehicle(vehicle)
                .startDate(reservationRequest.getReservationDate())
                .endDate(reservationRequest.getReservationDate().plusHours(1))
                .status(ReservationStatus.PENDING)
                .build();

        reservationResponse = ReservationResponse.builder()
                .id(1L)
                .clientId(1L)
                .placeId(2L)
                .vehicleId(3L)
                .reservationDate(reservationRequest.getReservationDate())
                .endDate(reservationRequest.getReservationDate().plusHours(1))
                .status(ReservationStatus.PENDING)
                .build();
    }

    @Test
    void testCreateReservation_Success() {
        // Mock behavior
        when(clientRepository.findById(1L)).thenReturn(Optional.of(client));
        when(placeRepository.findById(2L)).thenReturn(Optional.of(place));
        when(vehicleRepository.findById(3L)).thenReturn(Optional.of(vehicle));
        when(placeService.isPlaceAvailableInTime(2L, reservationRequest.getReservationDate())).thenReturn(true);
        when(reservationMapper.toEntity(reservationRequest)).thenReturn(reservation);
        when(reservationRepository.save(reservation)).thenReturn(reservation);
        when(reservationMapper.toResponse(reservation)).thenReturn(reservationResponse);

        // Call method
        ReservationResponse response = reservationService.createReservation(reservationRequest);

        // Assertions
        assertNotNull(response);
        assertEquals(reservationResponse, response);
        verify(clientRepository, times(1)).findById(1L);
        verify(placeRepository, times(1)).findById(2L);
        verify(vehicleRepository, times(1)).findById(3L);
        verify(placeService, times(1)).isPlaceAvailableInTime(2L, reservationRequest.getReservationDate());
        verify(reservationMapper, times(1)).toEntity(reservationRequest);
        verify(reservationRepository, times(1)).save(reservation);
        verify(reservationMapper, times(1)).toResponse(reservation);
    }

    @Test
    void testCreateReservation_ClientNotFound() {
        // Mock behavior
        when(clientRepository.findById(1L)).thenReturn(Optional.empty());

        // Call method and assert exception
        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class, () -> {
            reservationService.createReservation(reservationRequest);
        });

        assertEquals("Client not found with id: 1", exception.getMessage());
    }

    @Test
    void testCreateReservation_PlaceNotFound() {
        // Mock behavior
        when(clientRepository.findById(1L)).thenReturn(Optional.of(client));
        when(placeRepository.findById(2L)).thenReturn(Optional.empty());

        // Call method and assert exception
        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class, () -> {
            reservationService.createReservation(reservationRequest);
        });

        assertEquals("Place not found with id: 2", exception.getMessage());
    }

    @Test
    void testCreateReservation_VehicleNotFound() {
        // Mock behavior
        when(clientRepository.findById(1L)).thenReturn(Optional.of(client));
        when(placeRepository.findById(2L)).thenReturn(Optional.of(place));
        when(vehicleRepository.findById(3L)).thenReturn(Optional.empty());

        // Call method and assert exception
        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class, () -> {
            reservationService.createReservation(reservationRequest);
        });

        assertEquals("Vehicle not found with id: 3", exception.getMessage());
    }

//    @Test
//    void testCreateReservation_VehicleNotBelongToClient() {
//        // Set vehicle to belong to a different client
//        vehicle.setClient(new Client(2L));
//
//        // Mock behavior
//        when(clientRepository.findById(1L)).thenReturn(Optional.of(client));
//        when(placeRepository.findById(2L)).thenReturn(Optional.of(place));
//        when(vehicleRepository.findById(3L)).thenReturn(Optional.of(vehicle));
//
//        // Call method and assert exception
//        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
//            reservationService.createReservation(reservationRequest);
//        });
//
//        assertEquals("Vehicle does not belong to the requesting client", exception.getMessage());
//    }

    @Test
    void testCreateReservation_PlaceNotAvailable() {
        // Mock behavior
        when(clientRepository.findById(1L)).thenReturn(Optional.of(client));
        when(placeRepository.findById(2L)).thenReturn(Optional.of(place));
        when(vehicleRepository.findById(3L)).thenReturn(Optional.of(vehicle));
        when(placeService.isPlaceAvailableInTime(2L, reservationRequest.getReservationDate())).thenReturn(false);

        // Call method and assert exception
        PlaceNotAvailableException exception = assertThrows(PlaceNotAvailableException.class, () -> {
            reservationService.createReservation(reservationRequest);
        });

        assertEquals("Place is not available at the requested time", exception.getMessage());
    }

    @Test
    void testGetReservationById_Success() {
        // Mock behavior
        when(reservationRepository.findById(1L)).thenReturn(Optional.of(reservation));
        when(reservationMapper.toResponse(reservation)).thenReturn(reservationResponse);

        // Call method
        ReservationResponse response = reservationService.getReservationById(1L);

        // Assertions
        assertNotNull(response);
        assertEquals(reservationResponse, response);
        verify(reservationRepository, times(1)).findById(1L);
        verify(reservationMapper, times(1)).toResponse(reservation);
    }

    @Test
    void testGetReservationById_NotFound() {
        // Mock behavior
        when(reservationRepository.findById(1L)).thenReturn(Optional.empty());

        // Call method and assert exception
        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class, () -> {
            reservationService.getReservationById(1L);
        });

        assertEquals("Reservation not found with id: 1", exception.getMessage());
    }

    @Test
    void testGetAllReservations_Success() {
        // Mock behavior
        when(reservationRepository.findAll()).thenReturn(Collections.singletonList(reservation));
        when(reservationMapper.toResponse(reservation)).thenReturn(reservationResponse);

        // Call method
        List<ReservationResponse> responses = reservationService.getAllReservations();

        // Assertions
        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertEquals(reservationResponse, responses.get(0));
        verify(reservationRepository, times(1)).findAll();
        verify(reservationMapper, times(1)).toResponse(reservation);
    }

    @Test
    void testConfirmReservation_Success() {
        // Mock behavior
        when(reservationRepository.findById(1L)).thenReturn(Optional.of(reservation));
        when(reservationRepository.save(reservation)).thenReturn(reservation);
        when(reservationMapper.toResponse(reservation)).thenReturn(reservationResponse);

        // Call method
        ReservationResponse response = reservationService.confirmReservation(1L);

        // Assertions
        assertNotNull(response);
        assertEquals(ReservationStatus.CONFIRMED, reservation.getStatus());
        verify(reservationRepository, times(1)).findById(1L);
        verify(reservationRepository, times(1)).save(reservation);
        verify(reservationMapper, times(1)).toResponse(reservation);
        verify(placeService, times(1)).occupyPlace(2L);
    }

    @Test
    void testCancelReservation_Success() {
        // Mock behavior
        when(reservationRepository.findById(1L)).thenReturn(Optional.of(reservation));
        when(reservationRepository.save(reservation)).thenReturn(reservation);
        when(reservationMapper.toResponse(reservation)).thenReturn(reservationResponse);

        // Call method
        ReservationResponse response = reservationService.cancelReservation(1L);

        // Assertions
        assertNotNull(response);
        assertEquals(ReservationStatus.CANCELLED, reservation.getStatus());
        verify(reservationRepository, times(1)).findById(1L);
        verify(reservationRepository, times(1)).save(reservation);
        verify(reservationMapper, times(1)).toResponse(reservation);
        verify(placeService, times(1)).freePlace(2L);
    }

    @Test
    void testCompleteReservation_Success() {
        // Set reservation status to CONFIRMED
        reservation.setStatus(ReservationStatus.CONFIRMED);

        // Mock behavior
        when(reservationRepository.findById(1L)).thenReturn(Optional.of(reservation));
        when(reservationRepository.save(reservation)).thenReturn(reservation);
        when(reservationMapper.toResponse(reservation)).thenReturn(reservationResponse);

        // Call method
        ReservationResponse response = reservationService.completeReservation(1L);

        // Assertions
        assertNotNull(response);
        assertEquals(ReservationStatus.COMPLETED, reservation.getStatus());
        verify(reservationRepository, times(1)).findById(1L);
        verify(reservationRepository, times(1)).save(reservation);
        verify(reservationMapper, times(1)).toResponse(reservation);
        verify(placeService, times(1)).freePlace(2L);
    }

    @Test
    void testDeleteReservation_Success() {
        // Mock behavior
        when(reservationRepository.findById(1L)).thenReturn(Optional.of(reservation));

        // Call method
        reservationService.deleteReservation(1L);

        // Verify
        verify(reservationRepository, times(1)).findById(1L);
        verify(reservationRepository, times(1)).deleteById(1L);
        verify(placeService, times(1)).freePlace(2L);
    }
}