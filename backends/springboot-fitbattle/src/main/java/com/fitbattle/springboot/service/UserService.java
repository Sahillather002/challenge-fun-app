package com.fitbattle.springboot.service;

import com.fitbattle.springboot.dto.UpdateProfileRequest;
import com.fitbattle.springboot.entity.UserEntity;
import com.fitbattle.springboot.repository.UserRepository;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final HealthSyncService healthSyncService;

    public UserService(UserRepository userRepository, HealthSyncService healthSyncService) {
        this.userRepository = userRepository;
        this.healthSyncService = healthSyncService;
    }

    public Map<String, Object> profile(String userId) {
        return ResponseMapper.user(userRepository.findById(userId).orElseThrow());
    }

    public Map<String, Object> update(String userId, UpdateProfileRequest request) {
        UserEntity user = userRepository.findById(userId).orElseThrow();
        if (request.name() != null) user.setName(request.name());
        if (request.username() != null) user.setUsername(request.username());
        if (request.bio() != null) user.setBio(request.bio());
        if (request.avatar() != null) user.setAvatar(request.avatar());
        return ResponseMapper.user(userRepository.save(user));
    }

    public Map<String, Object> stats(String userId) {
        return healthSyncService.getDashboardStats(userId);
    }
}
