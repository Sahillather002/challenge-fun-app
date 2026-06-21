package com.fitbattle.springboot.repository;

import com.fitbattle.springboot.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FriendshipRepository extends JpaRepository<FriendshipEntity, String> {
    List<FriendshipEntity> findByUserIdAndStatus(String userId, FriendshipStatus status);
    List<FriendshipEntity> findByFriendIdAndStatus(String friendId, FriendshipStatus status);
}
