package com.example.courtstar.controller;

import com.example.courtstar.dto.request.ApiResponse;
import com.example.courtstar.dto.response.CentreManagerResponse;
import com.example.courtstar.entity.CentreStaff;
import com.example.courtstar.services.CentreStaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/staff")
public class CentreStaffController {

    @Autowired
    private CentreStaffService centreStaffService;

    @GetMapping
    public ApiResponse<List<CentreStaff>> getAllStaff() {
        List<CentreStaff> centreStaffs = centreStaffService.getAllStaff();
        return ApiResponse.<List<CentreStaff>>builder()
                .data(centreStaffs)
                .build();
    }

    @GetMapping("/centre/{id}")
    public ApiResponse<List<CentreStaff>> getStaff(@PathVariable int id) {
        List<CentreStaff> centreStaffs = centreStaffService.getCentreStaffOfCentre(id);
        return ApiResponse.<List<CentreStaff>>builder()
                .data(centreStaffs)
                .build();
    }

    @PutMapping("/move/centre/{staff_id}/{centre_id}")
    public ApiResponse<Boolean> moveStaff(@PathVariable int staff_id, @PathVariable int centre_id) {
        Boolean result = centreStaffService.moveToCentre(staff_id,centre_id);
        return ApiResponse.<Boolean>builder()
                .data(result)
                .build();
    }
}
