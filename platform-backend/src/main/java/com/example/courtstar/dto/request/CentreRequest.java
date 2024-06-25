package com.example.courtstar.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class CentreRequest {
    String name;
    String address;
    String district;
    LocalTime openTime;
    LocalTime closeTime;
    String pricePerHour;
    int numberOfCourts;
    String description;
    List<String> images;
}