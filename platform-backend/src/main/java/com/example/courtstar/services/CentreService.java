package com.example.courtstar.services;

import com.example.courtstar.constant.PredefinedNotificationType;
import com.example.courtstar.dto.request.CentreRequest;
import com.example.courtstar.dto.request.CourtRequest;
import com.example.courtstar.dto.response.CentreActiveResponse;
import com.example.courtstar.dto.response.CentreNameResponse;
import com.example.courtstar.dto.response.CentreResponse;
import com.example.courtstar.dto.response.CourtResponse;
import com.example.courtstar.entity.*;
import com.example.courtstar.exception.AppException;
import com.example.courtstar.exception.ErrorCode;
import com.example.courtstar.mapper.CentreMapper;
import com.example.courtstar.mapper.CourtMapper;
import com.example.courtstar.repositories.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
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

    public CentreResponse createCentre(CentreRequest request) {
        Centre centre = centreMapper.toCentre(request);
        return centreMapper.toCentreResponse(centreRepository.save(centre));
    }

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
        return centreMapper.toCentreResponse(centre);
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
        LocalTime currentTime = centre.getOpenTime();
        LocalTime closeTime = centre.getCloseTime();
        int slotDuration = centre.getSlotDuration();
        int slotNo = 1;

        while (!currentTime.isAfter(closeTime.minusHours(slotDuration))) {
            slots.add(Slot.builder()
                    .slotNo(slotNo++)
                    .startTime(currentTime)
                    .endTime(currentTime.plusHours(slotDuration))
                    .centre(centre)
                    .build());
            currentTime = currentTime.plusHours(slotDuration);
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
        centre.setNumberOfCourts(request.getNumberOfCourts());
        centre.setDescription(request.getDescription());

        // Tạo danh sách slot mới cho trung tâm
        List<Slot> slotList = generateSlots(centre);
        centre.getSlots().clear();
        centre.getSlots().addAll(slotList);

        List<Image> imgList = generateImages(request, centre);
        centre.getImages().clear();
        centre.getImages().addAll(imgList);

        List<Court> courts = generateCourts(centre);
        centre.getCourts().clear();
        centre.getCourts().addAll(courts);

        // Lưu chi tiết trung tâm đã cập nhật
        centreRepository.save(centre);

        // Lưu các slot mới
        slotRepository.saveAll(slotList);
        imgRepository.saveAll(imgList);

        // Giải phóng bộ nhớ các đối tượng tạm thời
        slotList.clear();
        imgList.clear();
        courts.clear();

        // Chuyển trung tâm đã cập nhật thành đối tượng phản hồi và trả về
        CentreResponse centreResponse = centreMapper.toCentreResponse(centre);
        centreResponse.setManagerId(manager.getId());
        manager = null;
        centre = null;
        return centreResponse;
    }

}
