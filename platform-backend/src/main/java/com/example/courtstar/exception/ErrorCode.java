package com.example.courtstar.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;


@Getter
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
    ACCOUNT_EXIST(1001,"account already exist",HttpStatus.BAD_REQUEST),
    EMAIL_INVALID(1002,"email is invalid",HttpStatus.BAD_REQUEST),
    PASSWORD_INVALID(1003,"password must be at least 6 characters",HttpStatus.BAD_REQUEST),
    PHONE_INVALID(1004,"phone number is invalid",HttpStatus.BAD_REQUEST),
    NOT_FOUND_USER(1005,"user not found",HttpStatus.NOT_FOUND),
    UNAUTHENTICATED(1006,"unauthenticated",HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1007,"unauthorized",HttpStatus.FORBIDDEN),
    NOT_DELETE(1008,"not delete",HttpStatus.NOT_ACCEPTABLE),
    KEY_INVALID(1009,"key is invalid",HttpStatus.BAD_REQUEST),
    OTP_ERROR(1010,"otp error",HttpStatus.BAD_REQUEST),
    ERROR_ROLE(1011,"error role",HttpStatus.BAD_REQUEST),
    NOT_FOUND_CENTRE(1012,"not found centre",HttpStatus.NOT_FOUND),
    CENTRE_DISABLE(1013,"centre disabled",HttpStatus.BAD_REQUEST),
    NOT_FOUND_COURT(1014,"not found court",HttpStatus.NOT_FOUND),
    NOT_FOUND_NOTIFICATION(1015,"not found any notification",HttpStatus.NOT_FOUND),
    NOT_FOUND_TRANSFER_MONEY(1016,"not found transfer money",HttpStatus.NOT_FOUND),
    NOT_ENOUGHT_MONEY(1017,"not enought money",HttpStatus.BAD_REQUEST),
    TRANFER_MONEY_SUCCESS(1018,"tranfer money success",HttpStatus.BAD_REQUEST),
    INVALID_SLOT_BOOKING(1019,"invalid slot booking",HttpStatus.BAD_REQUEST)
    ;

    ErrorCode(int code, String message, HttpStatusCode httpStatusCode) {
        this.code = code;
        this.message = message;
        this.httpStatusCode = httpStatusCode;
    }

    int code;
    String message;
    HttpStatusCode httpStatusCode;
}
