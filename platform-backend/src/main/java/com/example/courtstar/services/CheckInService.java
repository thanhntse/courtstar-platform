package com.example.courtstar.services;

import com.example.courtstar.dto.response.AccountResponse;
import com.example.courtstar.entity.*;
import com.example.courtstar.exception.AppException;
import com.example.courtstar.exception.ErrorCode;
import com.example.courtstar.repositories.BookingDetailRepository;
import com.example.courtstar.repositories.BookingScheduleRepository;
import com.example.courtstar.repositories.SlotRepository;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.stereotype.Service;
import com.example.courtstar.entity.BookingSchedule;
import com.example.courtstar.repositories.BookingScheduleRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.stereotype.Service;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@Slf4j
@EnableWebSecurity
@EnableMethodSecurity

public class CheckInService {

    @Autowired
    private BookingDetailRepository bookingDetailRepository;
    @Autowired
    private BookingScheduleRepository bookingScheduleRepository;

    public Integer checkInQR(int bookingId) {
        int result = 0;
        BookingSchedule bookingSchedule = bookingScheduleRepository.findById(bookingId).orElse(null);

        if (bookingSchedule != null) {
            List<BookingDetail> bookingDetails = bookingSchedule.getBookingDetails();

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHH");
            ZonedDateTime gmtDateTime = ZonedDateTime.now(ZoneId.of("GMT"));
            String currentDateTime = gmtDateTime.plusHours(7).format(formatter);

            for (BookingDetail bookingDetail : bookingDetails) {
                LocalDate bookingDate = bookingDetail.getDate();
                LocalTime startTime = bookingDetail.getSlot().getStartTime();

                ZonedDateTime bookingDateTime = ZonedDateTime.of(bookingDate, startTime, ZoneId.of("GMT+7"));
                String bookingTimeString = bookingDateTime.format(formatter);

                if (bookingTimeString.equals(currentDateTime)) {
                    bookingDetail.setCheckedIn(true);
                    bookingDetailRepository.save(bookingDetail);
                    result = bookingDetail.getId();
                    break;
                }
            }
        }
        return result;
    }

    public Boolean checkIn(int bookingDetailId) {
        boolean result = false;
        BookingDetail bookingDetail = bookingDetailRepository.findById(bookingDetailId).orElse(null);
        if (bookingDetail != null) {
            bookingDetail.setCheckedIn(true);
            bookingDetailRepository.save(bookingDetail);
            result = true;
        }
        return result;
    }

    public Boolean undoCheckIn(int bookingDetailId) {
        boolean result = false;
        BookingDetail bookingDetail = bookingDetailRepository.findById(bookingDetailId).orElse(null);
        if (bookingDetail != null) {
            bookingDetail.setCheckedIn(false);
            bookingDetailRepository.save(bookingDetail);
            result = true;
        }
        return result;
    }

}
