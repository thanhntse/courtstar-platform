package com.example.courtstar.exception;

import com.example.courtstar.dto.request.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
@Slf4j

@ControllerAdvice
public class GlobleHandlingException {
    @ExceptionHandler(value = Exception.class)
    ResponseEntity<ApiResponse> handlingRuntimeException(RuntimeException exception) {
        log.error("Exception: ", exception);
        ApiResponse apiResponse = new ApiResponse();

        apiResponse.setCode(ErrorCode.UNCATEGORIZED_EXCEPTION.getCode());
        apiResponse.setMessage(ErrorCode.UNCATEGORIZED_EXCEPTION.getMessage());

        return ResponseEntity.badRequest().body(apiResponse);
    }
    @ExceptionHandler(AppException.class)
    public ResponseEntity<ApiResponse> handleAppException(AppException e) {

        ApiResponse response = ApiResponse.builder()
                .message(e.getErrorCode().getMessage())
                .code(e.getErrorCode().getCode())
                .build();
        return ResponseEntity.status(e.getErrorCode().getHttpStatusCode()).body(response);
    }
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse> handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {
        String getMessage = e.getFieldError().getDefaultMessage();
        ErrorCode errorCode = ErrorCode.valueOf(getMessage);
        ApiResponse response = ApiResponse.builder()
                .message(errorCode.getMessage())
                .code(errorCode.getCode())
                .build();
        return ResponseEntity.status(errorCode.getHttpStatusCode()).body(response);
    }
//    @ExceptionHandler(AccessDeniedException.class)
//    public ResponseEntity<ApiResponse> handleAccessDeniedException(AccessDeniedException e) {
//        ErrorCode errorCode = ErrorCode.UNAUTHORIZED;
//        return ResponseEntity.status(errorCode.getHttpStatusCode()).body(
//                ApiResponse.builder()
//                        .message(errorCode.getMessage())
//                        .code(errorCode.getCode())
//                        .build()
//        );
//    }
}
