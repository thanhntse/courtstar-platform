package com.example.courtstar.dto.request;

import com.example.courtstar.entity.BookingDetail;
import com.example.courtstar.entity.Slot;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.List;

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
    double price;
    List<BookingDetail> bookingDetails;
    String appTransId;
}
