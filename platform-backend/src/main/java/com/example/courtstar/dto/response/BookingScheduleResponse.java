package com.example.courtstar.dto.response;

import com.example.courtstar.entity.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class BookingScheduleResponse {

    Integer id;
    Integer centreId;
    double totalPrice;
    Account account;
    Guest guest;
    String centreName;
    String centreAddress;
    String centreImg;
    String centreDistrict;
    int rate;
    boolean success;
    List<BookingDetailResponse> bookingDetails;
}
