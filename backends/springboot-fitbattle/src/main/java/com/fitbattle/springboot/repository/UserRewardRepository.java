package com.fitbattle.springboot.repository;

import com.fitbattle.springboot.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UserRewardRepository extends JpaRepository<UserRewardEntity, String> {
    List<UserRewardEntity> findByUserIdOrderByCreatedAtDesc(String userId);
}
