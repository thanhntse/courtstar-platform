package com.example.courtstar.controller;

import com.example.courtstar.dto.request.ApiResponse;
import com.example.courtstar.dto.response.PlatformResponse;
import com.example.courtstar.services.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/platform")
    public ApiResponse<PlatformResponse> getPlatformInfo(){
        return ApiResponse.<PlatformResponse>builder()
                .data(adminService.getPlatformInfo())
                .build();
    }

    @PostMapping("/centre/approve/{id}")
    public ApiResponse<Boolean> approveCentre(@PathVariable int id){
        return ApiResponse.<Boolean>builder()
                .data(adminService.approveCentre(id))
                .build();
    }

    @PostMapping("/centre/deny/{id}")
    public ApiResponse<Boolean> denyCentre(@PathVariable int id){
        return ApiResponse.<Boolean>builder()
                .data(adminService.deniedCentre(id))
                .build();
    }
}
