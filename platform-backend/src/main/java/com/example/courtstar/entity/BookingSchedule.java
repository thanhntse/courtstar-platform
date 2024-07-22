package com.example.courtstar.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.List;

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

    @Column(name = "total_price")
    double totalPrice;

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

    @OneToMany(mappedBy = "bookingSchedule", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    List<BookingDetail> bookingDetails;
}
