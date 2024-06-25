package com.example.courtstar.repositories;

import com.example.courtstar.entity.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PermissionReponsitory extends JpaRepository<Permission, String> {
}
