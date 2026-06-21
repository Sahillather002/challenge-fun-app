package com.fitbattle.springboot.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "\"CompetitionParticipant\"")
public class CompetitionParticipantEntity {
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
    private Integer rank;

    @Column(name = "prize_won")
    private Integer prizeWon;

    @Column(name = "joined_at")
    private Instant joinedAt;

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
    public Integer getPrizeWon() { return prizeWon; }
    public void setPrizeWon(Integer prizeWon) { this.prizeWon = prizeWon; }
    public Instant getJoinedAt() { return joinedAt; }
    public void setJoinedAt(Instant joinedAt) { this.joinedAt = joinedAt; }
}
