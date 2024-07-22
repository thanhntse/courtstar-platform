package com.example.courtstar.services.paymentVnpay;


import com.example.courtstar.dto.request.OrderRequest;
import com.example.courtstar.repositories.PaymentRepository;
import com.example.courtstar.util.VnPayHelper;
import jakarta.servlet.http.HttpServletRequest;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class OrderPaymentService {
    @Value("${payment.vnpay.VNP_VERSION}")
    private String VNP_VERSION;
    @Value("${payment.vnpay.VNP_COMMAND_ORDER}")
    private String VNP_COMMAND_ORDER;
    @Value("${payment.vnpay.VNP_TMN_CODE}")
    private String VNP_TMN_CODE;
    @Value("${payment.vnpay.VNP_CURRENCY_CODE}")
    private String VNP_CURRENCY_CODE;
    @Value("${payment.vnpay.ORDER_TYPE}")
    private String ORDER_TYPE;
    @Value("${payment.vnpay.VNP_LOCALE}")
    private String VNP_LOCALE;
    @Value("${payment.vnpay.VNP_RETURN_URL}")
    private String VNP_RETURN_URL;
    @Value("${payment.vnpay.SECRET_KEY}")
    private String SECRET_KEY;
    @Value("${payment.vnpay.VNP_PAY_URL}")
    private String VNP_PAY_URL;

    @Autowired
    private PaymentRepository paymentRepository;

    private String getCurrentTimeString(String format) {

        Calendar cal = new GregorianCalendar(TimeZone.getTimeZone("GMT+7"));
        SimpleDateFormat fmt = new SimpleDateFormat(format);
        fmt.setCalendar(cal);
        return fmt.format(cal.getTimeInMillis());
    }

    public Map<String, Object> createOrder(HttpServletRequest request, OrderRequest orderRequest) throws UnsupportedEncodingException {

        List<Map<String, Object>> item = new ArrayList<>();
        item.add(new HashMap<String, Object>() {{
            put("bookingId", orderRequest.getBookingSchedule().getId());
            put("paymentId", orderRequest.getPayment().getId());
            put("centreId", orderRequest.getCentre().getId());
        }});

        JSONArray itemArray = new JSONArray();
        for (Map<String, Object> map : item) {
            itemArray.put(new JSONObject(map));
        }


        Map<String, Object> payload = new HashMap<>(){{
            put("vnp_Version", VNP_VERSION);
            put("vnp_Command", VNP_COMMAND_ORDER);
            put("vnp_TmnCode", VNP_TMN_CODE);
            put("vnp_Amount", String.valueOf((long)orderRequest.getBookingSchedule().getTotalPrice() * 100));
            put("vnp_CurrCode", VNP_CURRENCY_CODE);
            put("vnp_TxnRef",  VnPayHelper.getRandomNumber(8));
            put("vnp_OrderInfo", itemArray.toString());
            put("vnp_OrderType", ORDER_TYPE);
            put("vnp_Locale", VNP_LOCALE);
            put("vnp_ReturnUrl", VNP_RETURN_URL);
            put("vnp_IpAddr", VnPayHelper.getIpAddress(request));
            put("vnp_CreateDate", VnPayHelper.generateDate(false));
            put("vnp_ExpireDate", VnPayHelper.generateDate(true));
            put("vnp_ExtraData","");
        }};

        String transaction_id =  getCurrentTimeString("yyMMdd") +"_"+ new Date().getTime();
        orderRequest.getPayment().setTransactionCode(transaction_id);
        paymentRepository.save(orderRequest.getPayment());

        String queryUrl = getQueryUrl(payload).get("queryUrl")
                + "&vnp_SecureHash="
                + VnPayHelper.hmacSHA512(SECRET_KEY, getQueryUrl(payload).get("hashData"));

        String paymentUrl = VNP_PAY_URL + "?" + queryUrl;
        payload.put("order_url", paymentUrl);

        return payload;
    }

    private Map<String, String> getQueryUrl(Map<String, Object> payload) throws UnsupportedEncodingException {

        List<String> fieldNames = new ArrayList(payload.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator itr = fieldNames.iterator();
        while (itr.hasNext()) {

            String fieldName = (String) itr.next();
            String fieldValue = (String) payload.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {

                //Build hash data
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));

                //Build query
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
                query.append('=');
                query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                if (itr.hasNext()) {

                    query.append('&');
                    hashData.append('&');
                }
            }
        }
        return new HashMap<>(){{
            put("queryUrl", query.toString());
            put("hashData", hashData.toString());
        }};
    }
}
