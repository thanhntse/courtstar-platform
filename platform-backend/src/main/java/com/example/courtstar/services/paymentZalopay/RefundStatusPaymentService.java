package com.example.courtstar.services.paymentZalopay;


import com.example.courtstar.dto.request.RefundStatusRequest;
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
public class RefundStatusPaymentService {
    @Value("${payment.zalopay.APP_ID}")
    private String APP_ID;
    @Value("${payment.zalopay.KEY1}")
    private String KEY1;
    @Value("${payment.zalopay.REFUND_STATUS_PAYMENT_ENDPOINT}")
    private String REFUND_STATUS_PAYMENT_ENDPOINT;

    public Map<String, Object> getStatusRefund(RefundStatusRequest refundStatusDTO) throws IOException, URISyntaxException, JSONException {

        String timestamp = Long.toString(System.currentTimeMillis()); // miliseconds
        String data = APP_ID +"|"+ refundStatusDTO.getRefundId()  +"|"+ timestamp; // app_id|m_refund_id|timestamp
        String mac = HMACUtil.HMacHexStringEncode(HMACUtil.HMACSHA256, KEY1, data);

        List<NameValuePair> params = new ArrayList<>();
        params.add(new BasicNameValuePair("app_id",APP_ID));
        params.add(new BasicNameValuePair("m_refund_id", refundStatusDTO.getRefundId()));
        params.add(new BasicNameValuePair("timestamp", timestamp));
        params.add(new BasicNameValuePair("mac", mac));

        URIBuilder uri = new URIBuilder(REFUND_STATUS_PAYMENT_ENDPOINT);
        uri.addParameters(params);

        CloseableHttpClient client = HttpClients.createDefault();
        HttpPost post = new HttpPost(uri.build());
        post.setEntity(new UrlEncodedFormEntity(params));

        CloseableHttpResponse res = client.execute(post);
        BufferedReader rd = new BufferedReader(new InputStreamReader(res.getEntity().getContent()));
        StringBuilder resultJsonStr = new StringBuilder();
        String line;

        while ((line = rd.readLine()) != null) {
            
            resultJsonStr.append(line);
        }

        JSONObject jsonResult = new JSONObject(resultJsonStr.toString());
        Map<String, Object> finalResult = new HashMap<>();
        finalResult.put("return_code", jsonResult.get("return_code"));
        finalResult.put("return_message", jsonResult.get("return_message"));
        finalResult.put("sub_return_code", jsonResult.get("sub_return_code"));
        finalResult.put("sub_return_message", jsonResult.get("sub_return_message"));
        return finalResult;
    }
}
