package com.example.courtstar.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookingRequest {
    String fullName;
    String phone;
    String email;
    List<BookingDetailRequest> bookingDetails;
    String paymentType;
}
