package com.example.courtstar.services;

import com.example.courtstar.constant.PredefinedNotificationType;
import com.example.courtstar.dto.request.AuthWithdrawalOrderRequest;
import com.example.courtstar.dto.request.DescriptionRequest;
import com.example.courtstar.dto.request.TransferMoneyRequest;
import com.example.courtstar.dto.response.AuthWithdrawalOrderResponse;
import com.example.courtstar.dto.response.TransferMoneyResponse;
import com.example.courtstar.entity.Account;
import com.example.courtstar.entity.CentreManager;
import com.example.courtstar.entity.Notification;
import com.example.courtstar.entity.TransferMoney;
import com.example.courtstar.exception.AppException;
import com.example.courtstar.exception.ErrorCode;
import com.example.courtstar.mapper.TransferMoneyMapper;
import com.example.courtstar.repositories.AccountReponsitory;
import com.example.courtstar.repositories.CentreManagerRepository;
import com.example.courtstar.repositories.NotificationRepository;
import com.example.courtstar.repositories.TransferMoneyRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@Slf4j
@EnableWebSecurity
@EnableMethodSecurity
public class TransferMoneyService {
    TransferMoneyMapper transferMoneyMapper;
    TransferMoneyRepository transferMoneyRepository;
    CentreManagerRepository centreManagerRepository;
    AccountReponsitory accountReponsitory;
    private final NotificationRepository notificationRepository;

    public TransferMoneyResponse createTransferMoney(int id, TransferMoneyRequest request) {
        request.setAmount(request.getAmount().replace(".",""));
        CentreManager centreManager = centreManagerRepository.findById(id).orElse(null);
        if(centreManager.getCurrentBalance()-Double.parseDouble(request.getAmount())<0){
            throw new AppException(ErrorCode.NOT_ENOUGHT_MONEY);
        }
        TransferMoney transferMoney = transferMoneyMapper.toTransferMoney(request);
        transferMoney.setCardHolderName(transferMoney.getCardHolderName().toUpperCase());

        List<TransferMoney> transferMonies = centreManager.getTransferMonies();
        if(transferMonies == null){
            transferMonies = new ArrayList<>();
        }
        transferMonies.add(transferMoney);
        centreManagerRepository.save(centreManager);
        transferMoney.setManager(centreManager);
        return transferMoneyMapper.toTransferMoneyResponse(transferMoneyRepository.save(transferMoney));
    }

    public AuthWithdrawalOrderResponse authenticateTransferMoney(int idTransfer) {

        TransferMoney transferMoney = transferMoneyRepository.findById(idTransfer).orElseThrow(()->new AppException(ErrorCode.NOT_FOUND_TRANSFER_MONEY));
        if(transferMoney.isStatus()==true){
            throw new AppException(ErrorCode.TRANFER_MONEY_SUCCESS);
        }
        CentreManager centreManager = centreManagerRepository.findById(transferMoney.getManager().getId())
                .orElseThrow(null);
        if(centreManager.getCurrentBalance()-transferMoney.getAmount()<0){
            transferMoney.setStatus(false);
            throw new AppException(ErrorCode.NOT_ENOUGHT_MONEY);
        }
        centreManager.setCurrentBalance(centreManager.getCurrentBalance()-transferMoney.getAmount());
        transferMoney.setStatus(true);
        transferMoney.setDateAuthenticate(LocalDateTime.now());
        centreManagerRepository.save(centreManager);

        notificationRepository.save(Notification.builder()
                .type(PredefinedNotificationType.ACCEPT_WITHDRAWAL)
                .date(LocalDateTime.now())
                .content(PredefinedNotificationType.ACCEPT_WITHDRAWAL)
                .account(centreManager.getAccount())
                .build());

        return transferMoneyMapper.toAuthWithdrawalOrderResponse(transferMoneyRepository.save(transferMoney));
    }

    public AuthWithdrawalOrderResponse authenticateDenyTransferMoney(int idTransfer, DescriptionRequest descriptionRequest) {

        TransferMoney transferMoney = transferMoneyRepository.findById(idTransfer).orElseThrow(()->new AppException(ErrorCode.NOT_FOUND_TRANSFER_MONEY));
        if(transferMoney.isStatus()==true){
            throw new AppException(ErrorCode.TRANFER_MONEY_SUCCESS);
        }
        CentreManager centreManager = centreManagerRepository.findById(transferMoney.getManager().getId())
                .orElseThrow(null);
        transferMoney.setDateAuthenticate(LocalDateTime.now());
        transferMoney.setDescription(descriptionRequest.getDescription());
        centreManagerRepository.save(centreManager);

        notificationRepository.save(Notification.builder()
                .type(PredefinedNotificationType.DENIED_WITHDRAWAL)
                .date(LocalDateTime.now())
                .content(descriptionRequest.getDescription())
                .account(centreManager.getAccount())
                .build());

        return transferMoneyMapper.toAuthWithdrawalOrderResponse(transferMoneyRepository.save(transferMoney));
    }

    public List<TransferMoney> getAllTransferMoneyOfManager() {
        var context = SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();

        Account account = accountReponsitory.findByEmail(name)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND_USER));

        CentreManager manager = centreManagerRepository.findByAccountId(account.getId())
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND_USER));
        return  transferMoneyRepository.findAllByManagerId(manager.getId());
    }

    public List<TransferMoneyResponse> getAllTransferMoney() {
        return transferMoneyRepository.findAll().stream()
                .map(
                        transferMoney -> {
                            TransferMoneyResponse response =
                                    transferMoneyMapper.toTransferMoneyResponse(transferMoney);
                            response.setManagerEmail(transferMoney.getManager()
                                    .getAccount().getEmail());
                            return response;
                        }
                )
                .toList();
    }

    public List<TransferMoney> getListTransferSuccess() {
        return transferMoneyRepository.findAllByStatus(true);
    }
    public List<TransferMoney> getListTransferNotSuccess() {
        return transferMoneyRepository.findAllByStatus(false);
    }
}
