package com.fitbattle.springboot.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "\"Competition\"")
public class CompetitionEntity {
    @Id
    @Column(name = "id", nullable = false)
    private String id;

    @Column(name = "title", nullable = false)
    private String title;

    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private CompetitionType type;

    @Enumerated(EnumType.STRING)
    @Column(name = "metric", nullable = false)
    private CompetitionMetric metric = CompetitionMetric.STEPS;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private CompetitionStatus status = CompetitionStatus.UPCOMING;

    @Column(name = "start_time")
    private Instant startTime;

    @Column(name = "end_time")
    private Instant endTime;

    @Column(name = "prize_pool")
    private Integer prizePool;

    @Column(name = "entry_fee")
    private Integer entryFee;

    @Column(columnDefinition = "jsonb")
    private String rules;

    @Column(name = "creator_id")
    private String creatorId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "creator_id", insertable = false, updatable = false)
    private UserEntity creator;

    @Column(name = "created_at")
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public CompetitionType getType() { return type; }
    public void setType(CompetitionType type) { this.type = type; }
    public CompetitionMetric getMetric() { return metric; }
    public void setMetric(CompetitionMetric metric) { this.metric = metric; }
    public CompetitionStatus getStatus() { return status; }
    public void setStatus(CompetitionStatus status) { this.status = status; }
    public Instant getStartTime() { return startTime; }
    public void setStartTime(Instant startTime) { this.startTime = startTime; }
    public Instant getEndTime() { return endTime; }
    public void setEndTime(Instant endTime) { this.endTime = endTime; }
    public Integer getPrizePool() { return prizePool; }
    public void setPrizePool(Integer prizePool) { this.prizePool = prizePool; }
    public Integer getEntryFee() { return entryFee; }
    public void setEntryFee(Integer entryFee) { this.entryFee = entryFee; }
    public String getRules() { return rules; }
    public void setRules(String rules) { this.rules = rules; }
    public String getCreatorId() { return creatorId; }
    public void setCreatorId(String creatorId) { this.creatorId = creatorId; }
    public UserEntity getCreator() { return creator; }
    public void setCreator(UserEntity creator) { this.creator = creator; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
