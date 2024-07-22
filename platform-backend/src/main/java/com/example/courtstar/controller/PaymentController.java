package com.example.courtstar.controller;

import com.example.courtstar.dto.request.*;
import com.example.courtstar.dto.response.BookingScheduleResponse;
import com.example.courtstar.services.paymentZalopay.*;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.URISyntaxException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.Map;

@CrossOrigin(origins = {"http://localhost:3000", "https://courtstar-platform-frontend.vercel.app/"})
@RestController
@RequestMapping("/payment")
public class PaymentController {
    @Autowired
    private CallBackPaymentService callBackPaymentService;
    @Autowired
    private CreateOrderService service;
    @Autowired
    private CreateDonateService donateService;
    @Autowired
    private RefundPaymentService refundPaymentService;
    @Autowired
    private RefundStatusPaymentService refundStatusService;
    @Autowired
    private GetStatusOrderPaymentService orderPaymentService;
    @Autowired
    private CallBackDonateService callBackDonateService;

    @PostMapping("/booking-callback")
    public ResponseEntity<ApiResponse> callback(@RequestBody String jsonSt)
            throws JSONException, NoSuchAlgorithmException, InvalidKeyException, org.json.JSONException {
        JSONObject result = new JSONObject();
        Object callBack =this.callBackPaymentService.doCallBack(result,jsonSt);
        return new ResponseEntity<>(ApiResponse.builder()
                .data(callBack)
                .build(), HttpStatus.OK);
    }

    @PostMapping("/donate-callback")
    public ResponseEntity<ApiResponse> callbackDonate(@RequestBody String jsonSt)
            throws JSONException, NoSuchAlgorithmException, InvalidKeyException, org.json.JSONException {
        JSONObject result = new JSONObject();
        Object callBack =this.callBackDonateService.doCallBack(result,jsonSt);
        return new ResponseEntity<>(ApiResponse.builder()
                .data(callBack)
                .build(), HttpStatus.OK);
    }




    @PostMapping("/create-order")
    public ResponseEntity<Map<String, Object>> createOrder(@RequestBody OrderRequest request) throws org.json.JSONException, IOException {
        Map<String, Object> resultOrder = this.service.createOrder(request);
        return new ResponseEntity<>(resultOrder, HttpStatus.OK);
    }

    @PostMapping("/donate-admin")
    public ResponseEntity<Map<String, Object>> donateAdmin(@RequestBody DonateForAdmin request) throws org.json.JSONException, IOException {
        Map<String, Object> resultOrder = this.donateService.createOrder(request);
        return new ResponseEntity<>(resultOrder, HttpStatus.OK);
    }





    @PostMapping("/order-status")
    public Map<String, Object> getStatusOrder(@RequestBody StatusRequest statusRequestDTO) throws org.json.JSONException, URISyntaxException, IOException {

        return this.orderPaymentService.statusOrder(statusRequestDTO);
    }


    @PostMapping("/order-info")
    public BookingScheduleResponse getOrderInfo(@RequestBody StatusRequest statusRequestDTO) throws org.json.JSONException, URISyntaxException, IOException {

        return this.orderPaymentService.getOrderInfo(statusRequestDTO);
    }




    @PostMapping("/refund")
    public ResponseEntity<Map<String, Object>> sendRefundRequest(@RequestBody RefundRequest refundRequestDTO) throws org.json.JSONException, IOException {

        Map<String, Object> result = this.refundPaymentService.sendRefund(refundRequestDTO);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }


    @PostMapping("/refund-status")
    public ResponseEntity<Map<String, Object>> getStatusRefund(@RequestBody RefundStatusRequest refundStatusDTO) throws org.json.JSONException, IOException, URISyntaxException {

        Map<String, Object> result =  this.refundStatusService.getStatusRefund(refundStatusDTO);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}
