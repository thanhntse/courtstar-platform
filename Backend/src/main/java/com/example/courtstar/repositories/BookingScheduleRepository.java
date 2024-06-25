package com.example.courtstar.repositories;

import com.example.courtstar.entity.BookingSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingScheduleRepository extends JpaRepository<BookingSchedule, Integer> {
    @Query("SELECT bs FROM BookingSchedule bs JOIN bs.slot s JOIN s.centre c WHERE c.id = :centreId")
    List<BookingSchedule> findAllByCentreId(@Param("centreId") int centreId);
    List<BookingSchedule> findAllByAccountId(int accountId);
}
