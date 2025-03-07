package com.blasty.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.blasty.model.Client;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {
    Optional<Client> findByPhone(String phone);
    Boolean existsByPhone(String phone);
}