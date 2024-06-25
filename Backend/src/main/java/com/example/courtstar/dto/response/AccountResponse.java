package com.example.courtstar.dto.response;

import com.example.courtstar.entity.CentreManager;
import com.example.courtstar.entity.Role;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AccountResponse {
    Integer id;
    String email;
    String phone;
    String firstName;
    String lastName;
    Role role;
    boolean deleted;
}
