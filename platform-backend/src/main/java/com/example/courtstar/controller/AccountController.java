package com.example.courtstar.controller;

import com.example.courtstar.dto.request.*;
import com.example.courtstar.dto.response.AccountResponse;
import com.example.courtstar.dto.response.CentreManagerResponse;
import com.example.courtstar.entity.Account;
import com.example.courtstar.entity.CentreManager;
import com.example.courtstar.entity.CentreStaff;
import com.example.courtstar.mapper.AccountMapper;
import com.example.courtstar.services.AccountService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = {"http://localhost:3000", "https://courtstar-platform-frontend.vercel.app/"})
@RestController
@RequestMapping("/account")
public class AccountController {
    @Autowired
    private AccountService accountService;
    @Autowired
    private AccountMapper accountMapper;

    @PostMapping
    public ApiResponse<Account> createAccount(@RequestBody @Valid AccountCreationRequest request){
        ApiResponse apiResponse = ApiResponse.builder()
                .data(accountService.CreateAccount(request))
                .build();
        return apiResponse;
    }

    @PostMapping("/partner")
    public ApiResponse<CentreManager> createManagerAccount(@RequestBody @Valid CentreManagerRequest request){
        ApiResponse apiResponse = ApiResponse.builder()
                .data(accountService.CreateManagerAccount(request))
                .build();
        return apiResponse;
    }

    @PostMapping("/staff")
    public ApiResponse<CentreStaff> createStaffAccount(@RequestBody @Valid CentreStaffRequest request){
        ApiResponse apiResponse = ApiResponse.builder()
                .data(accountService.CreateStaffAccount(request))
                .build();
        return apiResponse;
    }

    @GetMapping("/createEmail")
    public RedirectView createAccountByGmail(@AuthenticationPrincipal OAuth2User principal){
        Map<String, Object> attributes = principal.getAttributes();
        String email= attributes.get("email").toString();
        ApiResponse apiResponse;
        boolean check = accountService.checkExistEmail(email);


        if(!check){
            String Name = (String) attributes.get("name");
            String[] fullName = Name.split(" ");

            apiResponse = ApiResponse.<AccountResponse>builder()
                    .data(accountMapper.toAccountResponse(
                            accountService.CreateAccount(
                                    AccountCreationRequest.builder()
                                            .email(email)
                                            .password("1")
                                            .firstName(fullName[0])
                                            .lastName(fullName[fullName.length-1])
                                            .build()
                            )
                    ))
                    .build();

        }
        AccountResponse account = accountService.getAccountByEmail(email);
        apiResponse = ApiResponse.<AccountResponse>builder()
                .code(1000)
                .data(account)
                .build();

        return new RedirectView("http://localhost:8080/courtstar/auth/token?email="+email+"&password="+1);
    }

    @GetMapping
    public ApiResponse<Account> getAccount(){
        ApiResponse apiResponse = ApiResponse.builder()
                .data(accountService.getAllAccounts())
                .build();

        return apiResponse;
    }

    @GetMapping("/{id}")
    public ApiResponse<AccountResponse> getAccountById(@PathVariable int id){
        return ApiResponse.<AccountResponse>builder()
                .data(accountService.getAccountById(id))
                .build();
    }

    @PostMapping("/{id}")
    public ApiResponse<AccountResponse> deleteAccountById(@PathVariable int id){
        return ApiResponse.<AccountResponse>builder()
                .data(accountService.deleteAccountById(id))
                .code(1000)
                .message("delete success")
                .build();
    }

    @PutMapping
    public ApiResponse<AccountResponse> updateAccountById(@RequestBody @Valid AccountUpdateRequest request){
        return ApiResponse.<AccountResponse>builder()
                .data(accountService.updateAccount(request))
                .build();
    }

    @GetMapping("/myInfor")
    ApiResponse<AccountResponse> getMyInfor(){
        return ApiResponse.<AccountResponse>builder()
                .data(accountService.getMyAccount())
                .build();
    }

    @GetMapping("/accountBanned")
    ApiResponse<List<AccountResponse>> getAccountBanned(){
        return ApiResponse.<List<AccountResponse>>builder()
                .code(1000)
                .message("getsuccess")
                .data(accountService.getAllAccountsBanned())
                .build();
    }

    @PutMapping("/regenerate-otp")
    public ResponseEntity<ApiResponse> getRegenerateOtp(@RequestBody OtpRequest request){
        ApiResponse apiResponse = ApiResponse.builder().data(accountService.generateOtp(request.getEmail())).build();
        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }

    @PostMapping("/reset-password")
    public ApiResponse resetPassword(@RequestBody ResetPasswordRequest request){
        boolean isVerify = accountService.VerifyOtp(request.getEmail(),request.getOtp());
        if (isVerify) {
            if(request.getNewPassword().equals(request.getConfirmPassword())){
                accountService.UpdatePassword(request.getEmail(),request.getNewPassword());
            }
            else {
                return ApiResponse.builder()
                        .code(1000)
                        .message("password not match")
                        .build();
            }
        }

        return ApiResponse.builder()
                .code(1000)
                .message("success")
                .build();
    }

}