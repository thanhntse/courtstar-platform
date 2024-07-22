package com.example.courtstar.repositories;

import com.example.courtstar.entity.TransferMoney;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransferMoneyRepository extends JpaRepository<TransferMoney, Integer> {
    public List<TransferMoney> findAllByStatus(boolean status);
    public List<TransferMoney> findAllByManagerId(Integer id);
}
