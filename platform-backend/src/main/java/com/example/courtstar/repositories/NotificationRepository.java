package com.example.courtstar.repositories;

import com.example.courtstar.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Integer> {
    Optional<List<Notification>> findAllByAccountId(Integer integer);
}
