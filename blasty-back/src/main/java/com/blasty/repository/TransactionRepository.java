package com.blasty.repository;

import com.blasty.model.Parking;
import com.blasty.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
//    List<Transaction> findByParkingAndTransactionDateBetween(Parking parking, LocalDateTime from, LocalDateTime to);
}
