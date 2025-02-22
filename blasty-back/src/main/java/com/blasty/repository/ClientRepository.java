package com.blasty.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.blasty.model.Client;

public interface ClientRepository extends JpaRepository<Client, Long> {
}
