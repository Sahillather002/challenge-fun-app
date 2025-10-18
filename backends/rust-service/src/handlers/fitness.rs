use crate::handlers::AppState;
use crate::models::{FitnessSyncRequest, SuccessResponse};
use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    Json,
};
use serde::Deserialize;
use std::sync::Arc;

#[derive(Deserialize)]
pub struct FitnessQuery {
    competition_id: String,
}

pub async fn sync_fitness_data(
    State(state): State<Arc<AppState>>,
    Json(req): Json<FitnessSyncRequest>,
) -> Result<Json<SuccessResponse<String>>, (StatusCode, String)> {
    state
        .fitness_service
        .sync_fitness_data(&req)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(SuccessResponse::with_message(
        "Fitness data synced successfully".to_string(),
        "Success".to_string(),
    )))
}

pub async fn get_user_stats(
    State(state): State<Arc<AppState>>,
    Path(user_id): Path<String>,
    Query(params): Query<FitnessQuery>,
) -> Result<Json<SuccessResponse<serde_json::Value>>, (StatusCode, String)> {
    let stats = state
        .fitness_service
        .get_user_stats(&user_id, &params.competition_id)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(SuccessResponse::new(
        serde_json::to_value(stats).unwrap(),
    )))
}
