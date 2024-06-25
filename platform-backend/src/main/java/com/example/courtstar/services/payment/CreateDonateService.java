package com.example.courtstar.services.payment;

import com.example.courtstar.dto.request.DonateForAdmin;
import com.example.courtstar.dto.request.OrderRequest;
import com.example.courtstar.entity.Account;
import com.example.courtstar.entity.CentreManager;
import com.example.courtstar.exception.AppException;
import com.example.courtstar.exception.ErrorCode;
import com.example.courtstar.repositories.AccountReponsitory;
import com.example.courtstar.repositories.CentreManagerRepository;
import com.example.courtstar.repositories.PaymentRepository;
import com.example.courtstar.util.HMACUtil;
import lombok.Data;
import org.apache.catalina.Manager;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.text.SimpleDateFormat;
import java.util.*;

@Data
@Service
public class CreateDonateService {
    @Value("${payment.zalopay.APP_ID}")
    private String APP_ID;

    @Value("${payment.zalopay.KEY1}")
    private String KEY1;

    @Value("${payment.zalopay.KEY2}")
    private String KEY2;

    @Value("${payment.zalopay.ORDER_CREATE_ENDPOINT}")
    private String ORDER_CREATE_ENDPOINT;
    @Autowired
    private PaymentRepository paymentRepository;
    @Autowired
    private AccountReponsitory accountReponsitory;
    @Autowired
    private CentreManagerRepository centreManagerRepository;

    private String getCurrentTimeString(String format) {

        Calendar cal = new GregorianCalendar(TimeZone.getTimeZone("GMT+7"));
        SimpleDateFormat fmt = new SimpleDateFormat(format);
        fmt.setCalendar(cal);
        return fmt.format(cal.getTimeInMillis());
    }

    public Map<String, Object> createOrder(DonateForAdmin orderRequest) throws IOException, JSONException {
        var context = SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();
        Account account = accountReponsitory.findByEmail(name).orElseThrow(
                () -> new AppException(ErrorCode.NOT_FOUND_USER)
        );
        CentreManager manager = centreManagerRepository.findByAccountId(account.getId())
                .orElseThrow(
                        () -> new AppException(ErrorCode.NOT_FOUND_USER)
                );
        final Map embeddata = new HashMap(){{
            put("redirecturl", "http://localhost:3000/myCentre/balance");//truyen url trang web muon tra ve klhi thanh toan xong
        }};

       List<Map<String, Object>> item = new ArrayList<>();
       item.add(new HashMap<String, Object>() {{
            put("id_manager_centre", manager.getId());
        }});

        JSONArray itemArray = new JSONArray();
        for (Map<String, Object> map : item) {
            itemArray.put(new JSONObject(map));
        }


        Map<String, Object> order = new HashMap<String, Object>(){{
            put("app_id", APP_ID);
            put("app_trans_id", getCurrentTimeString("yyMMdd") +"_"+ new Date().getTime());
            put("app_time", System.currentTimeMillis());
            put("app_user", "CourtStar");
            put("amount", Long.parseLong(orderRequest.getAmount().replace(".", "")));
            put("bank_code","");
            put("item",itemArray.toString());
            put("embed_data", new JSONObject(embeddata).toString());
            put("callback_url",orderRequest.getCallbackUrl()+""); // URL callback
        }};

        order.put("description", "CourtStar - Booking Court " + order.get("app_trans_id"));


        String data = order.get("app_id") + "|" + order.get("app_trans_id") + "|" + order.get("app_user") + "|" + order.get("amount")
                + "|" + order.get("app_time") + "|" + order.get("embed_data") + "|" + order.get("item");
        order.put("mac", HMACUtil.HMacHexStringEncode(HMACUtil.HMACSHA256, KEY1, data));

        CloseableHttpClient client = HttpClients.createDefault();
        HttpPost post = new HttpPost(ORDER_CREATE_ENDPOINT);

        List<NameValuePair> params = new ArrayList<>();
        for (Map.Entry<String, Object> e : order.entrySet()) {
            params.add(new BasicNameValuePair(e.getKey(), e.getValue().toString()));
        }

        post.setEntity(new UrlEncodedFormEntity(params));

        HttpResponse res = client.execute(post);
        BufferedReader rd = new BufferedReader(new InputStreamReader(res.getEntity().getContent()));
        StringBuilder resultJsonStr = new StringBuilder();
        String line;

        while ((line = rd.readLine()) != null) {
            resultJsonStr.append(line);
        }

        JSONObject jsonResult = new JSONObject(resultJsonStr.toString());
        Map<String, Object> finalResult = new HashMap<>();
        for (Iterator<String> it = jsonResult.keys(); it.hasNext(); ) {
            String key = it.next();
            finalResult.put(key, jsonResult.get(key));
        }

        return finalResult;
    }
}
