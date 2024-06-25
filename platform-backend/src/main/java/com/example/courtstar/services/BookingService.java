package com.example.courtstar.services;

import com.example.courtstar.dto.request.BookingRequest;
import com.example.courtstar.dto.request.OrderRequest;
import com.example.courtstar.dto.response.BookingScheduleResponse;
import com.example.courtstar.entity.*;
import com.example.courtstar.exception.AppException;
import com.example.courtstar.exception.ErrorCode;
import com.example.courtstar.mapper.BookingScheduleMapper;
import com.example.courtstar.repositories.*;
import com.example.courtstar.services.payment.CreateOrderService;
import com.google.zxing.WriterException;
import jakarta.mail.MessagingException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@Slf4j
@EnableWebSecurity
@EnableMethodSecurity
public class BookingService {

    @Autowired
    private AccountReponsitory accountReponsitory;

    @Autowired
    private CourtRepository courtRepository;

    @Autowired
    private SlotRepository slotRepository;

    @Autowired
    private BookingScheduleRepository bookingScheduleRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private GuestRepository guestRepository;

    @Autowired
    private CentreRepository centreRepository;

    @Autowired
    private CreateOrderService createOrderService;
    @Autowired
    private FeedbackRepository feedbackRepository;
    @Autowired
    private BookingScheduleMapper bookingScheduleMapper;


    public Map<String, Object> booking(BookingRequest request) throws IOException, JSONException {
        var context = SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();

        Account account = null;
        Guest guest = null;
        if (name.equals("anonymousUser")) {
            guest = guestRepository.findByEmail(request.getEmail());
            if (guest == null) {
                guest = Guest.builder()
                        .email(request.getEmail())
                        .phone(request.getPhone())
                        .fullName(request.getFullName())
                        .build();
                guestRepository.save(guest);
            }
        } else {
            account = accountReponsitory.findByEmail(name).orElseThrow(
                    () -> new AppException(ErrorCode.NOT_FOUND_USER)
            );
        }

        Centre centre = centreRepository.findById(request.getCentreId()).orElseThrow(null);
        Slot slot = slotRepository.findById(request.getSlotId()).orElseThrow(null);
        List<Court> courts = courtRepository.findAllByCourtNo(request.getCourtNo());

        Court court = courts.stream()
                .filter(c -> c.getCentre().getId().equals(request.getCentreId()))
                .findFirst()
                .orElseThrow(null);

        BookingSchedule bookingSchedule = bookingScheduleRepository.save(BookingSchedule.builder()
                .date(request.getDate())
                .totalPrice(centre.getPricePerHour())
                .status(false)
                .success(false)
                .account(account)
                .guest(guest)
                .slot(slot)
                .court(court)
                .build());

        Payment payment = Payment.builder()
                .date(LocalDate.now())
                .status(false)
                .bookingSchedule(bookingSchedule)
                .build();

        paymentRepository.save(payment);

        OrderRequest orderRequest = OrderRequest.builder()
                .bookingSchedule(bookingSchedule)
                .centre(centre)
                .payment(payment)
                .build();


        return createOrderService.createOrder(orderRequest);
    }

    public List<BookingSchedule> getBookingSchedules(int centreId) {
        List<BookingSchedule> allSchedules = bookingScheduleRepository.findAllByCentreId(centreId);
        return allSchedules.stream()
                .filter(BookingSchedule::isSuccess) // Assuming isSuccess is a boolean getter method
                .collect(Collectors.toList());
    }

    public List<BookingScheduleResponse> getBookingSchedulesOfAccount() {
        var context = SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();
        Account account = accountReponsitory.findByEmail(name).orElseThrow(
                () -> new AppException(ErrorCode.NOT_FOUND_USER)
        );
        List<BookingSchedule> allSchedules = bookingScheduleRepository.findAllByAccountId(account.getId());
        return allSchedules.stream()
                .filter(BookingSchedule::isSuccess) // Assuming isSuccess is a boolean getter method
                .map(bookingSchedule -> {
                    Centre centre = bookingSchedule.getSlot().getCentre();
                    Feedback feedback = feedbackRepository.findByBookingScheduleId(bookingSchedule.getId()).orElse(null);
                    int rate = feedback!=null ? feedback.getRate() :  0;
                    BookingScheduleResponse bookingScheduleResponse = bookingScheduleMapper.toBookingScheduleResponse(bookingSchedule);
                    bookingScheduleResponse.setCentreId(centre.getId());
                    bookingScheduleResponse.setCentreName(centre.getName());
                    bookingScheduleResponse.setCentreAddress(centre.getAddress());
                    bookingScheduleResponse.setRate(rate);
                    bookingScheduleResponse.setCentreImg(centre.getImages().get(0).getUrl());
                    return bookingScheduleResponse;
                })
                .collect(Collectors.toList());
    }

}
