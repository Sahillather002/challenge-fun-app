package com.fitbattle.springboot.controller;

import com.fitbattle.springboot.dto.*;
import com.fitbattle.springboot.security.AuthenticatedUser;
import com.fitbattle.springboot.service.CompetitionService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/competitions")
public class CompetitionController {
    private final CompetitionService competitionService;

    public CompetitionController(CompetitionService competitionService) {
        this.competitionService = competitionService;
    }

    @GetMapping
    public ApiResponse<List<Map<String, Object>>> list() {
        return ApiResponse.ok(competitionService.list());
    }

    @GetMapping("/{id}")
    public ApiResponse<Map<String, Object>> get(@PathVariable String id) {
        return ApiResponse.ok(competitionService.get(id));
    }

    @PostMapping
    public ApiResponse<Map<String, Object>> create(AuthenticatedUser user, @Valid @RequestBody CreateCompetitionRequest request) {
        return ApiResponse.ok(competitionService.create(request));
    }

    @PostMapping("/{id}/join")
    public ApiResponse<Map<String, Object>> join(AuthenticatedUser user, @PathVariable String id) {
        return ApiResponse.ok(competitionService.join(id, user.id()));
    }

    @GetMapping("/{id}/leaderboard")
    public ApiResponse<List<Map<String, Object>>> leaderboard(@PathVariable String id) {
        return ApiResponse.ok(competitionService.leaderboard(id));
    }
}
