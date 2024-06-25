package com.example.courtstar.controller;

import com.example.courtstar.dto.request.ApiResponse;
import com.example.courtstar.dto.request.BookingRequest;
import com.example.courtstar.entity.SlotUnavailable;
import com.example.courtstar.services.SlotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/slot")
public class SlotController {

    @Autowired
    private SlotService slotService;

    @PostMapping("/disable")
    public ApiResponse<SlotUnavailable> disabledSlot(@RequestBody BookingRequest request){
        return ApiResponse.<SlotUnavailable>builder()
                .data(slotService.disableSlot(request))
                .build();
    }
}
