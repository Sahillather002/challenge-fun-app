package com.fitbattle.springboot.service;

import com.fitbattle.springboot.dto.*;
import com.fitbattle.springboot.entity.*;
import com.fitbattle.springboot.repository.*;
import java.time.*;
import java.util.*;
import org.springframework.stereotype.Service;

@Service
public class CompetitionService {
    private final CompetitionRepository competitionRepository;
    private final CompetitionParticipantRepository competitionParticipantRepository;
    private final HealthSyncService healthSyncService;

    public CompetitionService(CompetitionRepository competitionRepository,
                              CompetitionParticipantRepository competitionParticipantRepository,
                              HealthSyncService healthSyncService) {
        this.competitionRepository = competitionRepository;
        this.competitionParticipantRepository = competitionParticipantRepository;
        this.healthSyncService = healthSyncService;
    }

    public List<Map<String, Object>> list() {
        return competitionRepository.findAll().stream()
            .map(competition -> ResponseMapper.competition(competition, competitionParticipantRepository.countByCompetitionId(competition.getId())))
            .toList();
    }

    public Map<String, Object> get(String id) {
        CompetitionEntity competition = competitionRepository.findById(id)
            .orElseThrow(() -> new NoSuchElementException("Competition not found"));
        return ResponseMapper.competition(competition, competitionParticipantRepository.countByCompetitionId(competition.getId()));
    }

    public Map<String, Object> create(CreateCompetitionRequest request) {
        int hours = request.durationHours() == null ? 24 : request.durationHours();
        CompetitionEntity competition = new CompetitionEntity();
        competition.setId(UUID.randomUUID().toString());
        competition.setTitle(request.title());
        competition.setDescription(request.description());
        competition.setType(parseType(request.type()));
        competition.setMetric(parseMetric(request.metric(), request.category()));
        competition.setStatus(CompetitionStatus.LIVE);
        competition.setStartTime(parseInstant(request.startTime(), Instant.now()));
        competition.setEndTime(parseInstant(request.endTime(), Instant.now().plus(hours, ChronoUnit.HOURS)));
        competition.setPrizePool(request.prizePool());
        competition.setEntryFee(request.entryFee());
        competition.setRules(Arrays.toString(request.rules() == null ? new String[0] : request.rules()));
        competition.setCreatedAt(Instant.now());
        competition.setUpdatedAt(Instant.now());
        return ResponseMapper.competition(competitionRepository.save(competition), 0);
    }

    public Map<String, Object> join(String competitionId, String userId) {
        CompetitionEntity competition = competitionRepository.findById(competitionId)
            .orElseThrow(() -> new NoSuchElementException("Competition not found"));
        if (competitionParticipantRepository.findByUserIdAndCompetitionId(userId, competitionId).isPresent()) {
            throw new IllegalStateException("Already joined");
        }
        CompetitionParticipantEntity participant = new CompetitionParticipantEntity();
        participant.setId(UUID.randomUUID().toString());
        participant.setUserId(userId);
        participant.setCompetitionId(competitionId);
        participant.setScore(0L);
        participant.setJoinedAt(Instant.now());
        competitionParticipantRepository.save(participant);
        healthSyncService.refreshLeaderboard(competitionId);
        return Map.of("joined", true, "competitionId", competitionId);
    }

    public List<Map<String, Object>> leaderboard(String competitionId) {
        healthSyncService.refreshLeaderboard(competitionId);
        return healthSyncService.getCompetitionLeaderboard(competitionId);
    }

    private CompetitionType parseType(String type) {
        if (type == null) return CompetitionType.GLOBAL;
        return CompetitionType.valueOf(type);
    }

    private CompetitionMetric parseMetric(String metric, String category) {
        if (metric != null) return CompetitionMetric.valueOf(metric);
        if (category == null) return CompetitionMetric.STEPS;
        String normalized = category.toUpperCase();
        if ("CARDIO".equals(normalized)) return CompetitionMetric.DISTANCE;
        if ("ENDURANCE".equals(normalized)) return CompetitionMetric.ACTIVE_MINUTES;
        if ("STRENGTH".equals(normalized)) return CompetitionMetric.REPS;
        return CompetitionMetric.STEPS;
    }

    private Instant parseInstant(String value, Instant fallback) {
        if (value == null || value.isBlank()) return fallback;
        return Instant.parse(value);
    }
}
