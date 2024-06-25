package com.example.courtstar.controller;

import com.example.courtstar.dto.request.ApiResponse;
import com.example.courtstar.entity.Notification;
import com.example.courtstar.services.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/notification")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping
    public ApiResponse<List<Notification>> getAllNotification() {
        ApiResponse apiResponse = ApiResponse.builder()
                .data(notificationService.getNotifications())
                .build();
        return apiResponse;
    }
}
