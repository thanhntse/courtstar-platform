package com.example.courtstar.repositories;

import com.example.courtstar.entity.Account;
import com.example.courtstar.entity.CentreManager;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CentreManagerRepository extends JpaRepository<CentreManager, Integer> {
    Optional<CentreManager> findByAccountId(Integer accountId);
}
