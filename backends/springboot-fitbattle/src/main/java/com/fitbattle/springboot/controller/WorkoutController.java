package com.fitbattle.springboot.controller;

import com.fitbattle.springboot.dto.*;
import com.fitbattle.springboot.security.AuthenticatedUser;
import com.fitbattle.springboot.service.WorkoutService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/workouts")
public class WorkoutController {
    private final WorkoutService workoutService;

    public WorkoutController(WorkoutService workoutService) {
        this.workoutService = workoutService;
    }

    @GetMapping
    public ApiResponse<List<Map<String, Object>>> list(AuthenticatedUser user) {
        return ApiResponse.ok(workoutService.list(user.id()));
    }

    @PostMapping
    public ApiResponse<Map<String, Object>> create(AuthenticatedUser user, @Valid @RequestBody CreateWorkoutRequest request) {
        return ApiResponse.ok(workoutService.create(user.id(), request));
    }

    @GetMapping("/{id}")
    public ApiResponse<Map<String, Object>> get(@PathVariable String id) {
        return ApiResponse.ok(Map.of("id", id));
    }

    @GetMapping("/history")
    public ApiResponse<List<Map<String, Object>>> history(AuthenticatedUser user) {
        return ApiResponse.ok(workoutService.list(user.id()));
    }
}
