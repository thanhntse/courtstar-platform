package com.example.courtstar.util;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.text.SimpleDateFormat;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

public class VnPayHelper {
    @Value("${payment.vnpay.SECRET_KEY}")
    private static String SECRET_KEY;
    public static String generateDate(boolean forExpire) {

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
        ZonedDateTime gmtDateTime = ZonedDateTime.now(ZoneId.of("GMT"));

        if (!forExpire) {
            return gmtDateTime.plusHours(7).format(formatter);
        }

        return gmtDateTime.plusHours(7).plusMinutes(15).format(formatter);
    }

    public static String md5(String message) {

        String digest = null;
        try {

            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] hash = md.digest(message.getBytes("UTF-8"));
            StringBuilder sb = new StringBuilder(2 * hash.length);
            for (byte b : hash) {

                sb.append(String.format("%02x", b & 0xff));
            }
            digest = sb.toString();
        } catch (UnsupportedEncodingException ex) {

            digest = "";
        } catch (NoSuchAlgorithmException ex) {

            digest = "";
        }

        return digest;

    }

    public static String Sha256(String message) {

        String digest = null;
        try {

            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(message.getBytes("UTF-8"));
            StringBuilder sb = new StringBuilder(2 * hash.length);
            for (byte b : hash) {

                sb.append(String.format("%02x", b & 0xff));
            }
            digest = sb.toString();
        } catch (UnsupportedEncodingException ex) {

            digest = "";
        } catch (NoSuchAlgorithmException ex) {

            digest = "";
        }

        return digest;

    }

    //Util for VNPAY
    public static String hashAllFields(Map fields) {

        List fieldNames = new ArrayList(fields.keySet());
        Collections.sort(fieldNames);
        StringBuilder sb = new StringBuilder();
        Iterator itr = fieldNames.iterator();
        while (itr.hasNext()) {

            String fieldName = (String) itr.next();
            String fieldValue = (String) fields.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {

                sb.append(fieldName);
                sb.append("=");
                sb.append(fieldValue);
            }
            if (itr.hasNext()) {

                sb.append("&");
            }
        }

        return hmacSHA512(SECRET_KEY, sb.toString());

    }

    public static String hmacSHA512(final String key, final String data) {

        try {

            if (key == null || data == null) {
                throw new NullPointerException();
            }

            final Mac hmac512 = Mac.getInstance("HmacSHA512");
            byte[] hmacKeyBytes = key.getBytes();
            final SecretKeySpec secretKey = new SecretKeySpec(hmacKeyBytes, "HmacSHA512");
            hmac512.init(secretKey);
            byte[] dataBytes = data.getBytes(StandardCharsets.UTF_8);
            byte[] result = hmac512.doFinal(dataBytes);
            StringBuilder sb = new StringBuilder(2 * result.length);
            for (byte b : result) {
                sb.append(String.format("%02x", b & 0xff));
            }
            return sb.toString();

        } catch (Exception ex) {

            return "";
        }

    }

    public static String getIpAddress(HttpServletRequest request) {

        String ipAdress;
        try {

            ipAdress = request.getHeader("X-FORWARDED-FOR");
            if (ipAdress == null) {

                ipAdress = request.getRemoteAddr();
            }
        } catch (Exception e) {

            ipAdress = "Invalid IP:" + e.getMessage();
        }

        return ipAdress;

    }

    public static String getRandomNumber(int len) {

        Random rnd = new Random();
        String chars = "0123456789";
        StringBuilder sb = new StringBuilder(len);
        for (int i = 0; i < len; i++) {

            sb.append(chars.charAt(rnd.nextInt(chars.length())));
        }

        return sb.toString();

    }

}
