package com.fitbattle.springboot.dto;

import jakarta.validation.constraints.NotBlank;

public record SyncWorkoutRequest(
        String competitionId,
        @NotBlank String title,
        @NotBlank String type,
        Integer durationMinutes,
        Long steps,
        Integer calories,
        Integer reps,
        String source,
        String mediaUrl,
        String idempotencyKey
) {}
