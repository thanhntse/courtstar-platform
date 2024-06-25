package com.example.courtstar.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;

@Data
@Entity
@Table(name = "invalidated_token")
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InvalidatedToken {
    @Id
    @Column(name = "id", nullable = false)
    String id;

    @Column(name = "expiry_time")
    Date expiryTime;
}
