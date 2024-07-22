package com.example.courtstar.dto.response;

import com.example.courtstar.entity.BookingDetail;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class CourtResponse {
    int id;
    int courtNo;
    boolean status;
    List<BookingDetailResponse> bookingDetails;
}