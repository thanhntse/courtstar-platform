package com.example.courtstar.mapper;

import com.example.courtstar.dto.request.CourtRequest;
import com.example.courtstar.dto.response.CourtResponse;
import com.example.courtstar.entity.Court;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface CourtMapper {
    Court toCourt(CourtRequest request);
    CourtResponse toCourtResponse(Court court);
    void UpdateCourt(@MappingTarget Court court, CourtRequest request);
}
