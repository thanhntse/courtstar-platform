package com.example.courtstar.repositories;

import com.example.courtstar.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Integer> {
    Optional<List<Feedback>> findAllByCentreId(int centreId);
    Optional<Feedback> findByBookingScheduleId(int bookingScheduleId);
}
