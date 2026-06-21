package com.fitbattle.springboot.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateWorkoutRequest(
        String competitionId,
        @NotBlank String exerciseType,
        Integer reps,
        Integer duration,
        Integer calories,
        String videoUrl
) {}
