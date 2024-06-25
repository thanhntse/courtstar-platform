package com.example.courtstar.services;

import com.example.courtstar.constant.PredefinedRole;
import com.example.courtstar.dto.response.AccountResponse;
import com.example.courtstar.entity.Account;
import com.example.courtstar.entity.CentreStaff;
import com.example.courtstar.mapper.AccountMapper;
import com.example.courtstar.mapper.AccountMapperImpl;
import com.example.courtstar.repositories.AccountReponsitory;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@Slf4j
@EnableWebSecurity
@EnableMethodSecurity
public class CustomerService {

    @Autowired
    private AccountReponsitory accountReponsitory;

    public List<Account> getAllCustomer() {
        return accountReponsitory.findAll().stream()
                .filter(
                        account -> account.getRole().getName().equals(PredefinedRole.CUSTOMER_ROLE)
                ).toList();
    }
}
