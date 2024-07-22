package com.example.courtstar.services;

import com.example.courtstar.constant.PredefinedNotificationType;
import com.example.courtstar.dto.request.BookingRequest;
import com.example.courtstar.dto.request.CentreRequest;
import com.example.courtstar.dto.response.CentreActiveResponse;
import com.example.courtstar.dto.response.CentreNameResponse;
import com.example.courtstar.dto.response.CentreResponse;
import com.example.courtstar.entity.*;
import com.example.courtstar.exception.AppException;
import com.example.courtstar.exception.ErrorCode;
import com.example.courtstar.mapper.CentreMapper;
import com.example.courtstar.repositories.*;
import com.example.courtstar.util.EmailRefundUtil;
import jakarta.mail.MessagingException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@Slf4j
@EnableWebSecurity
@EnableMethodSecurity

public class CentreService {
    @Autowired
    CentreRepository centreRepository;
    @Autowired
    CentreMapper centreMapper;
    @Autowired
    AccountReponsitory accountReponsitory;
    @Autowired
    CourtRepository courtRepository;
    @Autowired
    private CentreManagerRepository centreManagerRepository;
    @Autowired
    private SlotRepository slotRepository;
    @Autowired
    private ImgRepository imgRepository;
    @Autowired
    private CentreStaffRepository centreStaffRepository;
    @Autowired
    private NotificationRepository notificationRepository;
    @Autowired
    private BookingDetailRepository bookingDetailRepository;
    @Autowired
    private BookingScheduleRepository bookingScheduleRepository;
    private EmailRefundUtil emailRefundUtil;
    @Autowired
    private PaymentRepository paymentRepository;


    public List<CentreResponse> getAllCentres() {
        return centreRepository.findAll()
                .stream()
                .filter(centre -> centre.getApproveDate() != null)
                .map(
                        centre -> {
                            CentreResponse response = centreMapper.toCentreResponse(centre);
                            response.setManagerId(centre.getManager().getId());
                            response.setManagerEmail(centre.getManager().getAccount().getEmail());
                            return response;
                        }
                )
                .toList();
    }

    public List<CentreResponse> getCentrePending() {
        return centreRepository.findAll()
                .stream()
                .filter(centre -> centre.getApproveDate() == null && !centre.isDeleted())
                .map(
                        centre -> {
                            CentreResponse response = centreMapper.toCentreResponse(centre);
                            response.setManagerId(centre.getManager().getId());
                            response.setManagerEmail(centre.getManager().getAccount().getEmail());
                            return response;
                        }
                )
                .toList();
    }

    public List<CentreActiveResponse> getAllCentresIsActive(boolean isActive) {
        return centreRepository.findAllByDeletedAndStatus(false, isActive).stream()
                .map(
                    centre -> {
                        CentreActiveResponse centreActiveResponse = centreMapper.toCentreActiveResponse(centre);
                        centreActiveResponse.setCoreImg(centre.getImages().get(0).getUrl());
                        return centreActiveResponse;
                    }
                )
                .toList();
    }

    public CentreResponse getCentre(int id) {
        Centre centre = centreRepository.findById(id)
                .orElseThrow(()->new AppException(ErrorCode.NOT_FOUND_CENTRE));
        CentreResponse response = centreMapper.toCentreResponse(centre);
        response.setCourts(
                centre.getCourts().stream()
                        .filter(Court::isStatus)
                        .sorted(Comparator.comparingInt(Court::getCourtNo))
                        .toList()
        );
        response.setSlots(
                centre.getSlots().stream()
                        .filter(Slot::isStatus)
                        .sorted(Comparator.comparingInt(Slot::getSlotNo))
                        .toList()
        );
        return response;
    }

    public Set<CentreNameResponse> getAllCentresOfManager(String email){
        Account account = accountReponsitory.findByEmail(email).orElseThrow(()->new AppException(ErrorCode.NOT_FOUND_USER));
        CentreManager centreManager = centreManagerRepository.findByAccountId(account.getId()).orElseThrow(()->new AppException(ErrorCode.NOT_FOUND_USER));
        Set<CentreNameResponse> centreResponses = centreManager.getCentres().stream()
                .filter(centre -> !centre.isDeleted())
                .map(centre -> {
                    CentreNameResponse centreResponse = CentreNameResponse.builder()
                            .id(centre.getId())
                            .name(centre.getName())
                            .build();
                    return centreResponse;
                }).collect(Collectors.toSet());
        return centreResponses;
    }

    public CentreNameResponse getCentreOfStaff(String email){
        Account account = accountReponsitory.findByEmail(email).orElseThrow(()->new AppException(ErrorCode.NOT_FOUND_USER));
        CentreStaff staff = centreStaffRepository.findByAccountId(account.getId())
                .orElseThrow(()->new AppException(ErrorCode.NOT_FOUND_USER));
        Centre centre = staff.getCentre();
        return CentreNameResponse.builder()
                .id(centre.getId())
                .name(centre.getName())
                .build();
    }

