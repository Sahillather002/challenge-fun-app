package com.fitbattle.springboot.repository;

import com.fitbattle.springboot.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UserAchievementRepository extends JpaRepository<UserAchievementEntity, String> {
    List<UserAchievementEntity> findByUserIdOrderByUnlockedAtDesc(String userId);
}
