package com.example.courtstar.services;

import com.example.courtstar.constant.PredefinedNotificationType;
import com.example.courtstar.dto.request.AccountCreationRequest;
import com.example.courtstar.dto.request.AccountUpdateRequest;
import com.example.courtstar.dto.request.CentreManagerRequest;
import com.example.courtstar.dto.request.CentreStaffRequest;
import com.example.courtstar.dto.response.AccountResponse;
import com.example.courtstar.entity.*;
import com.example.courtstar.exception.AppException;
import com.example.courtstar.exception.ErrorCode;
import com.example.courtstar.mapper.AccountMapper;
import com.example.courtstar.repositories.*;
import com.example.courtstar.util.EmailUtil;
import com.example.courtstar.util.OtpUtil;
import jakarta.mail.MessagingException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@Slf4j
@EnableWebSecurity
@EnableMethodSecurity
public class AccountService {
     AccountReponsitory accountReponsitory;
     RoleReponsitory roleReponsitory;
     AccountMapper accountMapper;
     CentreManagerRepository centreManagerRepository;

    private PasswordEncoder passwordEncoder;
    private final OtpUtil otpUtil;
    private final EmailUtil emailUtil;
    private final CentreStaffRepository centreStaffRepository;
    private final CentreRepository centreRepository;
    private final OtpRepository otpRepository;
    private final NotificationRepository notificationRepository;

    public Account CreateAccount(AccountCreationRequest request) {
        if(accountReponsitory.existsByEmail(request.getEmail())){
            throw new AppException(ErrorCode.ACCOUNT_EXIST);
        }
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        Account account = accountMapper.toAccount(request);
        account.setPassword(passwordEncoder.encode(request.getPassword()));
        var role = roleReponsitory.findById("CUSTOMER").orElse(null);
        account.setRole(role);
        Account accountSave = accountReponsitory.save(account);

        notificationRepository.save(Notification.builder()
                .type(PredefinedNotificationType.REGISTERED)
                .date(LocalDateTime.now())
                .content(PredefinedNotificationType.REGISTERED_CONTENT)
                .account(accountSave)
                .build());

        return accountSave;
    }

    public CentreManager CreateManagerAccount(CentreManagerRequest request) {
        if(accountReponsitory.existsByEmail(request.getEmail())){
            throw new AppException(ErrorCode.ACCOUNT_EXIST);
        }
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        Account account = Account.builder()
                .email(request.getEmail())
                .password(request.getPassword())
                .phone(request.getPhone())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .build();

        account.setPassword(passwordEncoder.encode(request.getPassword()));
        var role = roleReponsitory.findById("MANAGER").orElse(null);
        account.setRole(role);

        accountReponsitory.save(account);

        notificationRepository.save(Notification.builder()
                .type(PredefinedNotificationType.REGISTERED)
                .date(LocalDateTime.now())
                .content(PredefinedNotificationType.REGISTERED_CONTENT)
                .account(account)
                .build());

        return centreManagerRepository.save(
                CentreManager.builder()
                        .account(account)
                        .address(request.getAddress())
                        .currentBalance(0)
                        .build());
    }

    public CentreStaff CreateStaffAccount(CentreStaffRequest request) {
        if(accountReponsitory.existsByEmail(request.getEmail())){
            throw new AppException(ErrorCode.ACCOUNT_EXIST);
        }
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        Account account = Account.builder()
                .email(request.getEmail())
                .password(request.getPassword())
                .phone(request.getPhone())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .build();

        account.setPassword(passwordEncoder.encode(request.getPassword()));
        var role = roleReponsitory.findById("STAFF").orElse(null);
        account.setRole(role);

        Centre centre = centreRepository.findById(request.getCentreId()).orElse(null);

        accountReponsitory.save(account);

        notificationRepository.save(Notification.builder()
                .type(PredefinedNotificationType.REGISTERED)
                .date(LocalDateTime.now())
                .content(PredefinedNotificationType.REGISTERED_CONTENT)
                .account(account)
                .build());

        return centreStaffRepository.save(
                CentreStaff.builder()
                        .account(account)
                        .centre(centre)
                        .build());

    }

    public List<Account> getAllAccounts(){
        return accountReponsitory.findAll();
    }

    //@PreAuthorize("hasAuthority('GET_ACCOUNT_BY_ID')")
    public AccountResponse getAccountById(int id){
        Account account = accountReponsitory.findById(id).orElseThrow(()->new AppException(ErrorCode.NOT_FOUND_USER));
        AccountResponse accountResponse = accountMapper.toAccountResponse(account);
        return accountResponse;
    }

