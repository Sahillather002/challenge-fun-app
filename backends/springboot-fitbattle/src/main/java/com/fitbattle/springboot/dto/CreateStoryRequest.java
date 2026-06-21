package com.fitbattle.springboot.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateStoryRequest(
        @NotBlank String mediaUrl,
        @NotBlank String mediaType,
        String caption
) {}
