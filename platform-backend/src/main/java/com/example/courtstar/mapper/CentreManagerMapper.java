package com.example.courtstar.mapper;

import com.example.courtstar.dto.request.CentreManagerRequest;
import com.example.courtstar.entity.CentreManager;
import org.apache.catalina.User;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface CentreManagerMapper {
    CentreManager toCentreManager(CentreManagerRequest request);
    void updateCentre(@MappingTarget CentreManager centreManager,CentreManagerRequest centreManagerRequest);
}
