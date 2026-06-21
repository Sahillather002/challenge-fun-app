package com.fitbattle.springboot.repository;

import com.fitbattle.springboot.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RewardRepository extends JpaRepository<RewardEntity, String> {
    List<RewardEntity> findByAvailableTrue();
}
