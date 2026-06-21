package com.fitbattle.springboot.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "\"LeaderboardEntry\"")
public class LeaderboardEntryEntity {
    @Id
    @Column(name = "id", nullable = false)
    private String id;

    @Column(name = "user_id")
    private String userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private UserEntity user;

    @Column(name = "competition_id")
    private String competitionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "competition_id", insertable = false, updatable = false)
    private CompetitionEntity competition;

    private Long score = 0L;
    private Integer rank = 0;
    private Long steps = 0L;

    @Column(name = "distance_m")
    private BigDecimal distanceM = BigDecimal.ZERO;

    private Integer calories = 0;

    @Column(name = "active_minutes")
    private Integer activeMinutes = 0;

    private Integer movement = 0;

    @Column(name = "last_synced_at")
    private Instant lastSyncedAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public UserEntity getUser() { return user; }
    public void setUser(UserEntity user) { this.user = user; }
    public String getCompetitionId() { return competitionId; }
    public void setCompetitionId(String competitionId) { this.competitionId = competitionId; }
    public CompetitionEntity getCompetition() { return competition; }
    public void setCompetition(CompetitionEntity competition) { this.competition = competition; }
    public Long getScore() { return score; }
    public void setScore(Long score) { this.score = score; }
    public Integer getRank() { return rank; }
    public void setRank(Integer rank) { this.rank = rank; }
    public Long getSteps() { return steps; }
    public void setSteps(Long steps) { this.steps = steps; }
    public BigDecimal getDistanceM() { return distanceM; }
    public void setDistanceM(BigDecimal distanceM) { this.distanceM = distanceM; }
    public Integer getCalories() { return calories; }
    public void setCalories(Integer calories) { this.calories = calories; }
    public Integer getActiveMinutes() { return activeMinutes; }
    public void setActiveMinutes(Integer activeMinutes) { this.activeMinutes = activeMinutes; }
    public Integer getMovement() { return movement; }
    public void setMovement(Integer movement) { this.movement = movement; }
    public Instant getLastSyncedAt() { return lastSyncedAt; }
    public void setLastSyncedAt(Instant lastSyncedAt) { this.lastSyncedAt = lastSyncedAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
