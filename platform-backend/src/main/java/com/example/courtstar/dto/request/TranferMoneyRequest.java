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

public class TranferMoneyRequest {
    private String nameBanking;
    private String numberBanking;
    private double amount;
    private LocalDateTime dateCreateWithdrawalOrder = LocalDateTime.now();
}
