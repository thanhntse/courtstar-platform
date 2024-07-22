package com.example.courtstar.services;

import com.example.courtstar.constant.PredefinedNotificationType;
import com.example.courtstar.constant.PredefinedRole;
import com.example.courtstar.dto.request.DescriptionRequest;
import com.example.courtstar.dto.response.PlatformResponse;
import com.example.courtstar.entity.*;
import com.example.courtstar.repositories.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@Slf4j
@EnableWebSecurity
@EnableMethodSecurity
public class AdminService {

    private final CentreRepository centreRepository;
    private final AccountReponsitory accountReponsitory;
    private final BookingScheduleRepository bookingScheduleRepository;
    private final NotificationRepository notificationRepository;
    private final PaymentRepository paymentRepository;

    public Boolean approveCentre(int centreId) {
        Centre centre = centreRepository.findById(centreId).orElseThrow(
                () -> new IllegalArgumentException("Centre not found")
        );
        centre.setStatus(true);
        centre.setApproveDate(LocalDate.now());
        centreRepository.save(centre);

        notificationRepository.save(Notification.builder()
                .type(PredefinedNotificationType.ACCEPT_CENTRE)
                .date(LocalDateTime.now())
                .content(PredefinedNotificationType.ACCEPT_CENTRE_CONTENT)
                .account(centre.getManager().getAccount())
                .build());
        return true;
    }

    public Boolean deniedCentre(int centreId, DescriptionRequest descriptionRequest) {
        Centre centre = centreRepository.findById(centreId).orElseThrow(
                () -> new IllegalArgumentException("Centre not found")
        );
        centre.setDeleted(true);
        centreRepository.save(centre);

        notificationRepository.save(Notification.builder()
                .type(PredefinedNotificationType.DENIED_CENTRE)
                .date(LocalDateTime.now())
                .content(descriptionRequest.getDescription())
                .account(centre.getManager().getAccount())
                .build());
        return true;
    }

    public PlatformResponse getPlatformInfo() {
        Map<LocalDate, Double> revenuePerDay = getRevenuePerDay();
        Map<LocalDate, Long> managerPerDay = getUserPerDay(PredefinedRole.MANAGER_ROLE);
        Map<LocalDate, Long> customerPerDay = getUserPerDay(PredefinedRole.CUSTOMER_ROLE);
        Map<LocalDate, Long> centrePerDay = getCentrePerDay();

        return PlatformResponse.builder()
                .revenues(revenuePerDay)
                .managers(managerPerDay)
                .customers(customerPerDay)
                .centres(centrePerDay)
                .weekRevenue(getRevenueThisWeek(revenuePerDay))
                .weekCentre(getCentreThisWeek(centrePerDay))
                .weekCustomer(getCustomerThisWeek(customerPerDay))
                .weekManager(getPartnerThisWeek(managerPerDay))
                .build();
    }

    private Map<LocalDate, Double> getRevenuePerDay() {
        return centreRepository.findAll().stream()
                .flatMap(centre -> bookingScheduleRepository.findAllByCentreId(centre.getId())
                        .stream().map(
                                bookingSchedule -> paymentRepository.findByBookingScheduleId(bookingSchedule.getId())
                                        .orElseThrow(null)
                        )).filter(Payment::isStatus)
                .collect(Collectors.groupingBy(
                        payment -> payment.getDate().toLocalDate(), // Group by date
                        Collectors.summingDouble(Payment::getAmount) // Sum the revenue for each date
                ));
    }

    private  Map<LocalDate, Long> getUserPerDay(String name) {
        return accountReponsitory.findAllByRoleName(name).stream()
                .collect(Collectors.groupingBy(
                        Account::getCreatedDate,
                        Collectors.counting()
                ));
    }

    private Map<LocalDate, Long> getCentrePerDay() {
        return centreRepository.findAll().stream()
                .filter(centre -> centre.getApproveDate() != null)
                .collect(Collectors.groupingBy(
                        Centre::getApproveDate,
                        Collectors.counting()
                ));
    }

    private double getRevenueThisWeek(Map<LocalDate, Double> revenuePerDay) {
        LocalDate today = LocalDate.now();
        LocalDate startOfWeek = today.with(DayOfWeek.MONDAY);

        return revenuePerDay.entrySet().stream()
                .filter(entry -> !entry.getKey().isBefore(startOfWeek) && !entry.getKey().isAfter(today))
                .mapToDouble(Map.Entry::getValue)
                .sum();
    }

    private Long getPartnerThisWeek(Map<LocalDate, Long> partnerPerDay) {
        LocalDate today = LocalDate.now();
        LocalDate startOfWeek = today.with(DayOfWeek.MONDAY);

        return partnerPerDay.entrySet().stream()
                .filter(entry -> !entry.getKey().isBefore(startOfWeek) && !entry.getKey().isAfter(today))
                .mapToLong(Map.Entry::getValue)
                .sum();
    }
    private Long getCustomerThisWeek(Map<LocalDate, Long> customerPerDay) {
        LocalDate today = LocalDate.now();
        LocalDate startOfWeek = today.with(DayOfWeek.MONDAY);

        return customerPerDay.entrySet().stream()
                .filter(entry -> !entry.getKey().isBefore(startOfWeek) && !entry.getKey().isAfter(today))
                .mapToLong(Map.Entry::getValue)
                .sum();
    }

    private Long getCentreThisWeek(Map<LocalDate, Long> centrePerDay) {
        LocalDate today = LocalDate.now();
        LocalDate startOfWeek = today.with(DayOfWeek.MONDAY);

        return centrePerDay.entrySet().stream()
                .filter(entry -> !entry.getKey().isBefore(startOfWeek) && !entry.getKey().isAfter(today))
                .mapToLong(Map.Entry::getValue)
                .sum();
    }


}
