package com.example.courtstar.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PlatformResponse {
    double weekRevenue;
    Long weekCentre;
    Long weekCustomer;
    Long weekManager;
    Map<LocalDate, Long> managers;
    Map<LocalDate, Long> customers;
    Map<LocalDate, Long> centres;
    Map<LocalDate, Double> revenues;
}
