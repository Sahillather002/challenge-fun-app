package com.fitbattle.springboot.controller;

import com.fitbattle.springboot.dto.ApiResponse;
import com.fitbattle.springboot.security.AuthenticatedUser;
import com.fitbattle.springboot.service.AchievementService;
import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/achievements")
public class AchievementController {
    private final AchievementService achievementService;

    public AchievementController(AchievementService achievementService) {
        this.achievementService = achievementService;
    }

    @GetMapping
    public ApiResponse<List<Map<String, Object>>> list() {
        return ApiResponse.ok(achievementService.all());
    }

    @GetMapping("/me")
    public ApiResponse<List<Map<String, Object>>> mine(AuthenticatedUser user) {
        return ApiResponse.ok(achievementService.mine(user.id()));
    }
}
