package com.example.courtstar.services;



import com.example.courtstar.dto.request.SendMailBookingRequest;
import com.example.courtstar.entity.Account;
import com.example.courtstar.entity.BookingSchedule;
import com.example.courtstar.entity.Guest;
import com.example.courtstar.repositories.BookingScheduleRepository;
import com.example.courtstar.repositories.GuestRepository;
import com.example.courtstar.util.AppUtils;
import com.example.courtstar.util.EmailBookingUtil;
import com.google.zxing.WriterException;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class QrCodeServiceImpl implements QrCodeService {
    @Autowired
    EmailBookingUtil emailBookingUtil;
    @Autowired
    AccountService accountService;
    @Autowired
    GuestRepository guestRepository;

    @Autowired
    private BookingScheduleRepository bookingScheduleRepository;


    @Override
    public String generateQrCode(int bookingScheduleId, String appTransId) throws IOException, WriterException, MessagingException {

        BookingSchedule bookingSchedule = bookingScheduleRepository.findById(bookingScheduleId).orElse(null);
        if (bookingSchedule == null) {
            return null;
        }

        SendMailBookingRequest request = null;

        if (bookingSchedule.getAccount() == null) {
            Guest guest = bookingSchedule.getGuest();
            request = SendMailBookingRequest.builder()
                    .email(guest.getEmail())
                    .firstName(guest.getFullName())
                    .lastName("")
                    .phone(guest.getPhone())
                    .centreName(bookingSchedule.getBookingDetails().get(0).getCourt().getCentre().getName())
                    .centreAddress(bookingSchedule.getBookingDetails().get(0).getCourt().getCentre().getAddress())
                    .price(bookingSchedule.getTotalPrice())
                    .bookingDetails(bookingSchedule.getBookingDetails())
                    .appTransId(appTransId)
                    .build();
        } else {
            Account account = bookingSchedule.getAccount();
            request = SendMailBookingRequest.builder()
                    .email(account.getEmail())
                    .firstName(account.getFirstName())
                    .lastName(account.getLastName())
                    .phone(account.getPhone())
                    .centreName(bookingSchedule.getBookingDetails().get(0).getCourt().getCentre().getName())
                    .centreAddress(bookingSchedule.getBookingDetails().get(0).getCourt().getCentre().getAddress())
                    .price(bookingSchedule.getTotalPrice())
                    .bookingDetails(bookingSchedule.getBookingDetails())
                    .appTransId(appTransId)
                    .build();
        }

        String prettyData = AppUtils.prettyObject(bookingScheduleId);
        String qrCode = AppUtils.generateQrCode(prettyData,300,300);
        return emailBookingUtil.sendORCode(qrCode,request);
    }
}
