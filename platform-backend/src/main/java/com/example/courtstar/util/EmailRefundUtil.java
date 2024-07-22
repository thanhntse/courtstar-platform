package com.example.courtstar.util;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Component
public class EmailRefundUtil {
    private JavaMailSender mailSender;
    private TemplateEngine templateEngine;

    @Autowired
    public EmailRefundUtil(JavaMailSender mailSender, TemplateEngine templateEngine) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
    }

    public void sendRefundMail(String email, String fullName) throws MessagingException{

        Context context = new Context();
        context.setVariable("fullName", fullName);
        context.setVariable("email", email);

        String htmlContent = templateEngine.process("refund-email", context);

        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

        mimeMessageHelper.setFrom("courtstar.se@gmail.com");
        mimeMessageHelper.setTo(email);
        mimeMessageHelper.setSubject("Refund");
        mimeMessageHelper.setText(htmlContent, true);

        mailSender.send(mimeMessage);
    }
}
