package com.example.courtstar.services;

import com.example.courtstar.constant.PredefinedNotificationType;
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
    private final GuestRepository guestRepository;
    private final BookingScheduleRepository bookingScheduleRepository;
    private final NotificationRepository notificationRepository;
    private final CentreManagerRepository centreManagerRepository;

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

    public Boolean deniedCentre(int centreId) {
        Centre centre = centreRepository.findById(centreId).orElseThrow(
                () -> new IllegalArgumentException("Centre not found")
        );
        centre.setDeleted(true);
        centreRepository.save(centre);

        notificationRepository.save(Notification.builder()
                .type(PredefinedNotificationType.DENIED_CENTRE)
                .date(LocalDateTime.now())
                .content(PredefinedNotificationType.DENIED_CENTRE_CONTENT)
                .account(centre.getManager().getAccount())
                .build());
        return true;
    }

    public PlatformResponse getPlatformInfo() {
        return PlatformResponse.builder()
                .totalRevenue(getTotalRevenue()*0.05)
                .totalCentre(centreRepository.findAll().stream().filter(centre -> centre.getApproveDate() != null).toList().size())
                .totalUser(accountReponsitory.findAll().size() + guestRepository.findAll().size())
                .revenues(getRevenuePerDay())
                .users(getUserPerDay())
                .guests(getGuestPerDay())
                .centres(getCentrePerDay())
                .build();
    }

    private double getTotalRevenue() {
        return centreRepository.findAll().stream()
                .mapToDouble(Centre::getRevenue)
                .sum();
    }

    private Map<LocalDate, Double> getRevenuePerDay() {
        return centreRepository.findAll().stream()
                .flatMap(centre -> bookingScheduleRepository.findAllByCentreId(centre.getId())
                        .stream().filter(BookingSchedule::isSuccess))
                .collect(Collectors.groupingBy(
                        BookingSchedule::getDate, // Group by date
                        Collectors.summingDouble(BookingSchedule::getTotalPrice) // Sum the revenue for each date
                ));
    }

    private  Map<LocalDate, Long> getUserPerDay() {
        return accountReponsitory.findAll().stream()
                .collect(Collectors.groupingBy(
                        Account::getCreatedDate,
                        Collectors.counting()
                ));
    }

    private  Map<LocalDate, Long> getGuestPerDay() {
        return guestRepository.findAll().stream()
                .collect(Collectors.groupingBy(
                        Guest::getCreatedDate,
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
}
