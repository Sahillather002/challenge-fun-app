package com.fitbattle.springboot.controller;

import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AppController {
    @GetMapping({"/health", "/api/v1/health"})
    public Map<String, String> health() {
        return Map.of("status", "ok", "service", "springboot-fitbattle");
    }
}
