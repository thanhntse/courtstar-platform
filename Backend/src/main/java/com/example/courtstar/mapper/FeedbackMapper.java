package com.example.courtstar.mapper;

import com.example.courtstar.dto.request.FeedbackRequest;
import com.example.courtstar.dto.response.FeedbackResponse;
import com.example.courtstar.entity.Feedback;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface FeedbackMapper {
    Feedback toFeedback(FeedbackRequest request);
    FeedbackResponse toFeedbackResponse(Feedback feedback);
}
