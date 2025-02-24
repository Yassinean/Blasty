package com.blasty.service.Implementation;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.blasty.dto.request.TransactionRequest;
import com.blasty.dto.response.TransactionResponse;
import com.blasty.mapper.TransactionMapper;
import com.blasty.model.Transaction;
import com.blasty.repository.TransactionRepository;
import com.blasty.service.Interface.TransactionService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {
    private final TransactionRepository transactionRepository;
    private final TransactionMapper transactionMapper;

    @Override
    public TransactionResponse createTransaction(TransactionRequest request) {
        Transaction transaction = transactionMapper.toEntity(request);
        return transactionMapper.toResponse(transactionRepository.save(transaction));
    }

    @Override
    public TransactionResponse getTransactionById(Long id) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction non trouvée"));
        return transactionMapper.toResponse(transaction);
    }

    @Override
    public List<TransactionResponse> getAllTransactions() {
        return transactionRepository.findAll().stream()
                .map(transactionMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public String generateReceipt(Long transactionId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction non trouvée"));
        return "Reçu pour la transaction " + transaction.getId() + "\n"
                + "Montant: " + transaction.getAmount() + "\n"
                + "Date: " + transaction.getDate() + "\n"
                + "Type: " + transaction.getType();
    }
}