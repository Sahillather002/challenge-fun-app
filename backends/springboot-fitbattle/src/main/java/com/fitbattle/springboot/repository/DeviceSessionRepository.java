package com.fitbattle.springboot.repository;

import com.fitbattle.springboot.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface DeviceSessionRepository extends JpaRepository<DeviceSessionEntity, String> {
    Optional<DeviceSessionEntity> findByUserIdAndDeviceNameAndPlatform(String userId, String deviceName, String platform);
}
