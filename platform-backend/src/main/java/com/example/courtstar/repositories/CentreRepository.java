package com.example.courtstar.repositories;

import com.example.courtstar.entity.Centre;
import com.example.courtstar.entity.CentreManager;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CentreRepository extends JpaRepository<Centre, Integer> {
    List<Centre> findAllByDeletedAndStatus(boolean isDelete, boolean status);

}
