package com.fitbattle.springboot.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "\"Workout\"")
public class WorkoutEntity {
    @Id
    @Column(name = "id", nullable = false)
    private String id;

    @Column(name = "user_id")
    private String userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private UserEntity user;

    @Column(name = "exercise_type")
    private String exerciseType;

    private Integer reps;
    private Integer duration;
    private Integer calories;

    @Column(name = "video_url")
    private String videoUrl;

    private Boolean verified = false;

    @Column(name = "xp_earned")
    private Integer xpEarned = 0;

    @Column(name = "coins_earned")
    private Integer coinsEarned = 0;

    @Column(name = "competition_id")
    private String competitionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "competition_id", insertable = false, updatable = false)
    private CompetitionEntity competition;

    @Column(name = "created_at")
    private Instant createdAt;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public UserEntity getUser() { return user; }
    public void setUser(UserEntity user) { this.user = user; }
    public String getExerciseType() { return exerciseType; }
    public void setExerciseType(String exerciseType) { this.exerciseType = exerciseType; }
    public Integer getReps() { return reps; }
    public void setReps(Integer reps) { this.reps = reps; }
    public Integer getDuration() { return duration; }
    public void setDuration(Integer duration) { this.duration = duration; }
    public Integer getCalories() { return calories; }
    public void setCalories(Integer calories) { this.calories = calories; }
    public String getVideoUrl() { return videoUrl; }
    public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }
    public Boolean getVerified() { return verified; }
    public void setVerified(Boolean verified) { this.verified = verified; }
    public Integer getXpEarned() { return xpEarned; }
    public void setXpEarned(Integer xpEarned) { this.xpEarned = xpEarned; }
    public Integer getCoinsEarned() { return coinsEarned; }
    public void setCoinsEarned(Integer coinsEarned) { this.coinsEarned = coinsEarned; }
    public String getCompetitionId() { return competitionId; }
    public void setCompetitionId(String competitionId) { this.competitionId = competitionId; }
    public CompetitionEntity getCompetition() { return competition; }
    public void setCompetition(CompetitionEntity competition) { this.competition = competition; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
