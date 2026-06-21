package com.fitbattle.springboot.service;

import com.fitbattle.springboot.entity.*;
import com.fitbattle.springboot.repository.*;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class AchievementService {
    private final AchievementRepository achievementRepository;
    private final UserAchievementRepository userAchievementRepository;

    public AchievementService(AchievementRepository achievementRepository,
                              UserAchievementRepository userAchievementRepository) {
        this.achievementRepository = achievementRepository;
        this.userAchievementRepository = userAchievementRepository;
    }

    public List<Map<String, Object>> all() {
        return achievementRepository.findAllByOrderByIdAsc().stream().map(this::achievement).toList();
    }

    public List<Map<String, Object>> mine(String userId) {
        return userAchievementRepository.findByUserIdOrderByUnlockedAtDesc(userId).stream()
            .map(ResponseMapper::achievement)
            .toList();
    }

    private Map<String, Object> achievement(AchievementEntity entity) {
        return Map.of(
            "id", entity.getId(),
            "key", entity.getKey(),
            "title", entity.getTitle(),
            "description", entity.getDescription(),
            "icon", entity.getIcon(),
            "xpReward", entity.getXpReward(),
            "coinReward", entity.getCoinReward());
    }
}
