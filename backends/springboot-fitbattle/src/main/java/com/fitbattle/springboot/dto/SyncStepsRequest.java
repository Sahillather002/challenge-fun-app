package com.fitbattle.springboot.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

public record SyncStepsRequest(
        @NotBlank String date,
        @Min(0) Long steps,
        Long distanceM,
        Integer calories,
        Integer activeMinutes,
        Integer reps,
        String source,
        String deviceId,
        String idempotencyKey,
        String competitionId,
        String clientTimestamp
) {}
