package com.example.courtstar.services;

import com.example.courtstar.dto.request.CentreRequest;
import com.example.courtstar.dto.request.CourtRequest;
import com.example.courtstar.dto.response.CentreResponse;
import com.example.courtstar.dto.response.CourtResponse;
import com.example.courtstar.entity.*;
import com.example.courtstar.exception.AppException;
import com.example.courtstar.exception.ErrorCode;
import com.example.courtstar.mapper.CentreMapper;
import com.example.courtstar.mapper.CourtMapper;
import com.example.courtstar.repositories.AccountReponsitory;
import com.example.courtstar.repositories.CentreRepository;
import com.example.courtstar.repositories.CourtRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@Slf4j
@EnableWebSecurity
@EnableMethodSecurity

public class CourtService {
    @Autowired
    CourtRepository courtRepository;
    @Autowired
    CourtMapper courtMapper;

    public CourtResponse createCourt(CourtRequest courtRequest) throws AppException {
        Court court = courtMapper.toCourt(courtRequest);
        return courtMapper.toCourtResponse(courtRepository.save(court));
    }
    public CourtResponse getCourtById(int centreId, int courtNo) throws AppException {
        List<Court> courts = courtRepository.findAllByCourtNo(courtNo);
        Court court = courts.stream()
                .filter(c -> c.getCentre().getId().equals(centreId))
                .findFirst()
                .orElseThrow(null);

        return courtMapper.toCourtResponse(courtRepository.findById(court.getId())
                .orElseThrow(()->new AppException(ErrorCode.NOT_FOUND_COURT)));
    }

    public CourtResponse editCourtById(int centreId, int courtNo) throws AppException {
        List<Court> courts = courtRepository.findAllByCourtNo(courtNo);
        Court court = courts.stream()
                .filter(c -> c.getCentre().getId().equals(centreId))
                .findFirst()
                .orElseThrow(null);
        court.setStatus(!court.isStatus());
        courtRepository.save(court);

        return courtMapper.toCourtResponse(courtRepository.findById(court.getId())
                .orElseThrow(()->new AppException(ErrorCode.NOT_FOUND_COURT)));
    }

    public List<Court> getCourtByCentreId(int centreId) throws AppException {
        return courtRepository.findAllByCentreId(centreId);
    }

    public CourtResponse disableCourtById(int id) throws AppException {
        Court court = courtRepository.findById(id).orElseThrow(()->new AppException(ErrorCode.NOT_FOUND_COURT));
        court.setStatus(false);
        return courtMapper.toCourtResponse(courtRepository.save(court));
    }
    public List<CourtResponse> getAllCourts() throws AppException {
        return courtRepository.findAll().stream().map(courtMapper::toCourtResponse).collect(Collectors.toList());
    }

}
