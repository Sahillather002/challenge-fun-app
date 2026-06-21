package com.fitbattle.springboot.repository;

import com.fitbattle.springboot.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CompetitionParticipantRepository extends JpaRepository<CompetitionParticipantEntity, String> {
    List<CompetitionParticipantEntity> findByCompetitionId(String competitionId);
    Optional<CompetitionParticipantEntity> findByUserIdAndCompetitionId(String userId, String competitionId);
    long countByCompetitionId(String competitionId);
    long countByUserIdAndRank(String userId, Integer rank);
}
