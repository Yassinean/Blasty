package com.blasty.service.Interface;

import java.util.List;

import com.blasty.dto.request.TransactionRequest;
import com.blasty.dto.response.TransactionResponse;

public interface TransactionService {
    TransactionResponse createTransaction(TransactionRequest request);

    TransactionResponse getTransactionById(Long id);

    List<TransactionResponse> getAllTransactions();

    String generateReceipt(Long transactionId);
}
