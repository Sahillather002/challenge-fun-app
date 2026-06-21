package com.fitbattle.springboot.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateCompetitionRequest(
        @NotBlank String title,
        String description,
        String type,
        String metric,
        String startTime,
        String endTime,
        Integer prizePool,
        Integer entryFee,
        Integer durationHours,
        String category,
        String[] rules
) {}
