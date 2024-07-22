package com.example.courtstar.services;

import com.example.courtstar.dto.response.CourtResponse;
import com.example.courtstar.entity.*;
import com.example.courtstar.exception.AppException;
import com.example.courtstar.exception.ErrorCode;
import com.example.courtstar.mapper.CourtMapper;
import com.example.courtstar.repositories.BookingDetailRepository;
import com.example.courtstar.repositories.CentreRepository;
import com.example.courtstar.repositories.CourtRepository;
import com.example.courtstar.util.EmailRefundUtil;
import jakarta.mail.MessagingException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
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
    @Autowired
    private CentreRepository centreRepository;
    @Autowired
    private EmailRefundUtil emailRefundUtil;
    @Autowired
    private BookingDetailRepository bookingDetailRepository;

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

        if (!court.isStatus()) {
            court.getBookingDetails().forEach(
                    bookingDetail -> {
                        if (bookingDetail.isStatus() && bookingDetail.getDate().isAfter(LocalDate.now())) {
                            String email;
                            String fullName;
                            if (bookingDetail.getBookingSchedule() == null) {
                                return;
                            }
                            if (bookingDetail.getBookingSchedule().getAccount() != null) {
                                email = bookingDetail.getBookingSchedule().getAccount().getEmail();
                                fullName = bookingDetail.getBookingSchedule().getAccount().getFirstName();
                            } else {
                                email = bookingDetail.getBookingSchedule().getGuest().getEmail();
                                fullName = bookingDetail.getBookingSchedule().getGuest().getFullName();
                            }
                            try {
                                emailRefundUtil.sendRefundMail(email, fullName);
                                bookingDetail.setStatus(false);
                                bookingDetailRepository.save(bookingDetail);
                            } catch (MessagingException e) {
                                throw new RuntimeException(e);
                            }
                        }
                    }
            );
        }
        courtRepository.save(court);

        return courtMapper.toCourtResponse(courtRepository.findById(court.getId())
                .orElseThrow(()->new AppException(ErrorCode.NOT_FOUND_COURT)));
    }

    public List<Court> getCourtByCentreId(int centreId) throws AppException {
        return courtRepository.findAllByCentreId(centreId);
    }

    public List<Court> addCourtByCentreId(int centreId) throws AppException {
        Centre centre = centreRepository.findById(centreId).orElseThrow(null);
        List<Court> courts = centre.getCourts();
        centre.setNumberOfCourts(centre.getNumberOfCourts() + 1);
        Court court = Court.builder()
                .courtNo(centre.getNumberOfCourts())
                .centre(centre)
                .status(true)
                .build();
        courts.add(court);
        centreRepository.save(centre);
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
