package com.example.courtstar.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Base64;


public class AppUtils {
    public static String generateQrCode(String data, int wid, int hei) throws WriterException, IOException {
        StringBuilder result = new StringBuilder();
        if (!data.isEmpty()) {
            ByteArrayOutputStream os = new ByteArrayOutputStream();

            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(data, BarcodeFormat.QR_CODE, wid, hei);

            BufferedImage bufferedImage = MatrixToImageWriter.toBufferedImage(bitMatrix);
            ImageIO.write(bufferedImage, "png", os);

            result.append("data:image/png;base64,");
            result.append(new String(Base64.getEncoder().encode(os.toByteArray())));
        }
        System.out.println(result.toString());
        return result.toString();
    }

    public static String prettyObject(Object object) {
        try{
            ObjectMapper mapper = new ObjectMapper();
            return  mapper.writerWithDefaultPrettyPrinter().writeValueAsString(object);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }



    public static File convertBase64ToImage(String base64String) throws IOException {

        String[] parts = base64String.split(",");
        String imageType = parts[0].split("/")[1].split(";")[0];
        String imageData = parts[1];


        byte[] imageBytes = Base64.getDecoder().decode(imageData);
        File imageFile = File.createTempFile("qrcode", ".png");
        try (FileOutputStream fos = new FileOutputStream(imageFile)) {
            fos.write(imageBytes);
        }
        return imageFile;

    }
}
