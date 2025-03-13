package com.blasty.service.Interface;

import com.blasty.dto.request.ReservationRequest;
import com.blasty.dto.response.ReservationResponse;
import com.blasty.model.Reservation;

import java.time.LocalDateTime;
import java.util.List;

public interface ReservationService {
    ReservationResponse createReservation(ReservationRequest request);
    ReservationResponse getReservationById(Long id);
    List<ReservationResponse> getAllReservations();
    ReservationResponse confirmReservation(Long id);
    ReservationResponse cancelReservation(Long id);
    void deleteReservation(Long id);
    List<ReservationResponse> getReservationsByClientId(Long clientId);
    ReservationResponse completeReservation(Long id);
}