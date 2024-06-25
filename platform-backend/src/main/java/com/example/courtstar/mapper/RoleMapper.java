package com.example.courtstar.mapper;

import com.example.courtstar.dto.request.RoleRequest;
import com.example.courtstar.dto.request.UpdateRoleRequest;
import com.example.courtstar.dto.response.RoleResponse;
import com.example.courtstar.entity.Role;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface RoleMapper {
    @Mapping(target = "permissions", ignore = true)
    Role toRole(RoleRequest request);
    RoleResponse  toRoleResponse(Role role);
}
