package com.blasty.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.blasty.model.Parking;

public interface ParkingRepository extends JpaRepository<Parking,Long> {}
