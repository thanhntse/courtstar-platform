package com.example.courtstar.controller.VnpayController;


import com.example.courtstar.dto.request.OrderRequest;
import com.example.courtstar.services.paymentVnpay.OrderPaymentService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;

@CrossOrigin(origins = {"http://localhost:3000", "https://courtstar-platform-frontend.vercel.app/"})
@RestController
@RequestMapping("/payment-vn-pay")
public class OrderPaymentController {

    @Autowired
    private OrderPaymentService orderPaymentService;

    @PostMapping("/create-order")
    public ResponseEntity<Map<String, Object>> createOrderPayment(HttpServletRequest request, @RequestBody OrderRequest orderRequest) throws IOException {

        Map<String, Object> result = this.orderPaymentService.createOrder(request, orderRequest);
        return new ResponseEntity<>(result, HttpStatus.OK);

    }
}
