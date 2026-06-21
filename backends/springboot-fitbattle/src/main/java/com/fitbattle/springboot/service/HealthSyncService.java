package com.fitbattle.springboot.service;

import com.fitbattle.springboot.dto.*;
import com.fitbattle.springboot.entity.*;
import com.fitbattle.springboot.repository.*;
import java.math.BigDecimal;
import java.time.*;
import java.util.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class HealthSyncService {
    private final FitnessDataRepository fitnessDataRepository;
    private final ActivityLogRepository activityLogRepository;
    private final LeaderboardEntryRepository leaderboardEntryRepository;
    private final CompetitionParticipantRepository competitionParticipantRepository;
    private final UserRepository userRepository;
    private final WorkoutRepository workoutRepository;
    private final SyncJobRepository syncJobRepository;
    private final NotificationRepository notificationRepository;
    private final DeviceSessionRepository deviceSessionRepository;
    private final TransactionRepository transactionRepository;

    public HealthSyncService(
            FitnessDataRepository fitnessDataRepository,
            ActivityLogRepository activityLogRepository,
            LeaderboardEntryRepository leaderboardEntryRepository,
            CompetitionParticipantRepository competitionParticipantRepository,
            UserRepository userRepository,
            WorkoutRepository workoutRepository,
            SyncJobRepository syncJobRepository,
            NotificationRepository notificationRepository,
            DeviceSessionRepository deviceSessionRepository,
            TransactionRepository transactionRepository) {
        this.fitnessDataRepository = fitnessDataRepository;
        this.activityLogRepository = activityLogRepository;
        this.leaderboardEntryRepository = leaderboardEntryRepository;
        this.competitionParticipantRepository = competitionParticipantRepository;
        this.userRepository = userRepository;
        this.workoutRepository = workoutRepository;
        this.syncJobRepository = syncJobRepository;
        this.notificationRepository = notificationRepository;
        this.deviceSessionRepository = deviceSessionRepository;
        this.transactionRepository = transactionRepository;
    }

    public Map<String, Object> getHealthData(String userId, String dateValue) {
        LocalDate date = dateValue == null ? LocalDate.now() : LocalDate.parse(dateValue);
        List<FitnessDataEntity> fitnessData = fitnessDataRepository.findByUserIdAndDate(userId, date);
        Instant start = date.atStartOfDay(ZoneOffset.UTC).toInstant();
        Instant end = date.plusDays(1).atStartOfDay(ZoneOffset.UTC).toInstant();
        List<ActivityLogEntity> activityLogs = activityLogRepository.findByUserIdAndCreatedAtBetween(userId, start, end);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("date", date.toString());
        response.put("steps", sumLong(fitnessData, FitnessDataEntity::getSteps));
        response.put("distanceM", sumDecimal(fitnessData, FitnessDataEntity::getDistanceM));
        response.put("calories", sumInt(fitnessData, FitnessDataEntity::getCalories));
        response.put("activeMinutes", sumInt(fitnessData, FitnessDataEntity::getActiveMinutes));
        response.put("reps", sumInt(fitnessData, FitnessDataEntity::getReps));
        response.put("workoutScore", sumLong(fitnessData, FitnessDataEntity::getWorkoutScore));
        response.put("waterMl", activityLogs.stream().filter(log -> "WATER".equals(log.getType())).mapToInt(ActivityLogEntity::getDurationMinutes).sum());
        response.put("fitnessData", fitnessData.stream().map(ResponseMapper::fitnessData).toList());
        response.put("activityLogs", activityLogs.stream().map(ResponseMapper::activityLog).toList());
        return response;
    }

    public Map<String, Object> getWaterIntake(String userId, String dateValue) {
        LocalDate date = dateValue == null ? LocalDate.now() : LocalDate.parse(dateValue);
        Instant start = date.atStartOfDay(ZoneOffset.UTC).toInstant();
        Instant end = date.plusDays(1).atStartOfDay(ZoneOffset.UTC).toInstant();
        List<ActivityLogEntity> logs = activityLogRepository.findByUserIdAndTypeAndCreatedAtBetween(userId, "WATER", start, end);
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("date", date.toString());
        response.put("waterMl", logs.stream().mapToInt(ActivityLogEntity::getDurationMinutes).sum());
        response.put("logs", logs.stream().map(ResponseMapper::activityLog).toList());
        return response;
    }

    @Transactional
    public Map<String, Object> syncSteps(String userId, SyncStepsRequest request) {
        LocalDate date = LocalDate.parse(request.date());
        String source = value(request.source(), "mobile");
        String idempotencyKey = value(request.idempotencyKey(), date + ":steps:" + value(request.deviceId(), "device"));
        long workoutScore = calculateWorkoutScore(request.steps(), request.calories(), request.activeMinutes(), request.reps());
        createSyncJob(userId, "steps.sync", request, request.deviceId(), idempotencyKey);

        FitnessDataEntity entity = fitnessDataRepository
            .findByUserIdAndCompetitionIdAndDateAndSourceAndIdempotencyKey(
                userId, request.competitionId(), date, source, idempotencyKey)
            .orElseGet(() -> {
                FitnessDataEntity created = new FitnessDataEntity();
                created.setId(UUID.randomUUID().toString());
                created.setUserId(userId);
                created.setCompetitionId(request.competitionId());
                created.setDate(date);
                created.setSource(source);
                created.setIdempotencyKey(idempotencyKey);
                created.setSyncedAt(Instant.now());
                created.setCreatedAt(Instant.now());
                return created;
            });
        entity.setSteps(request.steps());
        entity.setDistanceM(BigDecimal.valueOf(request.distanceM() == null ? 0 : request.distanceM()));
        entity.setCalories(request.calories() == null ? 0 : request.calories());
        entity.setActiveMinutes(request.activeMinutes() == null ? 0 : request.activeMinutes());
        entity.setReps(request.reps() == null ? 0 : request.reps());
        entity.setWorkoutScore(workoutScore);
        entity.setDeviceId(request.deviceId());
        entity.setSyncedAt(Instant.now());
        fitnessDataRepository.save(entity);

        ActivityLogEntity log = new ActivityLogEntity();
        log.setId(UUID.randomUUID().toString());
        log.setUserId(userId);
        log.setCompetitionId(request.competitionId());
        log.setTitle("Daily step sync");
        log.setType("STEPS");
        log.setSteps(request.steps());
        log.setDistanceM(BigDecimal.valueOf(request.distanceM() == null ? 0 : request.distanceM()));
        log.setCalories(request.calories() == null ? 0 : request.calories());
        log.setDurationMinutes(request.activeMinutes() == null ? 0 : request.activeMinutes());
        log.setReps(request.reps() == null ? 0 : request.reps());
        log.setSource(source);
        log.setCreatedAt(Instant.now());
        activityLogRepository.save(log);

        if (request.competitionId() != null) {
            refreshLeaderboard(request.competitionId());
            createNotification(userId, NotificationType.SYNC, "Steps synced", request.steps() + " steps were added for " + date, "View competition", "/competitions/" + request.competitionId());
        }

        return getHealthData(userId, date.toString());
    }

    @Transactional
    public Map<String, Object> syncWater(String userId, SyncWaterRequest request) {
        String source = value(request.source(), "mobile");
        String idempotencyKey = value(request.idempotencyKey(), request.date() + ":water:" + value(request.deviceId(), "device"));
        createSyncJob(userId, "water.sync", request, request.deviceId(), idempotencyKey);
        ActivityLogEntity log = new ActivityLogEntity();
        log.setId(UUID.randomUUID().toString());
        log.setUserId(userId);
        log.setTitle("Water intake");
        log.setType("WATER");
        log.setDurationMinutes(request.amount());
        log.setSource(source);
        log.setCreatedAt(Instant.now());
        activityLogRepository.save(log);
        return getWaterIntake(userId, request.date());
    }

    @Transactional
    public Map<String, Object> syncWorkout(String userId, SyncWorkoutRequest request) {
        long workoutScore = calculateWorkoutScore(
                request.steps() == null ? 0L : request.steps(),
                request.calories() == null ? 0 : request.calories(),
                request.durationMinutes() == null ? 0 : request.durationMinutes(),
                request.reps() == null ? 0 : request.reps());

        WorkoutEntity workout = new WorkoutEntity();
        workout.setId(UUID.randomUUID().toString());
        workout.setUserId(userId);
        workout.setCompetitionId(request.competitionId());
        workout.setExerciseType(request.type());
        workout.setDuration(request.durationMinutes() == null ? null : request.durationMinutes() * 60);
        workout.setCalories(request.calories());
        workout.setReps(request.reps());
        workout.setVideoUrl(request.mediaUrl());
        workout.setXpEarned((int) workoutScore);
        workout.setCoinsEarned((int) (workoutScore / 10));
        workout.setCreatedAt(Instant.now());
        workoutRepository.save(workout);

        ActivityLogEntity log = new ActivityLogEntity();
        log.setId(UUID.randomUUID().toString());
        log.setUserId(userId);
        log.setCompetitionId(request.competitionId());
        log.setTitle(request.title());
        log.setType(request.type());
        log.setSteps(request.steps() == null ? 0L : request.steps());
        log.setCalories(request.calories() == null ? 0 : request.calories());
        log.setDurationMinutes(request.durationMinutes() == null ? 0 : request.durationMinutes());
        log.setReps(request.reps() == null ? 0 : request.reps());
        log.setSource(value(request.source(), "mobile"));
        log.setMediaUrl(request.mediaUrl());
        log.setCreatedAt(Instant.now());
        activityLogRepository.save(log);

        if (request.competitionId() != null) {
            refreshLeaderboard(request.competitionId());
        }
        return ResponseMapper.workout(workout);
    }

    public List<Map<String, Object>> getWeeklyActivity(String userId) {
        LocalDate end = LocalDate.now();
        LocalDate start = end.minusDays(6);
        return fitnessDataRepository.findByUserIdAndDateBetween(userId, start, end).stream()
            .map(ResponseMapper::fitnessData)
            .toList();
    }

    public Map<String, Object> getDashboardStats(String userId) {
        UserEntity user = userRepository.findById(userId).orElse(null);
        long workouts = workoutRepository.countByUserId(userId);
        long competitions = competitionParticipantRepository.findAll().stream().filter(p -> userId.equals(p.getUserId())).count();
        long wins = competitionParticipantRepository.findAll().stream().filter(p -> userId.equals(p.getUserId()) && p.getRank() != null && p.getRank() == 1).count();
        List<Map<String, Object>> weekly = getWeeklyActivity(userId);
        Map<String, Object> latest = weekly.isEmpty() ? Map.of(
                "steps", 0L,
                "calories", 0,
                "activeMinutes", 0,
                "workoutScore", 0L) : weekly.get(weekly.size() - 1);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("level", user == null ? 1 : user.getLevel());
        response.put("xp", user == null ? 0 : user.getXp());
        response.put("coins", user == null ? 0 : user.getCoins());
        response.put("currentStreak", user == null ? 0 : user.getCurrentStreak());
        response.put("longestStreak", user == null ? 0 : user.getLongestStreak());
        response.put("totalWorkouts", workouts);
        response.put("competitionsJoined", competitions);
        response.put("wins", wins);
        response.put("bestRank", wins > 0 ? 1 : null);
        response.put("total_steps", latest.get("steps"));
        response.put("total_calories", latest.get("calories"));
        response.put("active_competitions", competitions);
        response.put("weekly_activity", weekly);
        return response;
    }

    public List<Map<String, Object>> getTransactions(String userId) {
        return transactionRepository.findByUserIdOrderByCreatedAtDesc(userId).stream().map(this::transaction).toList();
    }

    public Map<String, Object> registerDeviceSession(String userId, String deviceName, String platform) {
        String safeDevice = deviceName == null ? "unknown" : deviceName;
        String safePlatform = platform == null ? "unknown" : platform;
        DeviceSessionEntity entity = deviceSessionRepository.findByUserIdAndDeviceNameAndPlatform(userId, safeDevice, safePlatform)
            .orElseGet(() -> {
                DeviceSessionEntity created = new DeviceSessionEntity();
                created.setId(UUID.randomUUID().toString());
                created.setUserId(userId);
                created.setDeviceName(safeDevice);
                created.setPlatform(safePlatform);
                created.setCreatedAt(Instant.now());
                return created;
            });
        entity.setLastSeenAt(Instant.now());
        return ResponseMapper.user(deviceSessionRepository.save(entity));
    }

    public List<Map<String, Object>> getCompetitionLeaderboard(String competitionId) {
        return leaderboardEntryRepository.findByCompetitionIdOrderByRankAsc(competitionId)
            .stream()
            .map(ResponseMapper::leaderboard)
            .toList();
    }

    public void refreshLeaderboard(String competitionId) {
        List<CompetitionParticipantEntity> participants = competitionParticipantRepository.findByCompetitionId(competitionId);
        Map<String, Integer> previousRank = new HashMap<>();
        leaderboardEntryRepository.findByCompetitionIdOrderByRankAsc(competitionId)
            .forEach(entry -> previousRank.put(entry.getUserId(), entry.getRank()));

        List<LeaderboardEntryEntity> entries = new ArrayList<>();
        for (CompetitionParticipantEntity participant : participants) {
            List<FitnessDataEntity> data = fitnessDataRepository.findByUserIdAndDateBetween(participant.getUserId(), LocalDate.now().minusDays(365), LocalDate.now());
            LeaderboardEntryEntity entry = leaderboardEntryRepository.findByCompetitionIdOrderByRankAsc(competitionId).stream()
                .filter(e -> e.getUserId().equals(participant.getUserId()))
                .findFirst()
                .orElseGet(() -> {
                    LeaderboardEntryEntity created = new LeaderboardEntryEntity();
                    created.setId(UUID.randomUUID().toString());
                    created.setUserId(participant.getUserId());
                    created.setCompetitionId(competitionId);
                    return created;
                });
            entry.setScore(sumLong(data, FitnessDataEntity::getWorkoutScore) + sumLong(data, FitnessDataEntity::getSteps));
            entry.setSteps(sumLong(data, FitnessDataEntity::getSteps));
            entry.setDistanceM(sumDecimal(data, FitnessDataEntity::getDistanceM));
            entry.setCalories(sumInt(data, FitnessDataEntity::getCalories));
            entry.setActiveMinutes(sumInt(data, FitnessDataEntity::getActiveMinutes));
            entry.setLastSyncedAt(Instant.now());
            entries.add(entry);
        }
        entries.sort(Comparator.comparingLong(LeaderboardEntryEntity::getScore).reversed());
        for (int i = 0; i < entries.size(); i++) {
            LeaderboardEntryEntity entry = entries.get(i);
            Integer previous = previousRank.get(entry.getUserId());
            entry.setRank(i + 1);
            entry.setMovement(previous == null ? 0 : previous - (i + 1));
            leaderboardEntryRepository.save(entry);
        }
    }

    private void createSyncJob(String userId, String eventType, Object payload, String deviceId, String idempotencyKey) {
        SyncJobEntity job = new SyncJobEntity();
        job.setId(UUID.randomUUID().toString());
        job.setUserId(userId);
        job.setDeviceId(deviceId);
        job.setEventType(eventType);
        job.setPayload(String.valueOf(payload));
        job.setIdempotencyKey(idempotencyKey);
        job.setCreatedAt(Instant.now());
        syncJobRepository.save(job);
    }

    private void createNotification(String userId, NotificationType type, String title, String body, String actionLabel, String actionUrl) {
        NotificationEntity notification = new NotificationEntity();
        notification.setId(UUID.randomUUID().toString());
        notification.setUserId(userId);
        notification.setType(type);
        notification.setTitle(title);
        notification.setBody(body);
        notification.setActionLabel(actionLabel);
        notification.setActionUrl(actionUrl);
        notification.setRead(false);
        notification.setCreatedAt(Instant.now());
        notificationRepository.save(notification);
    }

    private Map<String, Object> transaction(TransactionEntity entity) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", entity.getId());
        map.put("type", entity.getType());
        map.put("amount", entity.getAmount());
        map.put("status", entity.getStatus());
        map.put("description", entity.getDescription());
        map.put("createdAt", entity.getCreatedAt());
        return map;
    }

    private long calculateWorkoutScore(Long steps, Integer calories, Integer activeMinutes, Integer reps) {
        return (steps == null ? 0L : steps) +
                (calories == null ? 0 : calories) * 5L +
                (activeMinutes == null ? 0 : activeMinutes) * 60L +
                (reps == null ? 0 : reps) * 10L;
    }

    private long sumLong(List<? extends FitnessDataEntity> items, java.util.function.Function<FitnessDataEntity, Long> getter) {
        return items.stream().mapToLong(item -> getter.apply(item) == null ? 0L : getter.apply(item)).sum();
    }

    private int sumInt(List<? extends FitnessDataEntity> items, java.util.function.Function<FitnessDataEntity, Integer> getter) {
        return items.stream().mapToInt(item -> getter.apply(item) == null ? 0 : getter.apply(item)).sum();
    }

    private double sumDecimal(List<? extends FitnessDataEntity> items, java.util.function.Function<FitnessDataEntity, BigDecimal> getter) {
        return items.stream().mapToDouble(item -> getter.apply(item) == null ? 0 : getter.apply(item).doubleValue()).sum();
    }

    private String value(String value, String fallback) {
        return value == null ? fallback : value;
    }
}
