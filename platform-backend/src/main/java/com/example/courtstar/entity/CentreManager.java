package com.example.courtstar.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Entity
@Data
@Table(name = "centre_manager")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CentreManager {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    Integer id;

    @Column(name = "address")
    String address;

    @Column(name = "current_balance")
    double currentBalance;

    @OneToMany(mappedBy = "manager", cascade = CascadeType.ALL, orphanRemoval = true)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    List<Centre> centres;

    @OneToOne
    Account account;

    @OneToMany(mappedBy = "manager")
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    @JsonIgnore
    List<TransferMoney> transferMonies;

}

