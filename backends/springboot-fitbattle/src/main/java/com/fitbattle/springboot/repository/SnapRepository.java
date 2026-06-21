package com.fitbattle.springboot.repository;

import com.fitbattle.springboot.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SnapRepository extends JpaRepository<SnapEntity, String> {
    List<SnapEntity> findByReceiverIdOrderByCreatedAtDesc(String receiverId);
}
