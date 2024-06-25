package com.example.courtstar.repositories;

import com.example.courtstar.entity.CentreStaff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CentreStaffRepository extends JpaRepository<CentreStaff, Integer> {
    Optional<CentreStaff> findByAccountId(Integer accountId);
    List<CentreStaff> findAllByCentreId(Integer centreId);
}
