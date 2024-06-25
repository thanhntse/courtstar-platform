package com.example.courtstar.repositories;

import com.example.courtstar.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer> {
    Optional<Payment> findByBookingScheduleId(Integer bsId);
    Optional<Payment> findByTransactionCode(String code);
}
