package com.example.courtstar.util;

import org.springframework.stereotype.Component;

import java.util.Random;

@Component
public class OtpUtil {
    public String generateOtp() {
        Random rand = new Random();
        int randomNum = rand.nextInt(999999);
        String randomNumStr = String.valueOf(randomNum);
        while (randomNumStr.length() < 6) {
            randomNumStr = "0" + randomNumStr;
        }
        return randomNumStr;
    }
}