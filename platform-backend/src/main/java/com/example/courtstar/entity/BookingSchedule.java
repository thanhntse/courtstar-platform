package com.example.courtstar.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Entity
@Data
@AllArgsConstructor
@Table(name = "booking_schedule")
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookingSchedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    Integer id;

    @Column(name = "date")
    LocalDate date;

    @Column(name = "total_price")
    double totalPrice;

    @Column(name = "status")
    @Builder.Default
    boolean status = false;

    @Column(name = "success")
    @Builder.Default
    boolean success = false;

    @ManyToOne
//    @JsonIgnore
    @JoinColumn(name = "account_id")
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    Account account;

    @ManyToOne
//    @JsonIgnore
    @JoinColumn(name = "guest_id")
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    Guest guest;

    @ManyToOne
//    @JsonIgnore
    @JoinColumn(name = "slot_id")
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    Slot slot;

    @ManyToOne
//    @JsonIgnore
    @JoinColumn(name = "court_id")
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    Court court;
}
