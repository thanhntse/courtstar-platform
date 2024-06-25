package com.example.courtstar.mapper;

import com.example.courtstar.dto.request.TranferMoneyRequest;
import com.example.courtstar.dto.response.AuthWithdrawalOrderResponse;
import com.example.courtstar.dto.response.TranferMoneyReponse;
import com.example.courtstar.entity.TransferMoney;
import org.mapstruct.Mapper;
@Mapper(componentModel = "spring")
public interface TransferMoneyMapper {
    TransferMoney toTransferMoney(TranferMoneyRequest request);
    TranferMoneyReponse toTranferMoneyReponse(TransferMoney transferMoney);
    AuthWithdrawalOrderResponse toAuthWithdrawalOrderResponse(TransferMoney transferMoney);

}
