package com.example.courtstar.services;



import com.google.zxing.WriterException;
import jakarta.mail.MessagingException;

import java.io.IOException;

public interface QrCodeService {
    String generateQrCode(int bookingScheduleId, String appTransId) throws IOException, WriterException, MessagingException;
}
