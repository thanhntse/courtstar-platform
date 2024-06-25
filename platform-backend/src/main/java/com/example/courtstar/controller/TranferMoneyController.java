package com.example.courtstar.controller;

import com.example.courtstar.dto.request.ApiResponse;
import com.example.courtstar.dto.request.AuthWithdrawalOrderRequest;
import com.example.courtstar.dto.request.TranferMoneyRequest;
import com.example.courtstar.dto.response.AuthWithdrawalOrderResponse;
import com.example.courtstar.dto.response.TranferMoneyReponse;
import com.example.courtstar.entity.TransferMoney;
import com.example.courtstar.services.TransferMoneyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tranfermoney")
public class TranferMoneyController {
    @Autowired
    TransferMoneyService transferMoneyService;
    @PostMapping("/createWithdrawalOrder/{idManagerCentre}")
    public ApiResponse<TranferMoneyReponse> createTranferMoney(@PathVariable int idManagerCentre,@RequestBody TranferMoneyRequest request) {
        return  ApiResponse.<TranferMoneyReponse>builder()
                .data(transferMoneyService.createTranferMoney(idManagerCentre,request)).build();
    }
    @PostMapping("/authenticateWithdrawalOrder/{id}")
    public ApiResponse<AuthWithdrawalOrderResponse> authenticateWithdrawalOrder(@PathVariable int id, @RequestBody AuthWithdrawalOrderRequest request){
        return ApiResponse.<AuthWithdrawalOrderResponse>builder()
                .data(transferMoneyService.authenticateTranferMoney(request,id))
                .build();
    }
    @GetMapping("/getAllWithdrawalOrder")
    public ApiResponse<List<TransferMoney>> getAllWithdrawalOrder(){
        return ApiResponse.<List<TransferMoney>>builder()
                .data(transferMoneyService.getAllTranferMoney())
                .build();
    }

    @GetMapping("/getAllSuccess")
    public ApiResponse<List<TransferMoney>> getListTranferSuccess(){
        return ApiResponse.<List<TransferMoney>>builder()
                .data(transferMoneyService.getListTranferSuccess())
                .build();
    }
    @GetMapping("/getAllNotSuccess")
    public ApiResponse<List<TransferMoney>> getListTranferNotSuccess(){
        return ApiResponse.<List<TransferMoney>>builder()
                .data(transferMoneyService.getListTranferNotSuccess())
                .build();
    }
}
