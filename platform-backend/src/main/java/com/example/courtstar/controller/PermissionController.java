package com.example.courtstar.controller;

import com.example.courtstar.dto.request.ApiResponse;
import com.example.courtstar.dto.request.PermissionRequest;
import com.example.courtstar.dto.response.PermissionResponse;
import com.example.courtstar.services.PermissionService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = {"http://localhost:3000", "https://courtstar-platform-frontend.vercel.app/"})
@RestController
@RequestMapping("/Permissions")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class PermissionController {
    PermissionService permissionService;

    @PostMapping
    public ApiResponse<PermissionResponse> addPermission(@RequestBody PermissionRequest request) {
        return ApiResponse.<PermissionResponse>builder()
                .code(1000)
                .message("success")
                .data(permissionService.Create(request))
                .build();
    }
    @GetMapping
    public ApiResponse<List<PermissionResponse>> getPermissions() {
        return  ApiResponse.<List<PermissionResponse>>builder()
                .code(1000)
                .message("success")
                .data(permissionService.GetAll())
                .build();
    }
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deletePermission(@PathVariable String id) {
        permissionService.delete(id);
        return ApiResponse.<Void>builder()
                .code(1000)
                .message("delete success")
                .build();
    }
}
