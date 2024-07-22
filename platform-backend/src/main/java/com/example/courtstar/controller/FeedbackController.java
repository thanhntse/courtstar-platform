package com.example.courtstar.controller;

import com.example.courtstar.dto.request.ApiResponse;
import com.example.courtstar.dto.request.FeedbackRequest;
import com.example.courtstar.dto.response.FeedbackResponse;
import com.example.courtstar.entity.Feedback;
import com.example.courtstar.services.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = {"http://localhost:3000", "https://courtstar-platform-frontend.vercel.app/"})
@RestController
@RequestMapping("/feedback")
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    @PostMapping("/create")
    public ApiResponse<Feedback> createFeedback(@RequestBody FeedbackRequest request){
        return ApiResponse.<Feedback>builder()
                .data(feedbackService.createFeedback(request))
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<List<FeedbackResponse>> getAllFeedbackOfCentre(@PathVariable Integer id) {
        return ApiResponse.<List<FeedbackResponse>>builder()
                .data(feedbackService.getFeedbackOfCentre(id))
                .build();
    }
}
