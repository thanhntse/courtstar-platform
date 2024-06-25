package com.example.courtstar.mapper;

import com.example.courtstar.dto.response.BookingScheduleResponse;
import com.example.courtstar.entity.BookingSchedule;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface BookingScheduleMapper {
    BookingScheduleResponse toBookingScheduleResponse(BookingSchedule bookingSchedule);
}
