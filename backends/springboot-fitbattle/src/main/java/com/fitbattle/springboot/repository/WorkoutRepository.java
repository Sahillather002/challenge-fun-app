package com.fitbattle.springboot.repository;

import com.fitbattle.springboot.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface WorkoutRepository extends JpaRepository<WorkoutEntity, String> {
    List<WorkoutEntity> findByUserIdOrderByCreatedAtDesc(String userId);
    long countByUserId(String userId);
}
