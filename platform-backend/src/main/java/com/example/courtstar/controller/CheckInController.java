package com.example.courtstar.controller;

import com.example.courtstar.dto.request.ApiResponse;
import com.example.courtstar.services.CheckInService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/check-in")
public class CheckInController {

    @Autowired
    private CheckInService checkInService;

    @PostMapping("/{booking_schedule_id}")
    public ApiResponse<Boolean> checkIn(@PathVariable("booking_schedule_id") int bookingScheduleId) {
        ApiResponse apiResponse = ApiResponse.builder()
                .data(checkInService.checkIn(bookingScheduleId))
                .build();
        return apiResponse;
    }

    @PostMapping("/undo/{booking_schedule_id}")
    public ApiResponse<Boolean> undoCheckIn(@PathVariable("booking_schedule_id") int bookingScheduleId) {
        ApiResponse apiResponse = ApiResponse.builder()
                .data(checkInService.undoCheckIn(bookingScheduleId))
                .build();
        return apiResponse;
    }
}
