package com.example.courtstar.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Entity
@Data
@Table(name = "booking_detail")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookingDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    Integer id;

    @Column(name = "date")
    LocalDate date;

    @ManyToOne
    @JoinColumn(name = "court_id")
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    Court court;

    @ManyToOne
    @JoinColumn(name = "slot_id")
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    Slot slot;

    @Column(name = "status")
    @Builder.Default
    boolean status = false;

    @Column(name = "checked_in")
    @Builder.Default
    boolean checkedIn = false;

    @ManyToOne
    @JoinColumn(name = "booking_schedule_id")
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    BookingSchedule bookingSchedule;
}
