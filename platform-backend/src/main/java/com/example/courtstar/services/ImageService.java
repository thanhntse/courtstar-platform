package com.example.courtstar.services;

import com.example.courtstar.dto.request.ImgRequest;
import com.example.courtstar.entity.Image;
import com.example.courtstar.repositories.ImgRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@Slf4j
@EnableWebSecurity
@EnableMethodSecurity

public class ImageService {
   @Autowired
    ImgRepository imgRepository;

   public Image addImage(ImgRequest request){
       return imgRepository.save(Image.builder().url(request.getText()).build());
   }
   public List<Image> getImages(){
       return imgRepository.findAll();
   }
}
