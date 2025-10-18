use crate::handlers::AppState;
use crate::models::{CalculatePrizesRequest, ScoreUpdateRequest, SuccessResponse};
use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    Json,
};
use serde::Deserialize;
use std::sync::Arc;

#[derive(Deserialize)]
pub struct LeaderboardQuery {
    #[serde(default = "default_limit")]
    limit: isize,
}

fn default_limit() -> isize {
    100
}

pub async fn get_leaderboard(
    State(state): State<Arc<AppState>>,
    Path(competition_id): Path<String>,
    Query(params): Query<LeaderboardQuery>,
) -> Result<Json<SuccessResponse<serde_json::Value>>, (StatusCode, String)> {
    let leaderboard = state
        .leaderboard_service
        .get_leaderboard(&competition_id, params.limit)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(SuccessResponse::new(
        serde_json::to_value(leaderboard).unwrap(),
    )))
}

pub async fn update_score(
    State(state): State<Arc<AppState>>,
    Json(req): Json<ScoreUpdateRequest>,
) -> Result<Json<SuccessResponse<String>>, (StatusCode, String)> {
    state
        .leaderboard_service
        .update_score(&req)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(SuccessResponse::with_message(
        "Score updated successfully".to_string(),
        "Success".to_string(),
    )))
}

pub async fn calculate_prizes(
    State(state): State<Arc<AppState>>,
    Path(competition_id): Path<String>,
    Json(req): Json<CalculatePrizesRequest>,
) -> Result<Json<SuccessResponse<serde_json::Value>>, (StatusCode, String)> {
    let prizes = state
        .leaderboard_service
        .calculate_prizes(&competition_id, req.prize_pool)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(SuccessResponse::new(
        serde_json::to_value(prizes).unwrap(),
    )))
}

pub async fn distribute_prizes(
    Path(competition_id): Path<String>,
) -> Result<Json<SuccessResponse<String>>, (StatusCode, String)> {
    tracing::info!("Distributing prizes for competition: {}", competition_id);

    Ok(Json(SuccessResponse::with_message(
        format!("Prizes distribution initiated for {}", competition_id),
        "Success".to_string(),
    )))
}
