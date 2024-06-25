package com.example.courtstar.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class AccountUpdateRequest {
    //NotNull
    @Size(min = 6,message = "PASSWORD_INVALID")
    String password;
    //@NotNull
    @Size(min=10,max = 10,message = "PHONE_INVALID")
    String phone;
    String firstName;
    String lastName;
}