package com.example.courtstar.services;

import com.example.courtstar.dto.request.BookingRequest;
import com.example.courtstar.dto.request.OrderRequest;
import com.example.courtstar.dto.response.BookingScheduleResponse;
import com.example.courtstar.entity.*;
import com.example.courtstar.exception.AppException;
import com.example.courtstar.exception.ErrorCode;
import com.example.courtstar.mapper.BookingScheduleMapper;
import com.example.courtstar.repositories.*;
import com.example.courtstar.services.paymentVnpay.OrderPaymentService;
import com.example.courtstar.services.paymentZalopay.CreateOrderService;
import jakarta.servlet.http.HttpServletRequest;
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
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
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
    private CreateOrderService createOrderService;
    @Autowired
    private FeedbackRepository feedbackRepository;
    @Autowired
    private BookingScheduleMapper bookingScheduleMapper;
    @Autowired
    private OrderPaymentService orderPaymentService;
    @Autowired
    private BookingDetailRepository bookingDetailRepository;


    public Map<String, Object> booking(HttpServletRequest request, BookingRequest bookingRequest) throws IOException, JSONException {
        var context = SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();

        Account account = null;
        Guest guest = null;
        if (name.equals("anonymousUser")) {
            guest = guestRepository.findByEmail(bookingRequest.getEmail());
            if (guest == null) {
                guest = Guest.builder()
                        .email(bookingRequest.getEmail())
                        .phone(bookingRequest.getPhone())
                        .fullName(bookingRequest.getFullName())
                        .build();
                guestRepository.save(guest);
            }
        } else {
            account = accountReponsitory.findByEmail(name).orElseThrow(
                    () -> new AppException(ErrorCode.NOT_FOUND_USER)
            );
        }

        BookingSchedule bookingSchedule = bookingScheduleRepository.save(BookingSchedule.builder()
                .success(false)
                .account(account)
                .guest(guest)
                .build());

        List<BookingDetail> bookingDetails = bookingRequest.getBookingDetails().stream()
                .map(
                    req -> {
                        List<BookingDetail> listBookingDetail = bookingDetailRepository.findByDateAndCourtIdAndSlotId(req.getDate(), req.getCourtId(), req.getSlotId()).orElse(null);
                        if (listBookingDetail != null && !listBookingDetail.isEmpty()) {
                            BookingSchedule b = listBookingDetail.get(listBookingDetail.size() - 1).getBookingSchedule();
                            if (b != null) {
                                Payment payment = paymentRepository.findByBookingScheduleId(b.getId()).orElse(null);
                                if (payment != null) {
                                    LocalDateTime time = payment.getDate();
                                    LocalDateTime now = LocalDateTime.now();
                                    if (!now.isAfter(time.plusMinutes(15))) {
                                        throw new AppException(ErrorCode.INVALID_SLOT_BOOKING);
                                    }
                                }
                            }

                        }
                        return BookingDetail.builder()
                                .slot(slotRepository.findById(req.getSlotId()).orElse(null))
                                .court(courtRepository.findById(req.getCourtId()).orElse(null))
                                .date(req.getDate())
                                .bookingSchedule(bookingSchedule)
                                .build();
                    }
                ).collect(Collectors.toList());

        Centre centre = bookingDetails.get(0).getCourt().getCentre();

        bookingSchedule.setBookingDetails(bookingDetails);
        bookingSchedule.setTotalPrice(centre.getPricePerHour()*bookingDetails.size());
        bookingScheduleRepository.save(bookingSchedule);

        Payment payment = Payment.builder()
                .date(LocalDateTime.now())
                .status(false)
                .amount(centre.getPricePerHour()*bookingDetails.size())
                .bookingSchedule(bookingSchedule)
                .build();

        paymentRepository.save(payment);

        OrderRequest orderRequest = OrderRequest.builder()
                .bookingSchedule(bookingSchedule)
                .centre(centre)
                .payment(payment)
                .build();

        if (bookingRequest.getPaymentType().equals("VNPAY")) {
            return orderPaymentService.createOrder(request, orderRequest);
        }
        return createOrderService.createOrder(orderRequest);
    }

    public List<BookingDetail> getBookingScheduleDetails(int centreId) {
        List<BookingSchedule> allSchedules = bookingScheduleRepository.findAllByCentreId(centreId);
        return allSchedules.stream()
                .filter(BookingSchedule::isSuccess)
                .flatMap(bookingSchedule -> bookingSchedule.getBookingDetails().stream())
                .filter(
                    bookingDetail -> bookingDetail.getBookingSchedule() != null
                )
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
                    Centre centre = bookingSchedule.getBookingDetails().get(0).getCourt().getCentre();
                    Feedback feedback = feedbackRepository.findByBookingScheduleId(bookingSchedule.getId()).orElse(null);
                    int rate = feedback!=null ? feedback.getRate() :  0;
                    BookingScheduleResponse bookingScheduleResponse = bookingScheduleMapper.toBookingScheduleResponse(bookingSchedule);
                    bookingScheduleResponse.setCentreId(centre.getId());
                    bookingScheduleResponse.setCentreName(centre.getName());
                    bookingScheduleResponse.setCentreAddress(centre.getAddress());
                    bookingScheduleResponse.setCentreDistrict(centre.getDistrict());
                    bookingScheduleResponse.setRate(rate);
                    bookingScheduleResponse.setCentreImg(centre.getImages().get(0).getUrl());
                    return bookingScheduleResponse;
                })
                .collect(Collectors.toList());
    }

}
