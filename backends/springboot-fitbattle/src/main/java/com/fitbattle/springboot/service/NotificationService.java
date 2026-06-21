package com.fitbattle.springboot.service;

import com.fitbattle.springboot.entity.NotificationEntity;
import com.fitbattle.springboot.repository.NotificationRepository;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {
    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public List<Map<String, Object>> list(String userId) {
        return notificationRepository.findByUserIdOrderByReadAscCreatedAtDesc(userId)
            .stream()
            .map(ResponseMapper::notification)
            .toList();
    }

    public long markRead(String userId, String id) {
        NotificationEntity entity = notificationRepository.findById(id).orElse(null);
        if (entity == null || !userId.equals(entity.getUserId())) return 0;
        entity.setRead(true);
        notificationRepository.save(entity);
        return 1;
    }

    public long markAllRead(String userId) {
        List<NotificationEntity> notifications = notificationRepository.findByUserIdOrderByReadAscCreatedAtDesc(userId);
        notifications.forEach(notification -> notification.setRead(true));
        notificationRepository.saveAll(notifications);
        return notifications.size();
    }
}
