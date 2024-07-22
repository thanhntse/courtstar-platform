package com.example.courtstar.services.paymentZalopay;

import com.example.courtstar.dto.request.StatusRequest;
import com.example.courtstar.dto.response.BookingScheduleResponse;
import com.example.courtstar.entity.BookingSchedule;
import com.example.courtstar.entity.Centre;
import com.example.courtstar.entity.Payment;
import com.example.courtstar.mapper.BookingScheduleMapper;
import com.example.courtstar.repositories.BookingScheduleRepository;
import com.example.courtstar.repositories.PaymentRepository;
import com.example.courtstar.util.HMACUtil;
import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GetStatusOrderPaymentService {
    @Autowired
    private PaymentRepository paymentRepository;
    @Autowired
    private BookingScheduleMapper bookingScheduleMapper;
    @Autowired
    private BookingScheduleRepository bookingScheduleRepository;

    @Value("${payment.zalopay.APP_ID}")
    private String APP_ID;
    @Value("${payment.zalopay.KEY1}")
    private String KEY1;
    @Value("${payment.zalopay.ORDER_STATUS_ENDPOINT}")
    private String ORDER_STATUS_ENDPOINT;



    public Map<String, Object> statusOrder(StatusRequest statusRequestDTO) throws URISyntaxException, IOException, JSONException {

        String data = APP_ID +"|"+ statusRequestDTO.getAppTransId()  +"|"+ KEY1; // appid|app_trans_id|key1
        String mac = HMACUtil.HMacHexStringEncode(HMACUtil.HMACSHA256, KEY1, data);

        List<NameValuePair> params = new ArrayList<>();
        params.add(new BasicNameValuePair("app_id", APP_ID));
        params.add(new BasicNameValuePair("app_trans_id", statusRequestDTO.getAppTransId()));
        params.add(new BasicNameValuePair("mac", mac));

        URIBuilder uri = new URIBuilder(ORDER_STATUS_ENDPOINT);
        uri.addParameters(params);

        CloseableHttpClient client = HttpClients.createDefault();
        HttpPost post = new HttpPost(uri.build());
        post.setEntity(new UrlEncodedFormEntity(params));

        CloseableHttpResponse res = client.execute(post);
        BufferedReader rd = new BufferedReader(
                new InputStreamReader(res.getEntity().getContent()));
        StringBuilder resultJsonStr = new StringBuilder();
        String line;

        while ((line = rd.readLine()) != null) {

            resultJsonStr.append(line);
        }

        JSONObject result = new JSONObject(resultJsonStr.toString());

        Map<String, Object> finalResult = new HashMap<>();
        finalResult.put("return_code", result.get("return_code"));
        finalResult.put("return_message", result.get("return_message"));
        finalResult.put("is_processing", result.get("is_processing"));
        finalResult.put("amount", result.get("amount"));
        finalResult.put("discount_amount", result.get("discount_amount"));
        finalResult.put("zp_trans_id", result.get("zp_trans_id"));


        BookingSchedule bookingSchedule = paymentRepository.findByTransactionCode(statusRequestDTO.getAppTransId()).get().getBookingSchedule();
        String returncode = finalResult.get("return_code").toString();
        if(Integer.parseInt(returncode)==3) {

            BookingSchedule findBookingSchedual = bookingScheduleRepository.findById(bookingSchedule.getId()).orElse(null);
            if(findBookingSchedual!=null) {
                findBookingSchedual.getBookingDetails()
                        .forEach(
                                req -> req.setStatus(false)
                        );
            }
            bookingScheduleRepository.save(findBookingSchedual);
        }else{
            System.out.println("hello");
        }
        return finalResult;
    }

    public BookingScheduleResponse getOrderInfo(StatusRequest orderRequest) {
        String appTransIs = orderRequest.getAppTransId();
        Payment payment = paymentRepository.findByTransactionCode(appTransIs).orElse(null);
        if (payment == null) {
            return null;
        }
        BookingSchedule bookingSchedule = payment.getBookingSchedule();
        Centre centre = bookingSchedule.getBookingDetails().get(0).getCourt().getCentre();
        BookingScheduleResponse bookingScheduleResponse = bookingScheduleMapper.toBookingScheduleResponse(bookingSchedule);
        bookingScheduleResponse.setCentreId(centre.getId());
        bookingScheduleResponse.setCentreName(centre.getName());
        bookingScheduleResponse.setCentreAddress(centre.getAddress());
        bookingScheduleResponse.setCentreDistrict(centre.getDistrict());
        return bookingScheduleResponse;
    }
}