    public Boolean isActive(int id, boolean active) {
        Centre centre = centreRepository.findById(id).orElseThrow(()->new AppException(ErrorCode.NOT_FOUND_CENTRE));
        centre.setStatus(active);
        centreRepository.save(centre);
        return true;
    }

    public Boolean delete(int id) {
        Centre centre = centreRepository.findById(id).orElseThrow(()->new AppException(ErrorCode.NOT_FOUND_CENTRE));
        centre.setDeleted(true);
        centreRepository.save(centre);
        List<BookingSchedule> bookingSchedules = bookingScheduleRepository.findAllByCentreId(id);
        if (!bookingSchedules.isEmpty()) {
            for (BookingSchedule bookingSchedule : bookingSchedules) {
                bookingSchedule.getBookingDetails().forEach(
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
                bookingScheduleRepository.save(bookingSchedule);
            }
        }
        return true;
    }

    public CentreResponse addCentre(CentreRequest request){
        var context = SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();
        System.out.println(request.getNumberOfCourts());
        Account account = accountReponsitory.findByEmail(name).orElseThrow(()->new AppException(ErrorCode.NOT_FOUND_USER));

        CentreManager manager = centreManagerRepository.findByAccountId(account.getId())
                .orElseThrow( () -> new AppException(ErrorCode.NOT_FOUND_USER));

        if (!"MANAGER".equals(manager.getAccount().getRole().getName())) {
            throw new RuntimeException();
        }

        Centre centre = centreMapper.toCentre(request);
        centre.setPricePerHour(Double.parseDouble(request.getPricePerHour().replace(".", "")));
        centre.setManager(manager);

        // Giải phóng bộ nhớ cho các đối tượng tạm thời
        account = null;

        List<Slot> slotList = generateSlots(centre);
        centre.setSlots(slotList);

        List<Image> imgList = generateImages(request, centre);
        centre.setImages(imgList);
        centreRepository.save(centre);

        List<Court> courts = generateCourts(centre);
        centre.setCourts(courts);


        slotRepository.saveAll(slotList);
        imgRepository.saveAll(imgList);
        centreRepository.save(centre);

        notificationRepository.save(Notification.builder()
                .type(PredefinedNotificationType.ADD_CENTRE)
                .date(LocalDateTime.now())
                .content(PredefinedNotificationType.ADD_CENTRE_CONTENT)
                .account(accountReponsitory.findByEmail("Admin@gmail.com").orElse(null))
                .build());

        CentreResponse centreResponse = centreMapper.toCentreResponse(centre);
        centreResponse.setManagerId(manager.getId());

        slotList.clear();
        imgList.clear();
        courts.clear();
        centre = null;
        manager = null;
        return centreResponse;
    }

    private List<Court> generateCourts(Centre centre) {
        List<Court> courts = new ArrayList<>();
        int numberOfCourts = centre.getNumberOfCourts();

        for (int i = 1; i <= numberOfCourts; i++) {
            Court court = Court.builder()
                    .courtNo(i)
                    .status(true)
                    .centre(centre)
                    .build();
            courts.add(court);
        }
        return courtRepository.saveAll(courts);
    }

    private List<Image> generateImages(CentreRequest request, Centre centre) {
        AtomicInteger imageNo = new AtomicInteger(1);
        return request.getImages().stream()
                .map(url -> Image.builder()
                        .url(url)
                        .centre(centre)
                        .imageNo(imageNo.getAndIncrement())
                        .build())
                .collect(Collectors.toList());
    }

    private List<Slot> generateSlots(Centre centre) {
        List<Slot> slots = new ArrayList<>();
        LocalTime openTime = centre.getOpenTime();
        LocalTime closeTime = centre.getCloseTime();
        int slotDuration = centre.getSlotDuration();
        int slotNo = 1;

        LocalTime currentTime = openTime;
        boolean is24Hours = openTime.equals(closeTime);
        boolean crossesMidnight = closeTime.isBefore(openTime);

        if (is24Hours) {
            // Tạo các slot từ 0 đến 23 giờ
            for (int i = 0; i < 24; i++) {
                slots.add(Slot.builder()
                        .slotNo(slotNo++)
                        .startTime(currentTime)
                        .endTime(currentTime.plusHours(1))
                        .centre(centre)
                        .build());
                currentTime = currentTime.plusHours(1);
            }
        } else if (crossesMidnight) {
            // Tạo các slot từ nửa đêm đến closeTime
            currentTime = LocalTime.MIDNIGHT;
            while (!currentTime.isAfter(closeTime.minusHours(slotDuration))) {
                slots.add(Slot.builder()
                        .slotNo(slotNo++)
                        .startTime(currentTime)
                        .endTime(currentTime.plusHours(slotDuration))
                        .centre(centre)
                        .build());
                currentTime = currentTime.plusHours(slotDuration);
            }
            // Tạo các slot từ openTime đến nửa đêm
            currentTime = openTime;
            while (!currentTime.equals(LocalTime.MIDNIGHT)) {
                slots.add(Slot.builder()
                        .slotNo(slotNo++)
                        .startTime(currentTime)
                        .endTime(currentTime.plusHours(slotDuration))
                        .centre(centre)
                        .build());
                currentTime = currentTime.plusHours(slotDuration);
            }

        } else {
            // Tạo các slot bình thường
            while (!currentTime.isAfter(closeTime.minusHours(slotDuration))) {
                slots.add(Slot.builder()
                        .slotNo(slotNo++)
                        .startTime(currentTime)
                        .endTime(currentTime.plusHours(slotDuration))
                        .centre(centre)
                        .build());
                currentTime = currentTime.plusHours(slotDuration);
            }
        }

        return slots;
    }


    public CentreResponse updateCentre(int centreId, CentreRequest request) {
        // Lấy ngữ cảnh bảo mật và lấy tên của người dùng hiện đang xác thực
        var context = SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();

        // Tìm tài khoản liên quan đến email của người dùng đã xác thực
        Account account = accountReponsitory.findByEmail(name)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND_USER));

