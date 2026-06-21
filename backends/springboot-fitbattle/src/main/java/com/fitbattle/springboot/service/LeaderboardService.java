package com.fitbattle.springboot.service;

import com.fitbattle.springboot.entity.*;
import com.fitbattle.springboot.repository.*;
import java.util.*;
import org.springframework.stereotype.Service;

@Service
public class LeaderboardService {
    private final LeaderboardEntryRepository leaderboardEntryRepository;
    private final FriendshipRepository friendshipRepository;

    public LeaderboardService(LeaderboardEntryRepository leaderboardEntryRepository,
                              FriendshipRepository friendshipRepository) {
        this.leaderboardEntryRepository = leaderboardEntryRepository;
        this.friendshipRepository = friendshipRepository;
    }

    public List<Map<String, Object>> get(String scope, String userId) {
        List<LeaderboardEntryEntity> entries = leaderboardEntryRepository.findAllByOrderByRankAsc();
        if ("friends".equals(scope)) {
            Set<String> friendIds = new HashSet<>();
            friendIds.add(userId);
            friendshipRepository.findByUserIdAndStatus(userId, FriendshipStatus.ACCEPTED)
                .forEach(friendship -> friendIds.add(friendship.getFriendId()));
            friendshipRepository.findByFriendIdAndStatus(userId, FriendshipStatus.ACCEPTED)
                .forEach(friendship -> friendIds.add(friendship.getUserId()));
            entries = entries.stream()
                .filter(entry -> friendIds.contains(entry.getUserId()))
                .toList();
        }
        if ("team".equals(scope)) {
            entries = entries.stream().limit(25).toList();
        }
        return entries.stream().map(ResponseMapper::leaderboard).toList();
    }
}
