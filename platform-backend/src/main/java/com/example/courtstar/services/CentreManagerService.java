package com.example.courtstar.services;

import com.example.courtstar.dto.request.CentreManagerRequest;
import com.example.courtstar.dto.response.AccountResponse;
import com.example.courtstar.dto.response.CentreManagerResponse;
import com.example.courtstar.entity.*;
import com.example.courtstar.exception.AppException;
import com.example.courtstar.exception.ErrorCode;
import com.example.courtstar.mapper.AccountMapper;
import com.example.courtstar.mapper.CentreManagerMapper;
import com.example.courtstar.repositories.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@Slf4j
@EnableWebSecurity
@EnableMethodSecurity
public class CentreManagerService {
    @Autowired
    CentreManagerRepository centreManagerRepository;
    @Autowired
    CentreManagerMapper centreManagerMapper;
    @Autowired
    AccountReponsitory accountReponsitory;
    @Autowired
    private AccountMapper accountMapper;
    @Autowired
    private BookingScheduleRepository bookingScheduleRepository;
    @Autowired
    private PaymentRepository paymentRepository;

    public List<CentreManagerResponse> getAllManager() {
        List<CentreManager> managers = centreManagerRepository.findAll();
        return managers.stream()
                .map(
                        manager -> {
                            AccountResponse accountResponse = accountMapper.toAccountResponse(manager.getAccount());
                            return CentreManagerResponse.builder()
                                    .account(accountResponse)
                                    .address(manager.getAddress())
                                    .currentBalance(manager.getCurrentBalance())
                                    .build();
                        }
                ).toList();
    }

    public CentreManagerResponse getManagerInfo() {
        var context = SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();
        Account account = accountReponsitory.findByEmail(name).orElseThrow(()->new AppException(ErrorCode.NOT_FOUND_USER));
        CentreManager manager = centreManagerRepository.findByAccountId(account.getId()).orElseThrow(null);
        AccountResponse accountResponse = accountMapper.toAccountResponse(account);
        return CentreManagerResponse.builder()
                .account(accountResponse)
                .address(manager.getAddress())
                .currentBalance(manager.getCurrentBalance())
                .totalRevenue(getTotalRevenue(manager))
                .todayIncome(getRevenueToday(manager))
                .todayBookings(getBookingToday(manager))
                .percent(getPercentageChangesMap(manager))
                .pending(getFutureRevenueTotal(manager))
                .build();
    }

    private Map<String, Double> getPercentageChangesMap(CentreManager manager) {
        Map<String, Double> percentageChanges = new HashMap<>();
        percentageChanges.put("income", getPercentageRevenueChangeFromYesterday(manager));
        percentageChanges.put("booking", getPercentageBookingChangeFromYesterday(manager));
        return percentageChanges;
    }

    private double getTotalRevenue(CentreManager manager) {
        return manager.getCentres().stream()
                .mapToDouble(Centre::getRevenue)
                .sum();
    }

    private Map<LocalDate, Double> getTotalRevenuePerDay(CentreManager manager) {
        return manager.getCentres().stream()
                .flatMap(centre -> bookingScheduleRepository.findAllByCentreId(centre.getId())
                        .stream().filter(BookingSchedule::isSuccess))
                .collect(Collectors.groupingBy(
                        BookingSchedule::getDate, // Group by date
                        Collectors.summingDouble(BookingSchedule::getTotalPrice) // Sum the revenue for each date
                ));
    }

    private double getRevenueToday(CentreManager manager) {
        LocalDate today = LocalDate.now();
        return manager.getCentres().stream()
                .flatMapToDouble(centre -> bookingScheduleRepository.findAllByCentreId(centre.getId())
                        .stream()
                        .filter(schedule -> schedule.getDate().isEqual(today) && schedule.isSuccess())
                        .mapToDouble(BookingSchedule::getTotalPrice)
                )
                .sum();
    }

    private long getBookingToday(CentreManager manager) {
        LocalDate today = LocalDate.now();
        return manager.getCentres().stream()
                .flatMap(centre -> bookingScheduleRepository.findAllByCentreId(centre.getId()).stream())
                .filter(
                    schedule -> {
                        Payment payment = paymentRepository.findByBookingScheduleId(schedule.getId())
                                .orElseThrow(null);
                        return payment.isStatus() && payment.getDate().isEqual(today);
                    }
                )
                .count();
    }

    private double getPercentageRevenueChangeFromYesterday(CentreManager manager) {
        LocalDate yesterday = LocalDate.now().minusDays(1);

        double revenueYesterday = manager.getCentres().stream()
                .flatMapToDouble(centre -> bookingScheduleRepository.findAllByCentreId(centre.getId())
                        .stream()
                        .filter(schedule -> schedule.getDate().isEqual(yesterday) && schedule.isSuccess())
                        .mapToDouble(BookingSchedule::getTotalPrice)
                )
                .sum();

        if (revenueYesterday == 0) {
            return 0; // If there was no revenue yesterday, return 0% change
        }

        double revenueToday = getRevenueToday(manager);

        return ((revenueToday - revenueYesterday) / revenueYesterday) * 100;
    }

    private double getPercentageBookingChangeFromYesterday(CentreManager manager) {
        LocalDate yesterday = LocalDate.now().minusDays(1);

        double bookingYesterday = manager.getCentres().stream()
                .flatMap(centre -> bookingScheduleRepository.findAllByCentreId(centre.getId()).stream())
                .filter(
                        schedule -> {
                            Payment payment = paymentRepository.findByBookingScheduleId(schedule.getId())
                                    .orElseThrow(null);
                            return payment.isStatus() && payment.getDate().isEqual(yesterday);
                        }
                )
                .count();

        if (bookingYesterday == 0) {
            return 0;
        }

        double bookingToday = getBookingToday(manager);

        return ((bookingToday - bookingYesterday) / bookingYesterday) * 100;
    }

    private double getFutureRevenueTotal(CentreManager manager) {
        LocalDate today = LocalDate.now();
        return manager.getCentres().stream()
                .flatMapToDouble(centre -> bookingScheduleRepository.findAllByCentreId(centre.getId())
                        .stream()
                        .filter(schedule -> schedule.getDate().isAfter(today) && schedule.isSuccess())
                        .mapToDouble(BookingSchedule::getTotalPrice)
                )
                .sum();
    }

    public CentreManager addInformation(CentreManagerRequest request) {
        CentreManager centreManager = centreManagerMapper.toCentreManager(request);
        centreManager.setCentres(new ArrayList<>());
        return centreManagerRepository.save(centreManager);
    }

    public CentreManagerResponse updateInformation(int account_id, CentreManagerRequest request){
        CentreManager manager = centreManagerRepository.findByAccountId(account_id).orElseThrow(null);
        String role= manager.getAccount().getRole().getName();
        if(!role.equals("MANAGER")){
            throw new AppException(ErrorCode.ERROR_ROLE);
        }
        centreManagerMapper.updateCentre(manager,request);
        centreManagerRepository.save(manager);
        AccountResponse accountResponse = accountMapper.toAccountResponse(manager.getAccount());

        return CentreManagerResponse.builder()
                .account(accountResponse)
                .address(manager.getAddress())
                .currentBalance(manager.getCurrentBalance())
                .build();
    }
}
