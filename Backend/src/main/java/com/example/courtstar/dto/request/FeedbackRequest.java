package com.example.courtstar.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class FeedbackRequest {
    String content;
    @Builder.Default
    LocalDateTime createDate = LocalDateTime.now();
    int rate;
    int centreId;
    int bookingId;
}