        // Tìm quản lý liên quan đến tài khoản
        CentreManager manager = centreManagerRepository.findByAccountId(account.getId())
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND_USER));

        // Kiểm tra xem tài khoản có vai trò "MANAGER" hay không
        if (!"MANAGER".equals(manager.getAccount().getRole().getName())) {
            throw new RuntimeException();
        }

        // Tìm trung tâm cần cập nhật
        Centre centre = centreRepository.findById(centreId)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND_CENTRE));

        account = null;
        centre.setName(request.getName());
        centre.setAddress(request.getAddress());
        centre.setDistrict(request.getDistrict());
        centre.setOpenTime(request.getOpenTime());
        centre.setCloseTime(request.getCloseTime());
        centre.setPricePerHour(Double.parseDouble(request.getPricePerHour().replace(".", "")));
        centre.setDescription(request.getDescription());
        centre.setApproveDate(null);

        //update new slot range
        updateSlots(centre);

        //update new image
        List<Image> oldImages = centre.getImages();
        oldImages.clear();

        List<Image> newImages = generateImages(request, centre);
        oldImages.addAll(newImages);

        centreRepository.save(centre);

        notificationRepository.save(Notification.builder()
                .type(PredefinedNotificationType.EDIT_CENTRE)
                .date(LocalDateTime.now())
                .content(PredefinedNotificationType.EDIT_CENTRE_CONTENT)
                .account(accountReponsitory.findByEmail("Admin@gmail.com").orElse(null))
                .build());

        CentreResponse centreResponse = centreMapper.toCentreResponse(centre);
        centreResponse.setManagerId(manager.getId());
        manager = null;
        centre = null;
        return centreResponse;
    }

    private void updateSlots(Centre centre) {
        List<Slot> currentSlots = centre.getSlots();
        List<Slot> newSlots = generateSlots(centre);

        currentSlots.forEach(
                slot -> {
                    if (!newSlots.contains(slot)) {
                        slot.setStatus(false);
                        slot.setSlotNo(0);
                    }
                }
        );

        // Update or add new slot
        for (Slot newSlot : newSlots) {
            if (!currentSlots.contains(newSlot)) {
                currentSlots.add(newSlot);
            } else {
                int index = currentSlots.indexOf(newSlot);
                currentSlots.get(index).setStatus(true);
            }
        }

        // Sort and update slotNo
        AtomicInteger slotNo = new AtomicInteger(1);

        currentSlots.stream()
                .filter(Slot::isStatus)
                .sorted(Comparator.comparing(Slot::getStartTime))
                .forEachOrdered(slot -> slot.setSlotNo(slotNo.getAndIncrement()));

    }

    public Boolean disableSlot(BookingRequest request) {
        List<BookingDetail> bookingDetails = request.getBookingDetails().stream()
                .map(bookingDetailRequest ->
                        BookingDetail.builder()
                                .date(bookingDetailRequest.getDate())
                                .slot(slotRepository.findById(bookingDetailRequest.getSlotId()).orElse(null))
                                .court(courtRepository.findById(bookingDetailRequest.getCourtId()).orElse(null))
                                .status(true)
                                .build()
                ).collect(Collectors.toList());
        bookingDetailRepository.saveAll(bookingDetails);
        return true;
    }

}
