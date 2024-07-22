package com.example.courtstar.util;

import com.example.courtstar.dto.request.SendMailBookingRequest;
import com.google.zxing.WriterException;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.io.File;
import java.io.IOException;

import static com.example.courtstar.util.AppUtils.convertBase64ToImage;


@Component
public class EmailBookingUtil {
    private JavaMailSender mailSender;
    private TemplateEngine templateEngine;

    @Autowired
    public EmailBookingUtil(JavaMailSender mailSender, TemplateEngine templateEngine) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
    }

    public String sendORCode(String qrCode, SendMailBookingRequest request) throws MessagingException, IOException, WriterException {


        String qrCodeBase64 = qrCode;
        File qrCodeImage = convertBase64ToImage(qrCodeBase64);

        Context context = new Context();
        context.setVariable("name", request.getFirstName() + " " + request.getLastName());
        context.setVariable("email", request.getEmail());
        context.setVariable("centreName", request.getCentreName());
        context.setVariable("centreAddress", request.getCentreAddress());
        context.setVariable("price", request.getPrice());
        context.setVariable("bookingDetails", request.getBookingDetails());
        context.setVariable("appTransId", request.getAppTransId());

        String qrCodeContentId = "qrcode";
        context.setVariable("qrCodeContentId", qrCodeContentId);

        String htmlContent = templateEngine.process("QR_Code_email", context);

        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

        mimeMessageHelper.setFrom("courtstar.se@gmail.com");
        mimeMessageHelper.setTo(request.getEmail());
        mimeMessageHelper.setSubject("Your Booking Schedule");
        mimeMessageHelper.setText(htmlContent, true);


        mimeMessageHelper.addInline(qrCodeContentId, qrCodeImage);

        mailSender.send(mimeMessage);


        qrCodeImage.delete();

        return qrCodeBase64;
    }
}