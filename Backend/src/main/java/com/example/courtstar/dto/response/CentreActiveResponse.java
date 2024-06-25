package com.example.courtstar.dto.response;

import com.example.courtstar.entity.CentreStaff;
import com.example.courtstar.entity.Court;
import com.example.courtstar.entity.Image;
import com.example.courtstar.entity.Slot;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class CentreActiveResponse {
    int id;
    String name;
    String address;
    String district;
    LocalTime openTime;
    LocalTime closeTime;
    double pricePerHour;
    int numberOfCourts;
    String coreImg;
    double currentRate;
}