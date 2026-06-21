package com.fitbattle.springboot.service;

import com.fitbattle.springboot.entity.*;
import com.fitbattle.springboot.repository.*;
import java.time.Instant;
import java.util.*;
import org.springframework.stereotype.Service;

@Service
public class FriendService {
    private final FriendshipRepository friendshipRepository;
    private final UserRepository userRepository;

    public FriendService(FriendshipRepository friendshipRepository, UserRepository userRepository) {
        this.friendshipRepository = friendshipRepository;
        this.userRepository = userRepository;
    }

    public List<Map<String, Object>> list(String userId) {
        List<FriendshipEntity> friendships = new ArrayList<>();
        friendships.addAll(friendshipRepository.findByUserIdAndStatus(userId, FriendshipStatus.ACCEPTED));
        friendships.addAll(friendshipRepository.findByFriendIdAndStatus(userId, FriendshipStatus.ACCEPTED));
        return friendships.stream().map(friendship -> {
            String friendId = userId.equals(friendship.getUserId()) ? friendship.getFriendId() : friendship.getUserId();
            Map<String, Object> map = new LinkedHashMap<>();
            userRepository.findById(friendId).ifPresent(user -> map.putAll(ResponseMapper.user(user)));
            map.put("friendshipId", friendship.getId());
            map.put("status", "online");
            map.put("mutualCompetitions", 0);
            return map;
        }).toList();
    }

    public Map<String, Object> add(String userId, String friendId) {
        FriendshipEntity entity = new FriendshipEntity();
        entity.setId(UUID.randomUUID().toString());
        entity.setUserId(userId);
        entity.setFriendId(friendId);
        entity.setStatus(FriendshipStatus.PENDING);
        entity.setCreatedAt(Instant.now());
        friendshipRepository.save(entity);
        return Map.of("friendshipId", entity.getId(), "status", "PENDING");
    }

    public Map<String, Object> accept(String friendshipId) {
        FriendshipEntity entity = friendshipRepository.findById(friendshipId).orElseThrow();
        entity.setStatus(FriendshipStatus.ACCEPTED);
        friendshipRepository.save(entity);
        return Map.of("friendshipId", entity.getId(), "status", "ACCEPTED");
    }

    public void remove(String friendshipId) {
        friendshipRepository.deleteById(friendshipId);
    }
}
