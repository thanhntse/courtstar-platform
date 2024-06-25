package com.example.courtstar.mapper;

import com.example.courtstar.dto.request.PermissionRequest;
import com.example.courtstar.dto.response.PermissionResponse;
import com.example.courtstar.entity.Permission;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PermissionMapper {
    Permission toPermission(PermissionRequest request);
    PermissionResponse toPermissionResponse(Permission permission);
}
