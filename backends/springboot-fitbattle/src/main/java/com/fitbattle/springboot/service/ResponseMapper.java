package com.fitbattle.springboot.service;

import com.fitbattle.springboot.entity.*;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ResponseMapper {
    private ResponseMapper() {}

    public static Map<String, Object> user(UserEntity user) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", value(user.getId()));
        map.put("email", value(user.getEmail()));
        map.put("username", value(user.getUsername()));
        map.put("name", value(user.getName()));
        map.put("avatar", value(user.getAvatar()));
        map.put("bio", value(user.getBio()));
        map.put("height", value(user.getHeight()));
        map.put("weight", value(user.getWeight()));
        map.put("age", value(user.getAge()));
        map.put("level", value(user.getLevel()));
        map.put("xp", value(user.getXp()));
        map.put("coins", value(user.getCoins()));
        map.put("currentStreak", value(user.getCurrentStreak()));
        map.put("longestStreak", value(user.getLongestStreak()));
        return map;
    }

    public static Map<String, Object> competition(CompetitionEntity competition, long participantCount) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", value(competition.getId()));
        map.put("title", value(competition.getTitle()));
        map.put("description", value(competition.getDescription()));
        map.put("category", category(competition.getMetric()));
        map.put("metric", value(competition.getMetric()));
        map.put("type", value(competition.getType()));
        map.put("status", value(competition.getStatus()));
        map.put("startTime", value(competition.getStartTime()));
        map.put("endTime", value(competition.getEndTime()));
        map.put("prize", value(competition.getPrizePool()));
        map.put("prizePool", value(competition.getPrizePool()));
        map.put("participants", participantCount);
        map.put("entryFee", value(competition.getEntryFee()));
        map.put("rules", value(competition.getRules()));
        return map;
    }

    public static Map<String, Object> leaderboard(LeaderboardEntryEntity entry) {
        UserEntity user = entry.getUser();
        Map<String, Object> map = new HashMap<>();
        map.put("id", value(entry.getId()));
        map.put("rank", value(entry.getRank()));
        map.put("name", user == null ? null : value(user.getName()));
        map.put("username", user == null ? null : value(user.getUsername()));
        map.put("avatar", user == null ? null : value(user.getAvatar()));
        map.put("score", value(entry.getScore()));
        map.put("steps", value(entry.getSteps()));
        map.put("calories", value(entry.getCalories()));
        map.put("distanceM", value(entry.getDistanceM()));
        map.put("activeMinutes", value(entry.getActiveMinutes()));
        map.put("movement", movement(entry.getMovement()));
        map.put("level", user == null ? null : value(user.getLevel()));
        map.put("currentStreak", user == null ? null : value(user.getCurrentStreak()));
        return map;
    }

    public static Map<String, Object> fitnessData(FitnessDataEntity entity) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", value(entity.getId()));
        map.put("date", value(entity.getDate()));
        map.put("steps", value(entity.getSteps()));
        map.put("distanceM", value(entity.getDistanceM()));
        map.put("calories", value(entity.getCalories()));
        map.put("activeMinutes", value(entity.getActiveMinutes()));
        map.put("reps", value(entity.getReps()));
        map.put("workoutScore", value(entity.getWorkoutScore()));
        map.put("source", value(entity.getSource()));
        map.put("deviceId", value(entity.getDeviceId()));
        return map;
    }

    public static Map<String, Object> activityLog(ActivityLogEntity entity) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", value(entity.getId()));
        map.put("title", value(entity.getTitle()));
        map.put("type", value(entity.getType()));
        map.put("steps", value(entity.getSteps()));
        map.put("calories", value(entity.getCalories()));
        map.put("distanceM", value(entity.getDistanceM()));
        map.put("durationMinutes", value(entity.getDurationMinutes()));
        map.put("reps", value(entity.getReps()));
        map.put("source", value(entity.getSource()));
        map.put("mediaUrl", value(entity.getMediaUrl()));
        return map;
    }

    public static Map<String, Object> notification(NotificationEntity entity) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", value(entity.getId()));
        map.put("type", value(entity.getType()));
        map.put("title", value(entity.getTitle()));
        map.put("body", value(entity.getBody()));
        map.put("actionLabel", value(entity.getActionLabel()));
        map.put("actionUrl", value(entity.getActionUrl()));
        map.put("read", value(entity.getRead()));
        map.put("createdAt", value(entity.getCreatedAt()));
        return map;
    }

    public static Map<String, Object> workout(WorkoutEntity workout) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", value(workout.getId()));
        map.put("exerciseType", value(workout.getExerciseType()));
        map.put("reps", value(workout.getReps()));
        map.put("duration", workout.getDuration() == null ? null : workout.getDuration() / 60);
        map.put("calories", value(workout.getCalories()));
        map.put("videoUrl", value(workout.getVideoUrl()));
        map.put("verified", value(workout.getVerified()));
        map.put("xpEarned", value(workout.getXpEarned()));
        map.put("coinsEarned", value(workout.getCoinsEarned()));
        map.put("competitionId", value(workout.getCompetitionId()));
        map.put("createdAt", value(workout.getCreatedAt()));
        return map;
    }

    public static Map<String, Object> achievement(UserAchievementEntity entity) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", value(entity.getId()));
        map.put("achievementId", value(entity.getAchievementId()));
        map.put("unlocked", true);
        map.put("unlockedAt", value(entity.getUnlockedAt()));
        return map;
    }

    public static Map<String, Object> story(StoryEntity story) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", value(story.getId()));
        map.put("userId", value(story.getUserId()));
        map.put("mediaUrl", value(story.getMediaUrl()));
        map.put("mediaType", value(story.getMediaType()));
        map.put("caption", value(story.getCaption()));
        map.put("expiresAt", value(story.getExpiresAt()));
        map.put("createdAt", value(story.getCreatedAt()));
        return map;
    }

    public static Map<String, Object> snap(SnapEntity snap) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", value(snap.getId()));
        map.put("senderId", value(snap.getSenderId()));
        map.put("receiverId", value(snap.getReceiverId()));
        map.put("mediaUrl", value(snap.getMediaUrl()));
        map.put("mediaType", value(snap.getMediaType()));
        map.put("status", value(snap.getStatus()));
        map.put("expiresAt", value(snap.getExpiresAt()));
        map.put("createdAt", value(snap.getCreatedAt()));
        return map;
    }

    public static String category(CompetitionMetric metric) {
        if (metric == null) return "Steps";
        return switch (metric) {
            case DISTANCE -> "Cardio";
            case ACTIVE_MINUTES -> "Endurance";
            case REPS -> "Strength";
            case CALORIES -> "Wellness";
            default -> "Steps";
        };
    }

    public static String movement(Integer movement) {
        if (movement == null || movement == 0) return "same";
        return movement > 0 ? "up" : "down";
    }

    private static Object value(Object value) {
        return value;
    }

    private static Object value(BigDecimal value) {
        return value == null ? null : value.doubleValue();
    }

    private static Object value(Long value) {
        return value;
    }

    private static Object value(Integer value) {
        return value;
    }
}
