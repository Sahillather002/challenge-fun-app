package com.fitbattle.springboot;

import com.fitbattle.springboot.dto.ApiResponse;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertTrue;

class ApiResponseTest {
    @Test
    void okResponseIsSuccessful() {
        ApiResponse<String> response = ApiResponse.ok("data");
        assertTrue(response.success());
    }
}
