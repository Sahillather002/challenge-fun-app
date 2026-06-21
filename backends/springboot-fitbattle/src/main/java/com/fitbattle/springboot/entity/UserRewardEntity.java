package com.fitbattle.springboot.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "\"UserReward\"")
public class UserRewardEntity {
    @Id
    @Column(name = "id", nullable = false)
    private String id;

    @Column(name = "user_id")
    private String userId;

    @Column(name = "reward_id")
    private String rewardId;

    @Column(name = "points_spent")
    private Integer pointsSpent = 0;

    private String status = "pending";

    @Column(name = "created_at")
    private Instant createdAt;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getRewardId() { return rewardId; }
    public void setRewardId(String rewardId) { this.rewardId = rewardId; }
    public Integer getPointsSpent() { return pointsSpent; }
    public void setPointsSpent(Integer pointsSpent) { this.pointsSpent = pointsSpent; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
