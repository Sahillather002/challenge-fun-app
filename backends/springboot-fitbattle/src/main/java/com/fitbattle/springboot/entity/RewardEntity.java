package com.fitbattle.springboot.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "\"Reward\"")
public class RewardEntity {
    @Id
    @Column(name = "id", nullable = false)
    private String id;

    @Column(nullable = false)
    private String name;

    private String description;
    private String icon;

    @Column(name = "points_cost")
    private Integer pointsCost = 0;

    private Boolean available = true;

    @Column(name = "created_at")
    private Instant createdAt;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }
    public Integer getPointsCost() { return pointsCost; }
    public void setPointsCost(Integer pointsCost) { this.pointsCost = pointsCost; }
    public Boolean getAvailable() { return available; }
    public void setAvailable(Boolean available) { this.available = available; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
