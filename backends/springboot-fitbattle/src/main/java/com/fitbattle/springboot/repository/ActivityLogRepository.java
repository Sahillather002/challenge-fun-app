package com.fitbattle.springboot.repository;

import com.fitbattle.springboot.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.Instant;
import java.util.List;

public interface ActivityLogRepository extends JpaRepository<ActivityLogEntity, String> {
    List<ActivityLogEntity> findByUserIdAndCreatedAtBetween(String userId, Instant start, Instant end);
    List<ActivityLogEntity> findByUserIdAndTypeAndCreatedAtBetween(String userId, String type, Instant start, Instant end);
}
