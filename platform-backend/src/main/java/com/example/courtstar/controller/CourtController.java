package com.example.courtstar.controller;

import com.example.courtstar.dto.request.ApiResponse;
import com.example.courtstar.dto.request.CentreRequest;
import com.example.courtstar.dto.response.CentreResponse;
import com.example.courtstar.dto.response.CourtResponse;
import com.example.courtstar.entity.Court;
import com.example.courtstar.mapper.CentreMapper;
import com.example.courtstar.services.CentreService;
import com.example.courtstar.services.CourtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/court")
public class CourtController {
    @Autowired
    private CourtService courtService;

    @GetMapping("/getAllCourt")
    public ApiResponse<List<CourtResponse>> GetAllCourt() {
        return ApiResponse.<List<CourtResponse>>builder()
                .data(courtService.getAllCourts())
                .build();
    }

    @GetMapping("/{centreId}/{courtNo}")
    public ApiResponse<CourtResponse> getCourt(@PathVariable int centreId, @PathVariable int courtNo) {
        return ApiResponse.<CourtResponse>builder()
                .data(courtService.getCourtById(centreId,courtNo))
                .build();
    }

    @PostMapping("/{centreId}/{courtNo}")
    public ApiResponse<CourtResponse> editCourt(@PathVariable int centreId, @PathVariable int courtNo) {
        return ApiResponse.<CourtResponse>builder()
                .data(courtService.editCourtById(centreId,courtNo))
                .build();
    }

    @GetMapping("/{centreId}")
    public ApiResponse<List<Court>> getCourtByCentreId(@PathVariable int centreId) {
        return ApiResponse.<List<Court>>builder()
                .data(courtService.getCourtByCentreId(centreId))
                .build();
    }
}