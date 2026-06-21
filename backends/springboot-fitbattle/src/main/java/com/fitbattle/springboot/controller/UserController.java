package com.fitbattle.springboot.controller;

import com.fitbattle.springboot.dto.*;
import com.fitbattle.springboot.security.AuthenticatedUser;
import com.fitbattle.springboot.service.UserService;
import jakarta.validation.Valid;
import java.util.Map;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/user")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public ApiResponse<Map<String, Object>> profile(AuthenticatedUser user) {
        return ApiResponse.ok(userService.profile(user.id()));
    }

    @PutMapping("/profile")
    public ApiResponse<Map<String, Object>> update(AuthenticatedUser user, @Valid @RequestBody UpdateProfileRequest request) {
        return ApiResponse.ok(userService.update(user.id(), request));
    }

    @GetMapping("/stats")
    public ApiResponse<Map<String, Object>> stats(AuthenticatedUser user) {
        return ApiResponse.ok(userService.stats(user.id()));
    }

    @GetMapping("/{id}")
    public ApiResponse<Map<String, Object>> get(@PathVariable String id) {
        return ApiResponse.ok(userService.profile(id));
    }
}
