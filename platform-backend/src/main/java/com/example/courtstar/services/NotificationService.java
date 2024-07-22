package com.example.courtstar.services;

import com.example.courtstar.entity.Account;
import com.example.courtstar.entity.Notification;
import com.example.courtstar.exception.AppException;
import com.example.courtstar.exception.ErrorCode;
import com.example.courtstar.repositories.AccountReponsitory;
import com.example.courtstar.repositories.NotificationRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@Slf4j
@EnableWebSecurity
@EnableMethodSecurity
public class NotificationService {

    private final AccountReponsitory accountReponsitory;
    private final NotificationRepository notificationRepository;

    public List<Notification> getNotifications() {
        var context = SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();
        Account account = accountReponsitory.findByEmail(name).orElseThrow(
                ()->new AppException(ErrorCode.NOT_FOUND_USER)
        );
        List<Notification> notifications = notificationRepository.findAllByAccountId(account.getId()).orElseThrow(
                ()->new AppException(ErrorCode.NOT_FOUND_NOTIFICATION)
        );
        return notifications;
    }

    public boolean updateNotification(Integer id) {
        var findNotification = notificationRepository.findById(id).orElse(null);
        if(findNotification != null) {
            findNotification.setStatus(true);
            notificationRepository.save(findNotification);
            return true;
        }
        else return false;
    }
}
