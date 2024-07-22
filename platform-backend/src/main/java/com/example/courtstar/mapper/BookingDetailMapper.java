package com.example.courtstar.mapper;

import com.example.courtstar.dto.response.BookingDetailResponse;
import com.example.courtstar.entity.BookingDetail;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface BookingDetailMapper {
    BookingDetailResponse toBookingDetailResponse(BookingDetail bookingDetail);
}
