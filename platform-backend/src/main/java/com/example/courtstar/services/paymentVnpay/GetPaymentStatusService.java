package com.example.courtstar.services.paymentVnpay;

import com.example.courtstar.dto.request.StatusRequestZalopay;
import com.example.courtstar.util.VnPayHelper;
import jakarta.servlet.http.HttpServletRequest;
import lombok.SneakyThrows;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

@Service
public class GetPaymentStatusService {
    @Value("${payment.vnpay.VNP_VERSION}")
    private String VNP_VERSION;
    @Value("${payment.vnpay.VNP_COMMAND_ORDER}")
    private String VNP_COMMAND_ORDER;
    @Value("${payment.vnpay.VNP_TMN_CODE}")
    private String VNP_TMN_CODE;
    @Value("${payment.vnpay.VNP_COMMAND_STATUS}")
    private String VNP_COMMAND_STATUS;
    @Value("${payment.vnpay.VNP_BANK_CODE}")
    private String VNP_BANK_CODE;
    @Value("${payment.vnpay.VNP_RESPONSE_CODE}")
    private String VNP_RESPONSE_CODE;
    @Value("${payment.vnpay.VNP_TRANSACTION_STATUS}")
    private String VNP_TRANSACTION_STATUS;
    @Value("${payment.vnpay.SECRET_KEY}")
    private String SECRET_KEY;
    @Value("${payment.vnpay.VNP_API_URL}")
    private String VNP_API_URL;


    @SneakyThrows
    public Map<String, Object> getStatus(HttpServletRequest request, StatusRequestZalopay statusRequestDTO) throws IOException {

        JSONObject statusQuery = new JSONObject();

        statusQuery.put("vnp_RequestId", VnPayHelper.getRandomNumber(8));
        statusQuery.put("vnp_Version", VNP_VERSION);
        statusQuery.put("vnp_Command", VNP_COMMAND_STATUS);
        statusQuery.put("vnp_TmnCode", VNP_TMN_CODE);
        statusQuery.put("vnp_TxnRef", statusRequestDTO.getOrderId());
        statusQuery.put("vnp_OrderInfo", statusRequestDTO.getOrderInfo());
        statusQuery.put("vnp_TransactionNo", statusRequestDTO.getTransactionNo());
        statusQuery.put("vnp_TransDate", statusRequestDTO.getTransDate());
        statusQuery.put("vnp_CreateDate", VnPayHelper.generateDate(false));
        statusQuery.put("vnp_IpAddr", VnPayHelper.getIpAddress(request));
        statusQuery.put("vnp_Amount", String.valueOf(statusRequestDTO.getAmount()));
        statusQuery.put("vnp_BankCode", VNP_BANK_CODE);
        statusQuery.put("vnp_ResponseCode",VNP_RESPONSE_CODE); //success status
        statusQuery.put("vnp_TransactionStatus",VNP_TRANSACTION_STATUS);

        String hashData= String.join("|"
                , statusQuery.get("vnp_RequestId").toString()
                , statusQuery.get("vnp_Version").toString()
                , statusQuery.get("vnp_Command").toString()
                , statusQuery.get("vnp_TmnCode").toString()
                , statusQuery.get("vnp_TxnRef").toString()
                , statusQuery.get("vnp_TransDate").toString()
                , statusQuery.get("vnp_TransactionNo").toString()
                , statusQuery.get("vnp_CreateDate").toString()
                , statusQuery.get("vnp_IpAddr").toString()
                , statusQuery.get("vnp_OrderInfo").toString()
                , statusQuery.get("vnp_BankCode").toString()
                , statusQuery.get("vnp_ResponseCode").toString() //success status
                , statusQuery.get("vnp_Amount").toString()
                , statusQuery.get("vnp_TransactionStatus").toString());

        String vnpSecureHash = VnPayHelper.hmacSHA512(SECRET_KEY, hashData.toString());
        statusQuery.put("vnp_SecureHash", vnpSecureHash);

        CloseableHttpClient client = HttpClients.createDefault();
        HttpPost post = new HttpPost(VNP_API_URL);

        StringEntity stringEntity = new StringEntity(statusQuery.toString());
        post.setHeader("content-type", "application/json");
        post.setEntity(stringEntity);

        CloseableHttpResponse res = client.execute(post);
        BufferedReader rd = new BufferedReader(new InputStreamReader(res.getEntity().getContent()));
        StringBuilder resultJsonStr = new StringBuilder();
        String line;
        while ((line = rd.readLine()) != null) {

            resultJsonStr.append(line);
        }

        JSONObject object = new JSONObject(resultJsonStr.toString());
        Map<String, Object> result = new HashMap<>();
        for (Iterator<String> it = object.keys(); it.hasNext(); ) {

            String key = it.next();
            result.put(key, object.get(key));
        }

        return result;
    }
}
