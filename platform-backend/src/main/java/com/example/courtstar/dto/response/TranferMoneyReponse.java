package com.example.courtstar.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TranferMoneyReponse {
    String nameBanking;
    String numberBanking;
    double amount;
    boolean status;
    LocalDateTime dateCreateWithdrawalOrder;
}
