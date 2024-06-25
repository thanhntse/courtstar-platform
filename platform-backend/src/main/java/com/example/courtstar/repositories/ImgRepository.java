package com.example.courtstar.repositories;

import com.example.courtstar.entity.Image;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ImgRepository extends JpaRepository<Image, Integer> {

}
