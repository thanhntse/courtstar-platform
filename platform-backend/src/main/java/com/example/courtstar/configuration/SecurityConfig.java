package com.example.courtstar.configuration;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@Slf4j

public class SecurityConfig {
    @Value("${jwt.signerKey}")
    protected String signerKey;
    @Autowired
    private CustomJwtDecoder customJwtDecoder;
    private final String[] PUBLIC_URLS_POST = {"/account","/account/partner","/auth/token","/auth/introspect"
            ,"/auth/logout","/auth/refresh","/account/reset-password","/booking","/payment/order-status"
            ,"/payment/donate-callback","/payment/booking-callback","/payment/order-info"
            ,"/tranfermoney/authenticateWithdrawalOrder/{id}"};
    private final String[] PUBLIC_URLS_GET = {"/centre/getAllCentreActive", "/centre/getCentre/{id}","/court/{centreId}/{courtNo}"
            ,"/feedback/{id}","/tranfermoney/getAllSuccess"};
    private final String[] PUBLIC_URLS_PUT = {"/account/regenerate-otp"};
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
                .authorizeHttpRequests()
                .requestMatchers(HttpMethod.POST,PUBLIC_URLS_POST).permitAll()
                .requestMatchers(HttpMethod.PUT,PUBLIC_URLS_PUT).permitAll()
                .requestMatchers(HttpMethod.GET,PUBLIC_URLS_GET).permitAll()
                .anyRequest().authenticated()
                .and()
                .oauth2Login()
                .defaultSuccessUrl("/account/createEmail", true);

        httpSecurity.oauth2ResourceServer()
                .jwt(jwtConfigurer -> jwtConfigurer.decoder(customJwtDecoder)
                        .jwtAuthenticationConverter(jwtAuthenticationConverter()))
                .authenticationEntryPoint(new JWTAuthenticationEntryPoint());

        httpSecurity.csrf(AbstractHttpConfigurer::disable);

        return httpSecurity.build();
    }

    @Bean
    JwtAuthenticationConverter jwtAuthenticationConverter(){
        JwtGrantedAuthoritiesConverter jwtGrantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        jwtGrantedAuthoritiesConverter.setAuthorityPrefix("");
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(jwtGrantedAuthoritiesConverter);
        return converter;
    }


    @Bean
    PasswordEncoder passwordEncoder() {
        return  new BCryptPasswordEncoder(10);
    }
}