package com.example.courtstar.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "transfer_money")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TransferMoney {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;
    String nameBanking;
    String numberBanking;
    double amount;
    boolean status;
    LocalDateTime dateCreateWithdrawalOrder;
    LocalDateTime dateAuthenticate;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "manager_id")
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    CentreManager manager;
}
