package com.blasty.repository;

import com.blasty.model.Place;
import com.blasty.model.Reservation;
import com.blasty.model.enums.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByPlaceAndStatus(Place place, ReservationStatus status);
    List<Reservation> findByClientId(Long clientId);
}
