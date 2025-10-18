use crate::models::{Leaderboard, LeaderboardEntry, Prize, PrizeDistribution, ScoreUpdateRequest};
use crate::services::cache::CacheService;
use chrono::Utc;
use redis::aio::ConnectionManager;
use std::time::Duration;

#[derive(Clone)]
pub struct LeaderboardService {
    cache: CacheService,
    _redis_client: ConnectionManager,
}

impl LeaderboardService {
    pub fn new(cache: CacheService, redis_client: ConnectionManager) -> Self {
        Self {
            cache,
            _redis_client: redis_client,
        }
    }

    pub async fn get_leaderboard(
        &self,
        competition_id: &str,
        limit: isize,
    ) -> Result<Leaderboard, Box<dyn std::error::Error + Send + Sync>> {
        let key = format!("leaderboard:{}", competition_id);

        let entries = self
            .cache
            .zrevrange_withscores(&key, 0, limit - 1)
            .await?;

        let mut leaderboard_entries = Vec::new();

        for (i, (user_id, score)) in entries.into_iter().enumerate() {
            let user_details = self
                .get_user_details(competition_id, &user_id)
                .await
                .unwrap_or_else(|_| LeaderboardEntry {
                    user_id: user_id.clone(),
                    user_name: "Unknown".to_string(),
                    competition_id: competition_id.to_string(),
                    score: score as i64,
                    rank: (i + 1) as i32,
                    steps: 0,
                    distance: 0.0,
                    calories: 0.0,
                    last_synced_at: Utc::now(),
                    updated_at: Utc::now(),
                });

            leaderboard_entries.push(LeaderboardEntry {
                rank: (i + 1) as i32,
                score: score as i64,
                ..user_details
            });
        }

        let total_count = self.cache.zcard(&key).await?;

        Ok(Leaderboard {
            competition_id: competition_id.to_string(),
            entries: leaderboard_entries,
            total_count,
            updated_at: Utc::now(),
        })
    }

    pub async fn update_score(
        &self,
        req: &ScoreUpdateRequest,
    ) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
        let key = format!("leaderboard:{}", req.competition_id);
        let score = req.steps as f64;

        self.cache.zadd(&key, score, &req.user_id).await?;

        // Store detailed user data
        let user_details_key = format!("user_details:{}:{}", req.competition_id, req.user_id);
        let user_details = LeaderboardEntry {
            user_id: req.user_id.clone(),
            user_name: "".to_string(),
            competition_id: req.competition_id.clone(),
            score: score as i64,
            rank: 0,
            steps: req.steps,
            distance: req.distance,
            calories: req.calories,
            last_synced_at: Utc::now(),
            updated_at: Utc::now(),
        };

        self.cache
            .set(&user_details_key, &user_details, Duration::from_secs(86400))
            .await?;

        // Publish update
        self.publish_leaderboard_update(&req.competition_id, &req.user_id, score as i64)
            .await?;

        Ok(())
    }

    pub async fn calculate_prizes(
        &self,
        competition_id: &str,
        prize_pool: f64,
    ) -> Result<Vec<Prize>, Box<dyn std::error::Error + Send + Sync>> {
        let leaderboard = self.get_leaderboard(competition_id, 3).await?;

        if leaderboard.entries.is_empty() {
            return Err("No participants in competition".into());
        }

        let distribution = PrizeDistribution::default();
        let mut prizes = Vec::new();

        if !leaderboard.entries.is_empty() {
            prizes.push(Prize {
                id: format!("prize-{}-1", competition_id),
                competition_id: competition_id.to_string(),
                user_id: leaderboard.entries[0].user_id.clone(),
                rank: 1,
                amount: prize_pool * distribution.rank_1_percentage,
                status: "pending".to_string(),
                distributed_at: None,
                created_at: Utc::now(),
            });
        }

        if leaderboard.entries.len() > 1 {
            prizes.push(Prize {
                id: format!("prize-{}-2", competition_id),
                competition_id: competition_id.to_string(),
                user_id: leaderboard.entries[1].user_id.clone(),
                rank: 2,
                amount: prize_pool * distribution.rank_2_percentage,
                status: "pending".to_string(),
                distributed_at: None,
                created_at: Utc::now(),
            });
        }

        if leaderboard.entries.len() > 2 {
            prizes.push(Prize {
                id: format!("prize-{}-3", competition_id),
                competition_id: competition_id.to_string(),
                user_id: leaderboard.entries[2].user_id.clone(),
                rank: 3,
                amount: prize_pool * distribution.rank_3_percentage,
                status: "pending".to_string(),
                distributed_at: None,
                created_at: Utc::now(),
            });
        }

        // Cache prizes
        let prizes_key = format!("prizes:{}", competition_id);
        self.cache
            .set(&prizes_key, &prizes, Duration::from_secs(604800))
            .await?;

        Ok(prizes)
    }

    async fn get_user_details(
        &self,
        competition_id: &str,
        user_id: &str,
    ) -> Result<LeaderboardEntry, Box<dyn std::error::Error + Send + Sync>> {
        let key = format!("user_details:{}:{}", competition_id, user_id);
        let details = self.cache.get(&key).await?;
        Ok(details)
    }

    async fn publish_leaderboard_update(
        &self,
        competition_id: &str,
        user_id: &str,
        score: i64,
    ) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
        let channel = format!("leaderboard:{}", competition_id);
        let message = serde_json::json!({
            "type": "score_update",
            "competition_id": competition_id,
            "user_id": user_id,
            "score": score,
            "timestamp": Utc::now(),
        });
        self.cache.publish(&channel, &message).await?;
        Ok(())
    }
}
