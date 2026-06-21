package com.fitbattle.springboot.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "\"Snap\"")
public class SnapEntity {
    @Id
    @Column(name = "id", nullable = false)
    private String id;

    @Column(name = "sender_id")
    private String senderId;

    @Column(name = "receiver_id")
    private String receiverId;

    @Column(name = "media_url")
    private String mediaUrl;

    @Column(name = "media_type")
    private String mediaType;

    private String status = "PENDING";

    @Column(name = "expires_at")
    private Instant expiresAt;

    @Column(name = "created_at")
    private Instant createdAt;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getSenderId() { return senderId; }
    public void setSenderId(String senderId) { this.senderId = senderId; }
    public String getReceiverId() { return receiverId; }
    public void setReceiverId(String receiverId) { this.receiverId = receiverId; }
    public String getMediaUrl() { return mediaUrl; }
    public void setMediaUrl(String mediaUrl) { this.mediaUrl = mediaUrl; }
    public String getMediaType() { return mediaType; }
    public void setMediaType(String mediaType) { this.mediaType = mediaType; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Instant getExpiresAt() { return expiresAt; }
    public void setExpiresAt(Instant expiresAt) { this.expiresAt = expiresAt; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
