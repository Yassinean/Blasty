package com.blasty.repository;

import com.blasty.model.Reservation;
import com.blasty.model.enums.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    @Query("SELECT r FROM Reservation r WHERE r.place.parking.id = :parkingId AND r.startDate BETWEEN :startDate AND :endDate")
    List<Reservation> findByParkingIdAndStartDateBetween(Long parkingId, LocalDateTime startDate,
            LocalDateTime endDate);

    List<Reservation> findByStatusAndEndDateBefore(ReservationStatus status, LocalDateTime endDate);

    List<Reservation> findByClientId(Long clientId);
}
