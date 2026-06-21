package com.fitbattle.springboot.repository;

import com.fitbattle.springboot.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CompetitionRepository extends JpaRepository<CompetitionEntity, String> {
    List<CompetitionEntity> findByStatusOrderByStartTimeAsc(CompetitionStatus status);
    Optional<CompetitionEntity> findById(String id);
}
