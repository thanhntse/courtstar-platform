package com.example.courtstar.services;

import com.example.courtstar.dto.response.AccountResponse;
import com.example.courtstar.entity.Account;
import com.example.courtstar.entity.BookingSchedule;
import com.example.courtstar.entity.Slot;
import com.example.courtstar.exception.AppException;
import com.example.courtstar.exception.ErrorCode;
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

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@Slf4j
@EnableWebSecurity
@EnableMethodSecurity

public class CheckInService {

    @Autowired
    private final BookingScheduleRepository bookingScheduleRepository;
    @Autowired
    private final BookingService bookingService;
    @Autowired
    private final AccountService accountService;
    @Autowired
    private final SlotRepository slotRepository;

    public Boolean checkIn(int bookingScheduleId) {
        boolean result = false;
        BookingSchedule bookingSchedule = bookingScheduleRepository.findById(bookingScheduleId).orElse(null);
        if (bookingSchedule != null) {
            bookingSchedule.setStatus(true);
            bookingScheduleRepository.save(bookingSchedule);
            result = true;
        }
        return result;
    }

    public Boolean undoCheckIn(int bookingScheduleId) {
        boolean result = false;
        BookingSchedule bookingSchedule = bookingScheduleRepository.findById(bookingScheduleId).orElse(null);
        if (bookingSchedule != null) {
            bookingSchedule.setStatus(false);
            bookingScheduleRepository.save(bookingSchedule);
            result = true;
        }
        return result;
    }
  
//    public boolean checkInBooking(String email, int court_id, int slotId){
//        Account account = accountService.getAccountByEmail1(email);
//        if(account == null){
//            throw new AppException(ErrorCode.NOT_FOUND_USER);
//        }
//        BookingSchedule service = bookingService.getBookingSchedule(account.getId());
//        Slot slot = slotRepository.findById(slotId).orElse(null);
//
//        boolean checkIn = false;
//        if(service.getCourt().isStatus()==false
//                && service.getCourt().getId()==court_id
//                && service.getSlot()==slot){
//            service.setStatus(true);
//            bookingScheduleRepository.save(service);
//            checkIn = true;
//        }
//        return checkIn;
//    }
}
