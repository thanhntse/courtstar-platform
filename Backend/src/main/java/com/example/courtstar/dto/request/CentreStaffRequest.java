package com.example.courtstar.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class CentreStaffRequest {
    @Email(message = "EMAIL_INVALID")
    @NotNull(message = "EMAIL_NULL")
    String email;
    @Size(min = 6,message = "PASSWORD_INVALID")
    @NotNull(message = "PASSWORD_NULL")
    String password;
    @Size(min=10,max = 10,message = "PHONE_INVALID")
    String phone;
    String firstName;
    String lastName;
    int centreId;
}