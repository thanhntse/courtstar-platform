package com.example.courtstar.services;

import com.example.courtstar.dto.request.AuthenticationRequest;
import com.example.courtstar.dto.request.IntrospectRequest;
import com.example.courtstar.dto.request.LogoutRequest;
import com.example.courtstar.dto.request.RefreshRequest;
import com.example.courtstar.dto.response.AuthenticationResponse;
import com.example.courtstar.dto.response.IntrospectResponse;
import com.example.courtstar.entity.Account;
import com.example.courtstar.entity.InvalidatedToken;
import com.example.courtstar.entity.Role;
import com.example.courtstar.exception.AppException;
import com.example.courtstar.exception.ErrorCode;
import com.example.courtstar.repositories.AccountReponsitory;
import com.example.courtstar.repositories.InvalidatedRepository;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.experimental.NonFinal;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.StringJoiner;
import java.util.UUID;

@Service
public class AccountAuthentication {
    private static final Logger log = LoggerFactory.getLogger(AccountAuthentication.class);
    @Autowired
    InvalidatedRepository   invalidatedRepository;
    @NonFinal
    @Value("${jwt.signerKey}")
    protected String SIGNER_KEY;
    @Autowired
    private AccountReponsitory accountService;
    @Autowired
    private AccountReponsitory accountReponsitory;
    @NonFinal
    @Value("${jwt.valid-duration}")
    protected long VALID_DURATION;
    @NonFinal
    @Value("${jwt.refreshable-duration}")
    protected long REFRESH_DURATION;
    public AuthenticationResponse Authenticate(AuthenticationRequest request) throws JOSEException {
        Account account = accountService.findByEmail(request.getEmail())
                .orElseThrow(()-> new AppException(ErrorCode.NOT_FOUND_USER));
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        if(!passwordEncoder.matches(request.getPassword(), account.getPassword())) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
        var token = generateToken(account);

        return AuthenticationResponse.builder()
                .token(token)
                .success(true)
                .account_id(account.getId())
                .role(account.getRole().getName())
                .build();
    }
    private String generateToken(Account account) throws JOSEException {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);
        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(account.getEmail())
                .claim("id",account.getId())
                .issueTime(new Date())
                .expirationTime(
                        new Date(Instant.now().plus(VALID_DURATION, ChronoUnit.SECONDS).toEpochMilli())
                )
                .issuer("courtstar.com")
                .jwtID(UUID.randomUUID().toString())
                .claim("scope",buildScope(account))
                .build();
        Payload payload = new Payload(jwtClaimsSet.toJSONObject());
        JWSObject jwsObject = new JWSObject(header,payload);
        jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
        return  jwsObject.serialize();
    }

    private String buildScope(Account account) {
        StringJoiner stringJoiner = new StringJoiner(" ");
        Role role = account.getRole();
        stringJoiner.add("ROLE_"+role.getName());
        if(!CollectionUtils.isEmpty(role.getPermissions())){
            role.getPermissions().forEach(permission -> stringJoiner.add(permission.getName()));
        }
        return stringJoiner.toString();
    }

    public IntrospectResponse introspect(IntrospectRequest request) throws JOSEException, ParseException {
        var token=  request.getToken();
        try{
            verifyToken(token,false);
        }catch (AppException e){
            return IntrospectResponse.builder()
                    .success(false)
                    .build();
        }
        return IntrospectResponse.builder()
                .success(true)
                .build();
    }

    public void logout(LogoutRequest request) throws ParseException, JOSEException {
        try{
            var sigToken = verifyToken(request.getToken(),true);
            String jit =sigToken.getJWTClaimsSet().getJWTID();
            Date expiryTime = sigToken.getJWTClaimsSet().getExpirationTime();

            log.warn(jit);
            log.warn(expiryTime.toString());

            InvalidatedToken invalidatedToken =InvalidatedToken.builder()
                    .id(jit)
                    .expiryTime(expiryTime)
                    .build();
            log.warn(invalidatedToken.toString());
            invalidatedRepository.save(invalidatedToken);
        }catch (AppException e){
            log.info(e.getMessage());
        }
    }

    private SignedJWT verifyToken(String jwt, Boolean IsRefresh) throws ParseException, JOSEException {
        JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());
        SignedJWT signedJWT = SignedJWT.parse(jwt);
        Date expirationDate =(IsRefresh)
                ? new Date(
                signedJWT.getJWTClaimsSet().getIssueTime()
                        .toInstant().plus(REFRESH_DURATION,ChronoUnit.SECONDS).toEpochMilli())
                :signedJWT.getJWTClaimsSet().getExpirationTime();
        var verified = signedJWT.verify(verifier);
        if(!(verified && expirationDate.after(new Date()))){
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
        if(invalidatedRepository.existsById(signedJWT.getJWTClaimsSet().getJWTID())){
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
        return signedJWT;
    }

    public AuthenticationResponse refreshToken(RefreshRequest request) throws ParseException, JOSEException {
        var signJWT = verifyToken(request.getToken(),true);

        var jit =signJWT.getJWTClaimsSet().getJWTID();
        Date expiryTime = signJWT.getJWTClaimsSet().getExpirationTime();
        InvalidatedToken invalidatedToken =InvalidatedToken.builder()
                .id(jit)
                .expiryTime(expiryTime)
                .build();
        invalidatedRepository.save(invalidatedToken);

        var accountName = signJWT.getJWTClaimsSet().getSubject();
        var user = accountReponsitory.findByEmail(accountName)
                .orElseThrow(()->new AppException(ErrorCode.UNAUTHENTICATED));
        var token = generateToken(user);

        return AuthenticationResponse.builder()
                .token(token)
                .success(true)
                .account_id(user.getId())
                .role(user.getRole().getName())
                .build();
    }
}