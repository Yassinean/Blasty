package com.blasty.repository;

import com.blasty.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByParkingAndStartDateBetween(Long parkingId, LocalDateTime startDate, LocalDateTime endDate);
    List<Reservation> findByClientId(Long clientId);
}
