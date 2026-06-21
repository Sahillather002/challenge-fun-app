package com.fitbattle.springboot.controller;

import com.fitbattle.springboot.dto.ApiResponse;
import com.fitbattle.springboot.security.AuthenticatedUser;
import com.fitbattle.springboot.service.FriendService;
import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/friends")
public class FriendController {
    private final FriendService friendService;

    public FriendController(FriendService friendService) {
        this.friendService = friendService;
    }

    @GetMapping
    public ApiResponse<List<Map<String, Object>>> list(AuthenticatedUser user) {
        return ApiResponse.ok(friendService.list(user.id()));
    }

    @PostMapping("/add/{friendId}")
    public ApiResponse<Map<String, Object>> add(AuthenticatedUser user, @PathVariable String friendId) {
        return ApiResponse.ok(friendService.add(user.id(), friendId));
    }

    @PostMapping("/accept/{friendshipId}")
    public ApiResponse<Map<String, Object>> accept(@PathVariable String friendshipId) {
        return ApiResponse.ok(friendService.accept(friendshipId));
    }

    @DeleteMapping("/{friendshipId}")
    public ApiResponse<Map<String, Object>> remove(@PathVariable String friendshipId) {
        friendService.remove(friendshipId);
        return ApiResponse.ok(Map.of("deleted", true));
    }
}
