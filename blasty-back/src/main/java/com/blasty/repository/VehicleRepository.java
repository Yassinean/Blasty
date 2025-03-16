package com.blasty.repository;

import com.blasty.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    Optional<Vehicle> findByClientId(Long clientId);
    boolean existsByClientId(Long clientId);
    boolean existsByImmatriculation(String immatriculation);
}

