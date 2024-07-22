package com.example.courtstar.controller;

import com.example.courtstar.dto.request.ApiResponse;
import com.example.courtstar.dto.request.BookingRequest;
import com.example.courtstar.services.CentreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


@CrossOrigin(origins = {"http://localhost:3000", "https://courtstar-platform-frontend.vercel.app/"})
@RestController
@RequestMapping("/slot")
public class SlotController {

    @Autowired
    private CentreService centreService;

    @PostMapping("/disable")
    public ApiResponse<Boolean> disabledSlot(@RequestBody BookingRequest request){
        return ApiResponse.<Boolean>builder()
                .data(centreService.disableSlot(request))
                .build();
    }
}
