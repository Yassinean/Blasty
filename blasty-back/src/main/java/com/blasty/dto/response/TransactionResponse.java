package com.blasty.dto.response;

import java.time.LocalDateTime;

import com.blasty.model.enums.TypeTransaction;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TransactionResponse {
    private Long id;
    private double amount;
    private LocalDateTime date;
    private TypeTransaction type;
    private Long ticketId;
}
