package com.example.courtstar.dto.request;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Value;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class DonateForAdmin {
    private String amount;

    @Builder.Default
    private String callbackUrl="https://5544-14-161-10-15.ngrok-free.app/courtstar/payment/donate-callback";
}
