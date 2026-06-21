package com.fitbattle.springboot.service;

import com.fitbattle.springboot.dto.CreateStoryRequest;
import com.fitbattle.springboot.dto.SendSnapRequest;
import com.fitbattle.springboot.entity.*;
import com.fitbattle.springboot.repository.*;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class SnapService {
    private final StoryRepository storyRepository;
    private final SnapRepository snapRepository;

    public SnapService(StoryRepository storyRepository, SnapRepository snapRepository) {
        this.storyRepository = storyRepository;
        this.snapRepository = snapRepository;
    }

    public List<Map<String, Object>> stories() {
        return storyRepository.findAllByOrderByCreatedAtDesc().stream()
            .map(ResponseMapper::story)
            .toList();
    }

    public Map<String, Object> createStory(String userId, CreateStoryRequest request) {
        StoryEntity story = new StoryEntity();
        story.setId(UUID.randomUUID().toString());
        story.setUserId(userId);
        story.setMediaUrl(request.mediaUrl());
        story.setMediaType(request.mediaType());
        story.setCaption(request.caption());
        story.setExpiresAt(Instant.now().plusSeconds(86400));
        story.setCreatedAt(Instant.now());
        return ResponseMapper.story(storyRepository.save(story));
    }

    public List<Map<String, Object>> inbox(String userId) {
        return snapRepository.findByReceiverIdOrderByCreatedAtDesc(userId).stream()
            .map(ResponseMapper::snap)
            .toList();
    }

    public Map<String, Object> send(String senderId, SendSnapRequest request) {
        SnapEntity snap = new SnapEntity();
        snap.setId(UUID.randomUUID().toString());
        snap.setSenderId(senderId);
        snap.setReceiverId(request.receiverId());
        snap.setMediaUrl(request.mediaUrl());
        snap.setMediaType(request.mediaType());
        snap.setExpiresAt(Instant.now().plusSeconds(86400));
        snap.setCreatedAt(Instant.now());
        return ResponseMapper.snap(snapRepository.save(snap));
    }

    public void markViewed(String id) {
        SnapEntity snap = snapRepository.findById(id).orElseThrow();
        snap.setStatus("VIEWED");
        snapRepository.save(snap);
    }
}
