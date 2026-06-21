package com.fitbattle.springboot.repository;

import com.fitbattle.springboot.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LeaderboardEntryRepository extends JpaRepository<LeaderboardEntryEntity, String> {
    List<LeaderboardEntryEntity> findByCompetitionIdOrderByRankAsc(String competitionId);
    List<LeaderboardEntryEntity> findAllByOrderByRankAsc();
}
