package com.example.courtstar.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "payment")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    Integer id;

    @Column(name="transaction_code")
    String transactionCode;

    @Column(name="zp_trans_id")
    String zpTransId;

    @Column(name="vnp_trans_id")
    String vnpTransId;

    @Column(name = "date")
    LocalDateTime date;

    @Column(name = "status")
    boolean status;

    @Column(name = "amount")
    double amount;

    @OneToOne
    BookingSchedule bookingSchedule;
}
