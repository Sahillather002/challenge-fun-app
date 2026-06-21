package com.fitbattle.springboot.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record SyncWaterRequest(
        @NotBlank String date,
        @Min(0) Integer amount,
        String source,
        String deviceId,
        String idempotencyKey
) {}
