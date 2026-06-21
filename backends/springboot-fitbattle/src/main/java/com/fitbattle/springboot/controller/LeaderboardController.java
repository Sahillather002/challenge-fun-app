package com.fitbattle.springboot.controller;

import com.fitbattle.springboot.dto.ApiResponse;
import com.fitbattle.springboot.security.AuthenticatedUser;
import com.fitbattle.springboot.service.LeaderboardService;
import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/leaderboard")
public class LeaderboardController {
    private final LeaderboardService leaderboardService;

    public LeaderboardController(LeaderboardService leaderboardService) {
        this.leaderboardService = leaderboardService;
    }

    @GetMapping("/{scope}")
    public ApiResponse<List<Map<String, Object>>> get(AuthenticatedUser user, @PathVariable String scope) {
        return ApiResponse.ok(leaderboardService.get(scope, user.id()));
    }
}
