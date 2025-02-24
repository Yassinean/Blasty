package com.blasty.dto.request;

import com.blasty.model.enums.TypeTransaction;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TransactionRequest {
    @NotNull(message = "Le montant est obligatoire")
    private Double amount;

    @NotNull(message = "Le type de transaction est obligatoire")
    private TypeTransaction type;

    @NotNull(message = "L'ID du ticket est obligatoire")
    private Long ticketId;
}
