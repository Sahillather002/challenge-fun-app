package com.fitbattle.springboot.controller;

import com.fitbattle.springboot.dto.*;
import com.fitbattle.springboot.security.AuthenticatedUser;
import com.fitbattle.springboot.service.HealthSyncService;
import jakarta.validation.Valid;
import java.util.Map;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/health")
public class HealthController {
    private final HealthSyncService healthSyncService;

    public HealthController(HealthSyncService healthSyncService) {
        this.healthSyncService = healthSyncService;
    }

    @GetMapping("/data")
    public ApiResponse<Map<String, Object>> getHealthData(AuthenticatedUser user, @RequestParam(required = false) String date) {
        return ApiResponse.ok(healthSyncService.getHealthData(user.id(), date));
    }

    @PostMapping("/steps")
    public ApiResponse<Map<String, Object>> syncSteps(AuthenticatedUser user, @Valid @RequestBody SyncStepsRequest request) {
        return ApiResponse.ok(healthSyncService.syncSteps(user.id(), request));
    }

    @GetMapping("/water")
    public ApiResponse<Map<String, Object>> getWaterIntake(AuthenticatedUser user, @RequestParam(required = false) String date) {
        return ApiResponse.ok(healthSyncService.getWaterIntake(user.id(), date));
    }

    @PostMapping("/water")
    public ApiResponse<Map<String, Object>> syncWater(AuthenticatedUser user, @Valid @RequestBody SyncWaterRequest request) {
        return ApiResponse.ok(healthSyncService.syncWater(user.id(), request));
    }

    @PostMapping("/workout")
    public ApiResponse<Map<String, Object>> syncWorkout(AuthenticatedUser user, @Valid @RequestBody SyncWorkoutRequest request) {
        return ApiResponse.ok(healthSyncService.syncWorkout(user.id(), request));
    }

    @GetMapping("/analytics/dashboard")
    public ApiResponse<Map<String, Object>> dashboard(AuthenticatedUser user) {
        return ApiResponse.ok(healthSyncService.getDashboardStats(user.id()));
    }

    @GetMapping("/analytics/weekly")
    public ApiResponse<?> weekly(AuthenticatedUser user) {
        return ApiResponse.ok(healthSyncService.getWeeklyActivity(user.id()));
    }

    @GetMapping("/analytics/transactions")
    public ApiResponse<?> transactions(AuthenticatedUser user) {
        return ApiResponse.ok(healthSyncService.getTransactions(user.id()));
    }

    @GetMapping("/weekly")
    public ApiResponse<?> weeklyLegacy(AuthenticatedUser user) {
        return ApiResponse.ok(healthSyncService.getWeeklyActivity(user.id()));
    }

    @GetMapping("/device-session")
    public ApiResponse<Map<String, Object>> deviceSession(AuthenticatedUser user,
                                                          @RequestParam(required = false) String deviceName,
                                                          @RequestParam(required = false) String platform) {
        return ApiResponse.ok(healthSyncService.registerDeviceSession(user.id(), deviceName, platform));
    }
}
