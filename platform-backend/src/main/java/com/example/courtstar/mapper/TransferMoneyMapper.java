package com.example.courtstar.mapper;

import com.example.courtstar.dto.request.TransferMoneyRequest;
import com.example.courtstar.dto.response.AuthWithdrawalOrderResponse;
import com.example.courtstar.dto.response.TransferMoneyResponse;
import com.example.courtstar.entity.TransferMoney;
import org.mapstruct.Mapper;
@Mapper(componentModel = "spring")
public interface TransferMoneyMapper {
    TransferMoney toTransferMoney(TransferMoneyRequest request);
    TransferMoneyResponse toTransferMoneyResponse(TransferMoney transferMoney);
    AuthWithdrawalOrderResponse toAuthWithdrawalOrderResponse(TransferMoney transferMoney);

}
