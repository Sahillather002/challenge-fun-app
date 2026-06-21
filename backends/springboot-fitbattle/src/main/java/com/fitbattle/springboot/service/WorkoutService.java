package com.fitbattle.springboot.service;

import com.fitbattle.springboot.dto.CreateWorkoutRequest;
import com.fitbattle.springboot.entity.WorkoutEntity;
import com.fitbattle.springboot.repository.WorkoutRepository;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class WorkoutService {
    private final WorkoutRepository workoutRepository;

    public WorkoutService(WorkoutRepository workoutRepository) {
        this.workoutRepository = workoutRepository;
    }

    public List<Map<String, Object>> list(String userId) {
        return workoutRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
            .map(ResponseMapper::workout)
            .toList();
    }

    public Map<String, Object> create(String userId, CreateWorkoutRequest request) {
        WorkoutEntity workout = new WorkoutEntity();
        workout.setId(UUID.randomUUID().toString());
        workout.setUserId(userId);
        workout.setCompetitionId(request.competitionId());
        workout.setExerciseType(request.exerciseType());
        workout.setReps(request.reps());
        workout.setDuration(request.duration());
        workout.setCalories(request.calories());
        workout.setVideoUrl(request.videoUrl());
        workout.setCreatedAt(Instant.now());
        return ResponseMapper.workout(workoutRepository.save(workout));
    }
}
