use crate::models::{FitnessData, FitnessSyncRequest};
use crate::services::cache::CacheService;
use chrono::Utc;
use std::time::Duration;

#[derive(Clone)]
pub struct FitnessService {
    cache: CacheService,
    _supabase_url: String,
}

impl FitnessService {
    pub fn new(cache: CacheService, supabase_url: String) -> Self {
        Self {
            cache,
            _supabase_url: supabase_url,
        }
    }

    pub async fn sync_fitness_data(
        &self,
        req: &FitnessSyncRequest,
    ) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
        let fitness_key = format!(
            "fitness:{}:{}:{}",
            req.user_id,
            req.competition_id,
            req.date.format("%Y-%m-%d")
        );

        let fitness_data = FitnessData {
            id: format!("{}-{}-{}", req.user_id, req.competition_id, req.date.timestamp()),
            user_id: req.user_id.clone(),
            competition_id: req.competition_id.clone(),
            steps: req.steps,
            distance: req.distance,
            calories: req.calories,
            active_minutes: req.active_minutes,
            source: req.source.clone(),
            date: req.date,
            synced_at: Utc::now(),
            created_at: Utc::now(),
        };

        self.cache
            .set(&fitness_key, &fitness_data, Duration::from_secs(2592000))
            .await?;

        self.update_aggregated_stats(&req.user_id, &req.competition_id, &fitness_data)
            .await?;

        Ok(())
    }

    pub async fn get_user_stats(
        &self,
        user_id: &str,
        competition_id: &str,
    ) -> Result<FitnessData, Box<dyn std::error::Error + Send + Sync>> {
        let stats_key = format!("fitness_stats:{}:{}", user_id, competition_id);

        match self.cache.get(&stats_key).await {
            Ok(stats) => Ok(stats),
            Err(_) => Ok(FitnessData {
                id: String::new(),
                user_id: user_id.to_string(),
                competition_id: competition_id.to_string(),
                steps: 0,
                distance: 0.0,
                calories: 0.0,
                active_minutes: 0,
                source: String::new(),
                date: Utc::now(),
                synced_at: Utc::now(),
                created_at: Utc::now(),
            }),
        }
    }

    async fn update_aggregated_stats(
        &self,
        user_id: &str,
        competition_id: &str,
        new_data: &FitnessData,
    ) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
        let stats_key = format!("fitness_stats:{}:{}", user_id, competition_id);

        let mut current_stats: FitnessData = self
            .cache
            .get(&stats_key)
            .await
            .unwrap_or_else(|_| FitnessData {
                id: String::new(),
                user_id: user_id.to_string(),
                competition_id: competition_id.to_string(),
                steps: 0,
                distance: 0.0,
                calories: 0.0,
                active_minutes: 0,
                source: new_data.source.clone(),
                date: Utc::now(),
                synced_at: Utc::now(),
                created_at: Utc::now(),
            });

        current_stats.steps += new_data.steps;
        current_stats.distance += new_data.distance;
        current_stats.calories += new_data.calories;
        current_stats.active_minutes += new_data.active_minutes;
        current_stats.synced_at = Utc::now();
        current_stats.source = new_data.source.clone();

        self.cache
            .set(&stats_key, &current_stats, Duration::from_secs(2592000))
            .await?;

        Ok(())
    }
}
