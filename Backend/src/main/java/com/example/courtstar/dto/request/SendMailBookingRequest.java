package com.example.courtstar.dto.request;

import com.example.courtstar.entity.Slot;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SendMailBookingRequest {
    String email;
    String firstName;
    String lastName;
    String phone;
    String centreName;
    String centreAddress;
    LocalDate date;
    int courtNo;
    double price;
    Slot slot;
}
