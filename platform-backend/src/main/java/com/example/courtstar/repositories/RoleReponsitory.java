package com.example.courtstar.repositories;

import com.example.courtstar.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoleReponsitory extends JpaRepository<Role, String> {
    Role findByName(String name);
    List<Role> findAllByName(String name);
}