    //@PreAuthorize("hasRole('ADMIN')")
    public AccountResponse deleteAccountById(int id){
         if(accountReponsitory.existsById(id)){
             Account account = accountReponsitory.findById(id).orElseThrow(()->new AppException(ErrorCode.NOT_FOUND_USER));
             account.setDeleted(true);
             account=accountReponsitory.save(account);
             return accountMapper.toAccountResponse(account);
         }else {
              throw new AppException(ErrorCode.NOT_DELETE);
         }

    }

    public AccountResponse UpdatePassword(String email,String newPassword){
        Account account = accountReponsitory.findByEmail(email).orElseThrow(()->new AppException(ErrorCode.NOT_FOUND_USER));
        account.setPassword(passwordEncoder.encode(newPassword));
        accountReponsitory.save(account);

        return accountMapper.toAccountResponse(account);
    }

    //@PreAuthorize("hasRole('ADMIN')")
    public AccountResponse updateAccount(AccountUpdateRequest request){
        var context = SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();
        Account account = accountReponsitory.findByEmail(name).orElseThrow(()->new AppException(ErrorCode.NOT_FOUND_USER));
        accountMapper.updateAccount(account,request);
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        account.setPassword(passwordEncoder.encode(request.getPassword()));
        AccountResponse accountResponse = accountMapper.toAccountResponse(accountReponsitory.save(account));
        return accountResponse;
    }

    public AccountResponse getAccountByEmail(String email){
        Account account = accountReponsitory.findByEmail(email)
                .orElseThrow(()->new AppException(ErrorCode.NOT_FOUND_USER));
        AccountResponse accountResponse =accountMapper.toAccountResponse(account);
        //accountResponse.setRoles(account.getRole());
        return accountResponse;
    }
    public Account getAccountByEmail1(String email){
        return  accountReponsitory.findByEmail(email)
                .orElseThrow(()->new AppException(ErrorCode.NOT_FOUND_USER));

    }

    public boolean checkExistEmail(String email){
        return accountReponsitory.existsByEmail(email);
    }

    @PreAuthorize("hasAuthority('GET_MY_INFO')")
    public  AccountResponse getMyAccount(){
        var context = SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();
        Account account = accountReponsitory.findByEmail(name).orElseThrow(()->new AppException(ErrorCode.NOT_FOUND_USER));
        return accountMapper.toAccountResponse(account);
    }

    //@PreAuthorize("hasRole('ADMIN')")
    public List<AccountResponse> getAllAccountsBanned(){
         return accountReponsitory.findAllByDeleted(true).stream().map(accountMapper::toAccountResponse).toList();
    }

    public String generateOtp(String email){
        String result = "";
        Account account = accountReponsitory.findByEmail(email)
                .orElseThrow(()->new AppException(ErrorCode.NOT_FOUND_USER));
        Timestamp oldOtp = new Timestamp(0);
        Otp otp = otpRepository.findByAccountId(account.getId()).orElse(null);
        if (otp == null) {
            otp = otpRepository.save(Otp.builder().account(account).build());
        }
        if (otp.getOtpGeneratedTime() != null) {
            oldOtp = Timestamp.valueOf(otp.getOtpGeneratedTime());
        }
        Timestamp current = Timestamp.valueOf(LocalDateTime.now());
        if (oldOtp.getTime()/1000 + 3*60 > current.getTime()/1000 ) {
            result = String.valueOf((oldOtp.getTime()/1000));
        } else {
            String otpStr = otpUtil.generateOtp();
            try{
                emailUtil.sendOtpEmail(email,account.getFirstName(),otpStr);
            } catch (MessagingException e) {
                throw new AppException(ErrorCode.OTP_ERROR);
            }

            otp.setOtp(otpStr);
            otp.setOtpGeneratedTime(LocalDateTime.now());
            otpRepository.save(otp);
            Timestamp newOtp = Timestamp.valueOf(otp.getOtpGeneratedTime());
            result = String.valueOf(newOtp.getTime()/1000);
        }

        return result;
    }

    public boolean VerifyOtp(String email,String otp){
        Account account = accountReponsitory.findByEmail(email)
                .orElseThrow(()->new AppException(ErrorCode.NOT_FOUND_USER));
        Otp otpObj = otpRepository.findByAccountId(account.getId()).orElseThrow(null);
        if(!(otp.equals(otpObj.getOtp())
                && Duration.between(otpObj.getOtpGeneratedTime(), LocalDateTime.now()).toSeconds() < 60*3)){
            throw new AppException(ErrorCode.OTP_ERROR);
        }

        return true;
    }
}
