package com.fitbattle.springboot.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "\"User\"")
public class UserEntity {
    @Id
    @Column(name = "id", nullable = false)
    private String id;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "username", nullable = false)
    private String username;

    @Column(name = "name", nullable = false)
    private String name;

    private String avatar;
    private String bio;
    private String height;
    private String weight;
    private Integer age;

    @Column(name = "level")
    private Integer level = 1;

    @Column(name = "xp")
    private Integer xp = 0;

    @Column(name = "coins")
    private Integer coins = 0;

    @Column(name = "current_streak")
    private Integer currentStreak = 0;

    @Column(name = "longest_streak")
    private Integer longestStreak = 0;

    @Column(name = "last_workout")
    private Instant lastWorkout;

    @Column(name = "streak_freezes")
    private Integer streakFreezes = 1;

    @Column(name = "push_enabled")
    private Boolean pushEnabled = true;

    @Column(name = "reminder_time")
    private String reminderTime;

    @OneToMany(mappedBy = "user")
    private List<WorkoutEntity> workouts = new ArrayList<>();

    @OneToMany(mappedBy = "creator")
    private List<CompetitionEntity> competitionsCreated = new ArrayList<>();

    @Column(name = "created_at")
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public String getHeight() { return height; }
    public void setHeight(String height) { this.height = height; }
    public String getWeight() { return weight; }
    public void setWeight(String weight) { this.weight = weight; }
    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }
    public Integer getLevel() { return level; }
    public void setLevel(Integer level) { this.level = level; }
    public Integer getXp() { return xp; }
    public void setXp(Integer xp) { this.xp = xp; }
    public Integer getCoins() { return coins; }
    public void setCoins(Integer coins) { this.coins = coins; }
    public Integer getCurrentStreak() { return currentStreak; }
    public void setCurrentStreak(Integer currentStreak) { this.currentStreak = currentStreak; }
    public Integer getLongestStreak() { return longestStreak; }
    public void setLongestStreak(Integer longestStreak) { this.longestStreak = longestStreak; }
    public Instant getLastWorkout() { return lastWorkout; }
    public void setLastWorkout(Instant lastWorkout) { this.lastWorkout = lastWorkout; }
    public Integer getStreakFreezes() { return streakFreezes; }
    public void setStreakFreezes(Integer streakFreezes) { this.streakFreezes = streakFreezes; }
    public Boolean getPushEnabled() { return pushEnabled; }
    public void setPushEnabled(Boolean pushEnabled) { this.pushEnabled = pushEnabled; }
    public String getReminderTime() { return reminderTime; }
    public void setReminderTime(String reminderTime) { this.reminderTime = reminderTime; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
