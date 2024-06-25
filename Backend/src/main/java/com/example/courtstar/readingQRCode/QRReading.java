package com.example.courtstar.readingQRCode;

import com.example.courtstar.repositories.BookingScheduleRepository;
import com.example.courtstar.repositories.SlotRepository;
import com.example.courtstar.services.AccountService;
import com.example.courtstar.services.BookingService;
import com.example.courtstar.services.CheckInService;
import com.github.sarxos.webcam.Webcam;
import com.github.sarxos.webcam.WebcamPanel;
import com.github.sarxos.webcam.WebcamResolution;
import com.google.zxing.BinaryBitmap;
import com.google.zxing.MultiFormatReader;
import com.google.zxing.Result;
import com.google.zxing.client.j2se.BufferedImageLuminanceSource;
import com.google.zxing.common.HybridBinarizer;
import org.json.JSONObject;
import javax.swing.*;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.sql.*;


public class QRReading { CheckInService checkInService;
    private static final String DB_URL = "jdbc:mysql://localhost:3306/courtstarv5";
    private static final String USER = "root";
    private static final String PASSWORD = "12345";
    private JTextField textField1;
    private JPanel jPanel;
    private JLabel resultLabel;
    private WebcamPanel panel = null;
    private Webcam webcam = null;
    private JButton startButton;
    private JButton stopButton;
    private boolean running = false;
    private Connection connection;

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            QRReading qrReading = new QRReading();
            qrReading.createAndShowGUI();
        });
    }


    private void createAndShowGUI() {
        JFrame frame = new JFrame("QR Code Reader");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setLayout(new BorderLayout());
        Dimension dimension = new Dimension(500,500);
        frame.setPreferredSize(dimension);
        textField1 = new JTextField();
        resultLabel = new JLabel("Result: ");
        startButton = new JButton("Start Camera");
        stopButton = new JButton("Stop Camera");

        startButton.addActionListener(e -> startCamera());
        stopButton.addActionListener(e -> stopCamera());

        jPanel = new JPanel();
        jPanel.setLayout(new FlowLayout());

        JPanel controlPanel = new JPanel();
        controlPanel.setLayout(new FlowLayout());
        controlPanel.add(startButton);
        controlPanel.add(stopButton);
        controlPanel.add(resultLabel);

        frame.add(jPanel, BorderLayout.CENTER);
        frame.add(controlPanel, BorderLayout.NORTH);
        frame.add(textField1, BorderLayout.SOUTH);

        frame.pack();
        frame.setVisible(true);
    }

    private void startCamera() {
        if (!running) {
            initWebcam();
            running = true;
            new Thread(() -> {
                while (running) {
                    try {
                        Result result = readQRCode();
                        if (result != null) {

                            JSONObject jsonObject = new JSONObject(result.getText().toString());
                            boolean check=false;
                            System.out.println(result.getText());

                            check=searchBooking(jsonObject.getString("email"), jsonObject.getInt("court"),jsonObject.getInt("slot"));
                            if(check==true){

                                resultLabel.setText("checkin success");
                                textField1.setText(result.getText());
                            }else{
                                resultLabel.setText("checkin failed");
                                textField1.setText(result.getText());
                            }


                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }).start();
        }
    }

    private void stopCamera() {
        if (running) {
            running = false;
            if (webcam != null) {
                webcam.close();
            }
            jPanel.remove(panel);
            jPanel.revalidate();
            jPanel.repaint();
        }
    }

    private void initWebcam() {
        Dimension size = WebcamResolution.QVGA.getSize();
        webcam = Webcam.getWebcams().get(0); // Get default webcam
        webcam.setViewSize(size);

        panel = new WebcamPanel(webcam);
        panel.setPreferredSize(size);
        panel.setFPSDisplayed(true);

        jPanel.add(panel);
        jPanel.revalidate();
    }

    private Result readQRCode() {
        BufferedImage image = null;
        if (webcam.isOpen()) {
            if ((image = webcam.getImage()) == null) {
                return null;
            }
        }

        BinaryBitmap bitmap = new BinaryBitmap(new HybridBinarizer(new BufferedImageLuminanceSource(image)));
        try {
            return new MultiFormatReader().decode(bitmap);
        } catch (Exception e) {
            return null;
        }
    }

    public boolean searchBooking(String email, int court, int slotId) {
        boolean check = false;
        try (Connection conn = DriverManager.getConnection(DB_URL, USER, PASSWORD)) {
            String sql = "UPDATE booking_schedule bs JOIN account a ON a.id = bs.account_id SET bs.status = ? WHERE a.email = ? AND bs.court_id = ? AND bs.slot_id = ? AND bs.status=false;";
            try (PreparedStatement statement = conn.prepareStatement(sql)) {
                statement.setBoolean(1,true);
                statement.setString(2, email);
                statement.setInt(3, court);
                statement.setInt(4, slotId);
                int rows = statement.executeUpdate();
                if(rows>0){
                    check=true;
                }
            }
        } catch (SQLException e) {
            // Handle any SQL errors
            e.printStackTrace();
        }

        return check;
    }

}
