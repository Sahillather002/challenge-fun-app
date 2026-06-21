package com.fitbattle.springboot.controller;

import com.fitbattle.springboot.dto.*;
import com.fitbattle.springboot.security.AuthenticatedUser;
import com.fitbattle.springboot.service.SnapService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/snap")
public class SnapController {
    private final SnapService snapService;

    public SnapController(SnapService snapService) {
        this.snapService = snapService;
    }

    @GetMapping("/stories")
    public ApiResponse<List<Map<String, Object>>> stories() {
        return ApiResponse.ok(snapService.stories());
    }

    @PostMapping("/story")
    public ApiResponse<Map<String, Object>> createStory(AuthenticatedUser user, @Valid @RequestBody CreateStoryRequest request) {
        return ApiResponse.ok(snapService.createStory(user.id(), request));
    }

    @GetMapping("/inbox")
    public ApiResponse<List<Map<String, Object>>> inbox(AuthenticatedUser user) {
        return ApiResponse.ok(snapService.inbox(user.id()));
    }

    @PostMapping("/send")
    public ApiResponse<Map<String, Object>> send(AuthenticatedUser user, @Valid @RequestBody SendSnapRequest request) {
        return ApiResponse.ok(snapService.send(user.id(), request));
    }

    @PutMapping("/{id}/view")
    public ApiResponse<Map<String, Object>> markViewed(@PathVariable String id) {
        snapService.markViewed(id);
        return ApiResponse.ok(Map.of("viewed", true));
    }
}
