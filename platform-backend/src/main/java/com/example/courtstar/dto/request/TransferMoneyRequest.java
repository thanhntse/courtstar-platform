package com.example.courtstar.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor

public class TransferMoneyRequest {
    private String nameBanking;
    private String numberBanking;
    private String amount;
    String cardHolderName;
    @Builder.Default
    private LocalDateTime dateCreateWithdrawalOrder = LocalDateTime.now();
}
