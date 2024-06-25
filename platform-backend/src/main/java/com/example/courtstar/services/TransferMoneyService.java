package com.example.courtstar.services;

import com.example.courtstar.dto.request.AuthWithdrawalOrderRequest;
import com.example.courtstar.dto.request.TranferMoneyRequest;
import com.example.courtstar.dto.response.AuthWithdrawalOrderResponse;
import com.example.courtstar.dto.response.TranferMoneyReponse;
import com.example.courtstar.entity.CentreManager;
import com.example.courtstar.entity.TransferMoney;
import com.example.courtstar.exception.AppException;
import com.example.courtstar.exception.ErrorCode;
import com.example.courtstar.mapper.TransferMoneyMapper;
import com.example.courtstar.repositories.CentreManagerRepository;
import com.example.courtstar.repositories.TransferMoneyRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.stereotype.Service;

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
    public TranferMoneyReponse createTranferMoney(int idManagerCentre,TranferMoneyRequest request) {
        CentreManager centreManager = centreManagerRepository.findById(idManagerCentre).orElse(null);
        if(centreManager.getCurrentBalance()-request.getAmount()<2000000){
            throw new AppException(ErrorCode.NOT_ENOUGHT_MONEY);
        }
        TransferMoney transferMoney = transferMoneyMapper.toTransferMoney(request);
        System.out.println(transferMoney);
        List<TransferMoney> transferMonies = new ArrayList<>();
        transferMonies.add(transferMoney);
        centreManager.setTransferMonies(transferMonies);
        centreManagerRepository.save(centreManager);
        transferMoney.setManager(centreManager);
        return transferMoneyMapper.toTranferMoneyReponse(transferMoneyRepository.save(transferMoney));
    }

    public AuthWithdrawalOrderResponse authenticateTranferMoney(AuthWithdrawalOrderRequest request, int idTransfer) {

        TransferMoney transferMoney = transferMoneyRepository.findById(idTransfer).orElseThrow(()->new AppException(ErrorCode.NOT_FOUND_TRANSFER_MONEY));
        if(transferMoney.isStatus()==true){
            throw new AppException(ErrorCode.TRANFER_MONEY_SUCCESS);
        }
        CentreManager centreManager = centreManagerRepository.getById(transferMoney.getManager().getId());
        if(centreManager.getCurrentBalance()-transferMoney.getAmount()<2000000){
            transferMoney.setStatus(false);
            throw new AppException(ErrorCode.NOT_ENOUGHT_MONEY);
        }
        centreManager.setCurrentBalance(centreManager.getCurrentBalance()-transferMoney.getAmount());
        transferMoney.setStatus(true);
        transferMoney.setDateAuthenticate(request.getDateAuthenticate());
        centreManagerRepository.save(centreManager);
        return transferMoneyMapper.toAuthWithdrawalOrderResponse(transferMoneyRepository.save(transferMoney));
    }

    public List<TransferMoney> getAllTranferMoney() {
        return  transferMoneyRepository.findAll();
    }
    public List<TransferMoney> getListTranferSuccess() {
        return transferMoneyRepository.findAllByStatus(true);
    }
    public List<TransferMoney> getListTranferNotSuccess() {
        return transferMoneyRepository.findAllByStatus(false);
    }
}
