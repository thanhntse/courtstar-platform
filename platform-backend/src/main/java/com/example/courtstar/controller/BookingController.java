package com.example.courtstar.controller;

import com.example.courtstar.dto.request.ApiResponse;
import com.example.courtstar.dto.request.BookingRequest;
import com.example.courtstar.dto.response.BookingScheduleResponse;
import com.example.courtstar.entity.BookingDetail;
import com.example.courtstar.entity.BookingSchedule;
import com.example.courtstar.services.BookingService;
import com.google.zxing.WriterException;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = {"http://localhost:3000", "https://courtstar-platform-frontend.vercel.app/"})
@RestController
@RequestMapping("/booking")
public class BookingController {

    @Autowired
    BookingService bookingService;

    @PostMapping
    public ApiResponse<Map<String, Object>> booking(HttpServletRequest request, @RequestBody BookingRequest bookingRequest) throws IOException, JSONException {
        return ApiResponse.<Map<String, Object>>builder()
                .data(bookingService.booking(request, bookingRequest))
                .build();
    }

    @GetMapping("/{centreId}")
    public ApiResponse<List<BookingDetail>> getBookingSchedules(@PathVariable int centreId){
        return ApiResponse.<List<BookingDetail>>builder()
                .data(bookingService.getBookingScheduleDetails(centreId))
                .build();
    }

    @GetMapping()
    public ApiResponse<List<BookingScheduleResponse>> getBookingSchedulesOfAccount(){
        return ApiResponse.<List<BookingScheduleResponse>>builder()
                .data(bookingService.getBookingSchedulesOfAccount())
                .build();
    }
}
