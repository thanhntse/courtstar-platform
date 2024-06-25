package com.example.courtstar.controller;

import com.example.courtstar.dto.request.ApiResponse;
import com.example.courtstar.dto.request.CentreRequest;
import com.example.courtstar.dto.response.CentreActiveResponse;
import com.example.courtstar.dto.response.CentreNameResponse;
import com.example.courtstar.dto.response.CentreResponse;
import com.example.courtstar.services.CentreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/centre")
public class CentreController {
    @Autowired
    private CentreService centreService;

    @PostMapping("/create")
    public ApiResponse<CentreResponse> createCentre(@RequestBody CentreRequest request){
        CentreResponse centreResponse = centreService.addCentre(request);
        return ApiResponse.<CentreResponse>builder()
                .data(centreResponse)
                .build();
    }

    @GetMapping("/allCentre")
    public ApiResponse<List<CentreResponse>> GetAllCentre(){
        return ApiResponse.<List<CentreResponse>>builder()
                .data(centreService.getAllCentres())
                .build();
    }


    @PutMapping("/update/{id}")
    public ApiResponse<CentreResponse> updateCentre(@PathVariable int id, @RequestBody CentreRequest request){
        CentreResponse centreResponse = centreService.updateCentre(id, request);
        return ApiResponse.<CentreResponse>builder()
                .data(centreResponse)
                .build();
    }

    @GetMapping("/getAllCentresOfManager")
    public ApiResponse<Set<CentreNameResponse>> GetAllCentresOfManager(){
       var context = SecurityContextHolder.getContext();
       String email = context.getAuthentication().getName();
        return ApiResponse.<Set<CentreNameResponse>>builder()
                .data(centreService.getAllCentresOfManager(email)).build();
    }

    @GetMapping("/getCentreOfStaff")
    public ApiResponse<CentreNameResponse> GetCentreOfStaff(){
        var context = SecurityContextHolder.getContext();
        String email = context.getAuthentication().getName();
        return ApiResponse.<CentreNameResponse>builder()
                .data(centreService.getCentreOfStaff(email)).build();
    }

    @GetMapping("/getCentre/{id}")
    public ApiResponse<CentreResponse> GetCentre(@PathVariable int id){
        return ApiResponse
                .<CentreResponse>builder().data(centreService.getCentre(id)).build();
    }


    @GetMapping("/getAllCentreActive")
    public ApiResponse<List<CentreActiveResponse>> GetAllCentreActive(){
        return ApiResponse.<List<CentreActiveResponse>>builder()
                .data(centreService.getAllCentresIsActive(true))
                .build();
    }

    @GetMapping("/getAllCentreDisable")
    public ApiResponse<List<CentreActiveResponse>> GetAllCentreDisable(){
        var context = SecurityContextHolder.getContext();
        String email = context.getAuthentication().getName();
        return ApiResponse.<List<CentreActiveResponse>>builder()
                .data(centreService.getAllCentresIsActive(false))
                .build();
    }

    @PostMapping("/disable/{id}")
    public ApiResponse<Boolean> disableCentre(@PathVariable int id){
        return ApiResponse.<Boolean>builder()
                .data(centreService.isActive(id,false))
                .build();
    }

    @PostMapping("/active/{id}")
    public ApiResponse<Boolean> ActiveCentre(@PathVariable int id){
        return ApiResponse.<Boolean>builder()
                .data(centreService.isActive(id,true))
                .build();
    }

    @PostMapping("/delete/{id}")
    public ApiResponse<Boolean> deleteCentre(@PathVariable int id){
        return ApiResponse.<Boolean>builder()
                .data(centreService.delete(id))
                .build();
    }
}