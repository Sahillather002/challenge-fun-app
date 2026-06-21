package com.fitbattle.springboot.dto;

import jakarta.validation.constraints.NotBlank;

public record SendSnapRequest(
        @NotBlank String receiverId,
        @NotBlank String mediaUrl,
        @NotBlank String mediaType
) {}
