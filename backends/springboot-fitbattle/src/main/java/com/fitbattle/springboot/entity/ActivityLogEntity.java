package com.fitbattle.springboot.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "\"ActivityLog\"")
public class ActivityLogEntity {
    @Id
    @Column(name = "id", nullable = false)
    private String id;

    @Column(name = "user_id")
    private String userId;

    @Column(name = "competition_id")
    private String competitionId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String type;

    private Long steps = 0L;
    private Integer calories = 0;

    @Column(name = "distance_m")
    private BigDecimal distanceM = BigDecimal.ZERO;

    @Column(name = "duration_minutes")
    private Integer durationMinutes = 0;

    private Integer reps = 0;
    private String source = "mobile";

    @Column(name = "media_url")
    private String mediaUrl;

    private Boolean verified = false;

    @Column(name = "created_at")
    private Instant createdAt;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getCompetitionId() { return competitionId; }
    public void setCompetitionId(String competitionId) { this.competitionId = competitionId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public Long getSteps() { return steps; }
    public void setSteps(Long steps) { this.steps = steps; }
    public Integer getCalories() { return calories; }
    public void setCalories(Integer calories) { this.calories = calories; }
    public BigDecimal getDistanceM() { return distanceM; }
    public void setDistanceM(BigDecimal distanceM) { this.distanceM = distanceM; }
    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }
    public Integer getReps() { return reps; }
    public void setReps(Integer reps) { this.reps = reps; }
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
    public String getMediaUrl() { return mediaUrl; }
    public void setMediaUrl(String mediaUrl) { this.mediaUrl = mediaUrl; }
    public Boolean getVerified() { return verified; }
    public void setVerified(Boolean verified) { this.verified = verified; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
