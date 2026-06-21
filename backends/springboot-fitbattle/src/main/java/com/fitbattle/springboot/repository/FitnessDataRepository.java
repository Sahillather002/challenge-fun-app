package com.fitbattle.springboot.repository;

import com.fitbattle.springboot.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface FitnessDataRepository extends JpaRepository<FitnessDataEntity, String> {
    List<FitnessDataEntity> findByUserIdAndDate(String userId, LocalDate date);
    List<FitnessDataEntity> findByUserIdAndDateBetween(String userId, LocalDate start, LocalDate end);
    Optional<FitnessDataEntity> findByUserIdAndCompetitionIdAndDateAndSourceAndIdempotencyKey(
            String userId, String competitionId, LocalDate date, String source, String idempotencyKey);
}
