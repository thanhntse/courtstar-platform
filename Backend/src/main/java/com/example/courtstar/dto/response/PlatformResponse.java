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
    double totalRevenue;
    int totalCentre;
    int totalUser;
    Map<LocalDate, Long> users;
    Map<LocalDate, Long> guests;
    Map<LocalDate, Long> centres;
    Map<LocalDate, Double> revenues;
}
