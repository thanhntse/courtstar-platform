package com.example.courtstar.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AuthWithdrawalOrderResponse {
    String nameBanking;
    String numberBanking;
    double amount;
    boolean status;
    LocalDateTime dateAuthenticate;
}
