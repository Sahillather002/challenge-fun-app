package com.fitbattle.springboot.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "\"FitnessData\"")
public class FitnessDataEntity {
    @Id
    @Column(name = "id", nullable = false)
    private String id;

    @Column(name = "user_id")
    private String userId;

    @Column(name = "competition_id")
    private String competitionId;

    @Column(name = "date")
    private LocalDate date;

    private Long steps = 0L;

    @Column(name = "distance_m")
    private BigDecimal distanceM = BigDecimal.ZERO;

    private Integer calories = 0;

    @Column(name = "active_minutes")
    private Integer activeMinutes = 0;

    private Integer reps = 0;

    @Column(name = "workout_score")
    private Long workoutScore = 0L;

    private String source = "mobile";

    @Column(name = "device_id")
    private String deviceId;

    @Column(name = "idempotency_key")
    private String idempotencyKey = "";

    @Column(name = "client_timestamp")
    private Instant clientTimestamp;

    @Column(name = "synced_at")
    private Instant syncedAt;

    @Column(name = "created_at")
    private Instant createdAt;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getCompetitionId() { return competitionId; }
    public void setCompetitionId(String competitionId) { this.competitionId = competitionId; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public Long getSteps() { return steps; }
    public void setSteps(Long steps) { this.steps = steps; }
    public BigDecimal getDistanceM() { return distanceM; }
    public void setDistanceM(BigDecimal distanceM) { this.distanceM = distanceM; }
    public Integer getCalories() { return calories; }
    public void setCalories(Integer calories) { this.calories = calories; }
    public Integer getActiveMinutes() { return activeMinutes; }
    public void setActiveMinutes(Integer activeMinutes) { this.activeMinutes = activeMinutes; }
    public Integer getReps() { return reps; }
    public void setReps(Integer reps) { this.reps = reps; }
    public Long getWorkoutScore() { return workoutScore; }
    public void setWorkoutScore(Long workoutScore) { this.workoutScore = workoutScore; }
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
    public String getDeviceId() { return deviceId; }
    public void setDeviceId(String deviceId) { this.deviceId = deviceId; }
    public String getIdempotencyKey() { return idempotencyKey; }
    public void setIdempotencyKey(String idempotencyKey) { this.idempotencyKey = idempotencyKey; }
    public Instant getClientTimestamp() { return clientTimestamp; }
    public void setClientTimestamp(Instant clientTimestamp) { this.clientTimestamp = clientTimestamp; }
    public Instant getSyncedAt() { return syncedAt; }
    public void setSyncedAt(Instant syncedAt) { this.syncedAt = syncedAt; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
