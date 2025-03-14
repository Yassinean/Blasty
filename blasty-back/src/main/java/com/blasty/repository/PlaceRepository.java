package com.blasty.repository;

import com.blasty.model.Parking;
import com.blasty.model.enums.PlaceStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import com.blasty.model.Place;

import java.time.LocalDateTime;
import java.util.List;

public interface PlaceRepository extends JpaRepository<Place,Long>{
    List<Place> findByEtatAndReservedUntilBefore(PlaceStatus etat, LocalDateTime dateTime);
    List<Place> findByParkingId(Long parkingId);
    long countByParking(Parking parking);
}
