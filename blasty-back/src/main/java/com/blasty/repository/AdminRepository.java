package com.blasty.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.blasty.model.Admin;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {
    Optional<Admin> findByEmail(String email);
}
