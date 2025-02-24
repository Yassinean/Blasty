package com.blasty.controller;

import com.blasty.dto.request.TransactionRequest;
import com.blasty.dto.response.TransactionResponse;
import com.blasty.service.Interface.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {
    private final TransactionService transactionService;

    @PostMapping
    public ResponseEntity<TransactionResponse> createTransaction(@Valid @RequestBody TransactionRequest request) {
        TransactionResponse response = transactionService.createTransaction(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TransactionResponse> getTransactionById(@PathVariable Long id) {
        TransactionResponse response = transactionService.getTransactionById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<TransactionResponse>> getAllTransactions() {
        List<TransactionResponse> responses = transactionService.getAllTransactions();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}/receipt")
    public ResponseEntity<String> generateReceipt(@PathVariable Long id) {
        String receipt = transactionService.generateReceipt(id);
        return ResponseEntity.ok(receipt);
    }
}