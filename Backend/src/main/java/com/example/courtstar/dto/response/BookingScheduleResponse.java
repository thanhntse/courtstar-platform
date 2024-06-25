package com.example.courtstar.dto.response;

import com.example.courtstar.entity.Account;
import com.example.courtstar.entity.Court;
import com.example.courtstar.entity.Guest;
import com.example.courtstar.entity.Slot;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class BookingScheduleResponse {

    Integer id;
    Integer centreId;
    LocalDate date;
    double totalPrice;
    Slot slot;
    Court court;
    Account account;
    Guest guest;
    String centreName;
    String centreAddress;
    String centreImg;
    int rate;
    boolean status;
}
