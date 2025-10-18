pub mod fitness;
pub mod leaderboard;
pub mod websocket;

use crate::config::Config;
use crate::services::{FitnessService, LeaderboardService};
use axum::{http::StatusCode, Json};
use serde_json::json;

pub struct AppState {
    pub config: Config,
    pub leaderboard_service: LeaderboardService,
    pub fitness_service: FitnessService,
}

pub async fn health_check() -> (StatusCode, Json<serde_json::Value>) {
    (
        StatusCode::OK,
        Json(json!({
            "status": "healthy",
            "service": "rust-backend"
        })),
    )
}
