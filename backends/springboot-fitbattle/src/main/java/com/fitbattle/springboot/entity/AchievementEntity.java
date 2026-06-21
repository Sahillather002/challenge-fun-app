package com.fitbattle.springboot.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "\"Achievement\"")
public class AchievementEntity {
    @Id
    @Column(name = "id", nullable = false)
    private String id;

    @Column(nullable = false, unique = true)
    private String key;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private String icon;

    @Column(name = "xp_reward")
    private Integer xpReward = 0;

    @Column(name = "coin_reward")
    private Integer coinReward = 0;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getKey() { return key; }
    public void setKey(String key) { this.key = key; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }
    public Integer getXpReward() { return xpReward; }
    public void setXpReward(Integer xpReward) { this.xpReward = xpReward; }
    public Integer getCoinReward() { return coinReward; }
    public void setCoinReward(Integer coinReward) { this.coinReward = coinReward; }
}
