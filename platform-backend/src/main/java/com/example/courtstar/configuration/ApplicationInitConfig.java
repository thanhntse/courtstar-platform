package com.example.courtstar.configuration;

import com.example.courtstar.constant.PredefinedRole;
import com.example.courtstar.entity.Account;
import com.example.courtstar.entity.Permission;
import com.example.courtstar.entity.Role;
import com.example.courtstar.repositories.AccountReponsitory;
import com.example.courtstar.repositories.PermissionReponsitory;
import com.example.courtstar.repositories.RoleReponsitory;
import com.example.courtstar.services.RoleService;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Configuration
@Slf4j
public class ApplicationInitConfig {
//    @Autowired
//    private PasswordEncoder passwordEncoder;
//    @Autowired
//    private RoleService roleService;
//    @Autowired
//    private PermissionReponsitory permissionReponsitory;
//    @NonFinal
//    static final String ADMIN_EMAIL = "Admin@gmail.com";
//    @NonFinal
//    static final String ADMIN_PASSWORD = "admin";
    @Bean
//    ApplicationRunner applicationContext(AccountReponsitory accountReponsitory, RoleReponsitory roleReponsitory) {
    ApplicationRunner applicationContext() {
        log.info("Initializing application.....");
//        Permission getInforPermission = permissionReponsitory.save(Permission.builder()
//                .name("GET_MY_INFO")
//                .description("Read permission")
//                .build());
//
//        roleReponsitory.save(Role.builder()
//                   .name(PredefinedRole.CUSTOMER_ROLE)
//                .description("Customer role")
//                .permissions(new HashSet<>(Set.of(getInforPermission)))
//                .build());
//        roleReponsitory.save(Role.builder()
//                .name(PredefinedRole.MANAGER_ROLE)
//                .description("Manager role")
//                .permissions(new HashSet<>(Set.of(getInforPermission)))
//                .build());
//        roleReponsitory.save(Role.builder()
//                .name(PredefinedRole.STAFF_ROLE)
//                .description("Staff role")
//                .permissions(new HashSet<>(Set.of(getInforPermission)))
//                .build());
//
//        Role adminRole = roleReponsitory.save(Role.builder()
//                .name(PredefinedRole.ADMIN_ROLE)
//                .description("Admin role")
//                .permissions(new HashSet<>(Set.of(getInforPermission)))
//                .build());
        return args -> {
//            if(accountReponsitory.findByEmail(ADMIN_EMAIL).isEmpty()) {
//
//
//
//                Account user = Account.builder()
//                        .email(ADMIN_EMAIL)
//                        .password(passwordEncoder.encode(ADMIN_PASSWORD))
//                        .role(adminRole)
//                        .build();
//                List<Account> accountList = adminRole.getAccounts();
//                if(accountList == null) {
//                    accountList = new ArrayList<>();
//                    adminRole.setAccounts(accountList);
//                }
//                accountList.add(user);
//                accountReponsitory.save(user);
//                roleReponsitory.save(adminRole);
//                log.warn("admin user has been created with default password: admin, please change it");
//            }
            log.info("Application initialization completed .....");
        };
    }
}