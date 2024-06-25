package com.example.courtstar.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class CentreManagerResponse {
    String address;
    double currentBalance;
    double totalRevenue;
    double todayIncome;
    long todayBookings;
    Map<String, Double> percent;
    double pending;
    AccountResponse account;
}