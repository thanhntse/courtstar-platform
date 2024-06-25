package com.example.courtstar.repositories;

import com.example.courtstar.entity.SlotUnavailable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SlotUnavailableRepository extends JpaRepository<SlotUnavailable, Integer> {
}
