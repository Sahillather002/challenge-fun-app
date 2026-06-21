package com.fitbattle.springboot.controller;

import com.fitbattle.springboot.dto.ApiResponse;
import com.fitbattle.springboot.security.AuthenticatedUser;
import com.fitbattle.springboot.service.NotificationService;
import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/notifications")
public class NotificationController {
    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public ApiResponse<List<Map<String, Object>>> list(AuthenticatedUser user) {
        return ApiResponse.ok(notificationService.list(user.id()));
    }

    @PutMapping("/{id}/read")
    public ApiResponse<Long> markRead(AuthenticatedUser user, @PathVariable String id) {
        return ApiResponse.ok(notificationService.markRead(user.id(), id));
    }

    @PutMapping("/read-all")
    public ApiResponse<Long> markAllRead(AuthenticatedUser user) {
        return ApiResponse.ok(notificationService.markAllRead(user.id()));
    }
}
