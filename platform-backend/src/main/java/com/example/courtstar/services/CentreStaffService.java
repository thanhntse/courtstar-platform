package com.example.courtstar.services;

import com.example.courtstar.dto.response.AccountResponse;
import com.example.courtstar.dto.response.CentreManagerResponse;
import com.example.courtstar.entity.CentreManager;
import com.example.courtstar.entity.CentreStaff;
import com.example.courtstar.mapper.AccountMapperImpl;
import com.example.courtstar.repositories.CentreRepository;
import com.example.courtstar.repositories.CentreStaffRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@Slf4j
@EnableWebSecurity
@EnableMethodSecurity
public class CentreStaffService {

    @Autowired
    private CentreStaffRepository centreStaffRepository;
    @Autowired
    private CentreRepository centreRepository;

    public List<CentreStaff> getAllStaff() {
        return centreStaffRepository.findAll();
    }

    public List<CentreStaff> getCentreStaffOfCentre(int centreId) {
        return centreStaffRepository.findAllByCentreId(centreId)
                .stream()
                .filter(centreStaff -> !centreStaff.getAccount().isDeleted())
                .collect(Collectors.toList());
    }

    public Boolean moveToCentre(int staffId, int centreId) {
        CentreStaff centreStaff = centreStaffRepository.findById(staffId).orElseThrow(null);
        centreStaff.setCentre(centreRepository.findById(centreId).orElseThrow(null));
        centreStaffRepository.save(centreStaff);
        return true;
    }
}
