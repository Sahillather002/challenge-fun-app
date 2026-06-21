package com.fitbattle.springboot.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "\"Transaction\"")
public class TransactionEntity {
    @Id
    @Column(name = "id", nullable = false)
    private String id;

    @Column(name = "user_id")
    private String userId;

    @Column(name = "competition_id")
    private String competitionId;

    @Column(nullable = false)
    private String type;

    private Integer amount;
    private String status = "pending";
    private String description;

    @Column(name = "payment_method")
    private String paymentMethod;

    @Column(name = "transaction_ref")
    private String transactionRef;

    @Column(name = "created_at")
    private Instant createdAt;

    @Column(name = "completed_at")
    private Instant completedAt;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getCompetitionId() { return competitionId; }
    public void setCompetitionId(String competitionId) { this.competitionId = competitionId; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public Integer getAmount() { return amount; }
    public void setAmount(Integer amount) { this.amount = amount; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    public String getTransactionRef() { return transactionRef; }
    public void setTransactionRef(String transactionRef) { this.transactionRef = transactionRef; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getCompletedAt() { return completedAt; }
    public void setCompletedAt(Instant completedAt) { this.completedAt = completedAt; }
}
