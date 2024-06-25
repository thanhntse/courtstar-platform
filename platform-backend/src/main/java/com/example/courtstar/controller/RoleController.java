package com.example.courtstar.controller;

import com.example.courtstar.dto.request.ApiResponse;
import com.example.courtstar.dto.request.RoleRequest;
import com.example.courtstar.dto.request.UpdateRoleRequest;
import com.example.courtstar.dto.response.RoleResponse;
import com.example.courtstar.mapper.RoleMapper;
import com.example.courtstar.services.RoleService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/roles")
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@RequiredArgsConstructor
public class RoleController {
    RoleService roleService;
    RoleMapper roleMapper;

    @PostMapping
    public ApiResponse<RoleResponse> createRole(@RequestBody RoleRequest request) {
        return ApiResponse.<RoleResponse>builder()
                .code(1000)
                .message("create role success")
                .data(roleService.createRole(request))
                .build();
    }

    @GetMapping
    public ApiResponse<List<RoleResponse>> getRole() {
        return ApiResponse.<List<RoleResponse>>builder()
                .code(1000)
                .message("get role success")
                .data(roleService.getAllRoles())
                .build();
    }

    @PutMapping("/{name}")
    public ApiResponse<RoleResponse> updateRole(@PathVariable String name, @RequestBody UpdateRoleRequest request) {
        return ApiResponse.<RoleResponse>builder().data(roleService.updateRole(name,request)).build();
    }

}
