package com.example.courtstar.controller;

import com.example.courtstar.dto.request.ApiResponse;
import com.example.courtstar.dto.response.CourtResponse;
import com.example.courtstar.entity.Court;
import com.example.courtstar.exception.AppException;
import com.example.courtstar.exception.ErrorCode;
import com.example.courtstar.mapper.CourtMapper;
import com.example.courtstar.repositories.CourtRepository;
import com.example.courtstar.services.CourtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = {"http://localhost:3000", "https://courtstar-platform-frontend.vercel.app/"})
@RestController
@RequestMapping("/court")
public class CourtController {
    @Autowired
    private CourtService courtService;
    @Autowired
    private CourtRepository courtRepository;
    @Autowired
    private CourtMapper courtMapper;

    @GetMapping("/getAllCourt")
    public ApiResponse<List<CourtResponse>> GetAllCourt() {
        return ApiResponse.<List<CourtResponse>>builder()
                .data(courtService.getAllCourts())
                .build();
    }

    @GetMapping("/booking-detail/{id}")
    public ApiResponse<CourtResponse> getCourtById(@PathVariable int id) {
        return ApiResponse.<CourtResponse>builder()
                .data(courtMapper.toCourtResponse(courtRepository.findById(id)
                        .orElseThrow(()->new AppException(ErrorCode.NOT_FOUND_COURT))))
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

    @PostMapping("/{centreId}")
    public ApiResponse<List<Court>> addCourtByCentreId(@PathVariable int centreId) {
        return ApiResponse.<List<Court>>builder()
                .data(courtService.addCourtByCentreId(centreId))
                .build();
    }

}