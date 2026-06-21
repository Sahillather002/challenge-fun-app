package com.fitbattle.springboot.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "\"SyncJob\"")
public class SyncJobEntity {
    @Id
    @Column(name = "id", nullable = false)
    private String id;

    @Column(name = "user_id")
    private String userId;

    @Column(name = "device_id")
    private String deviceId;

    @Column(name = "event_type")
    private String eventType;

    @Column(columnDefinition = "jsonb")
    private String payload;

    @Column(name = "idempotency_key", unique = true)
    private String idempotencyKey;

    @Enumerated(EnumType.STRING)
    private SyncStatus status = SyncStatus.PENDING;

    private Integer attempts = 0;

    @Column(name = "last_error")
    private String lastError;

    @Column(name = "created_at")
    private Instant createdAt;

    @Column(name = "processed_at")
    private Instant processedAt;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getDeviceId() { return deviceId; }
    public void setDeviceId(String deviceId) { this.deviceId = deviceId; }
    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }
    public String getPayload() { return payload; }
    public void setPayload(String payload) { this.payload = payload; }
    public String getIdempotencyKey() { return idempotencyKey; }
    public void setIdempotencyKey(String idempotencyKey) { this.idempotencyKey = idempotencyKey; }
    public SyncStatus getStatus() { return status; }
    public void setStatus(SyncStatus status) { this.status = status; }
    public Integer getAttempts() { return attempts; }
    public void setAttempts(Integer attempts) { this.attempts = attempts; }
    public String getLastError() { return lastError; }
    public void setLastError(String lastError) { this.lastError = lastError; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getProcessedAt() { return processedAt; }
    public void setProcessedAt(Instant processedAt) { this.processedAt = processedAt; }
}
