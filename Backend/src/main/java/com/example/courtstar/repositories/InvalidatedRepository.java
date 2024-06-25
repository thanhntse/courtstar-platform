package com.example.courtstar.repositories;

import com.example.courtstar.entity.InvalidatedToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InvalidatedRepository extends  JpaRepository<InvalidatedToken,String> {
}
