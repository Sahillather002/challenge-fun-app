use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct User {
    pub id: String,
    pub email: String,
    pub name: String,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Competition {
    pub id: String,
    pub name: String,
    pub description: String,
    pub entry_fee: f64,
    pub prize_pool: f64,
    pub start_date: DateTime<Utc>,
    pub end_date: DateTime<Utc>,
    pub status: String,
    #[serde(rename = "type")]
    pub competition_type: String,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LeaderboardEntry {
    pub user_id: String,
    pub user_name: String,
    pub competition_id: String,
    pub score: i64,
    pub rank: i32,
    pub steps: i64,
    pub distance: f64,
    pub calories: f64,
    pub last_synced_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Leaderboard {
    pub competition_id: String,
    pub entries: Vec<LeaderboardEntry>,
    pub total_count: i32,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FitnessData {
    pub id: String,
    pub user_id: String,
    pub competition_id: String,
    pub steps: i64,
    pub distance: f64,
    pub calories: f64,
    pub active_minutes: i32,
    pub source: String,
    pub date: DateTime<Utc>,
    pub synced_at: DateTime<Utc>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FitnessSyncRequest {
    pub user_id: String,
    pub competition_id: String,
    pub steps: i64,
    pub distance: f64,
    pub calories: f64,
    pub active_minutes: i32,
    #[serde(default = "default_source")]
    pub source: String,
    pub date: DateTime<Utc>,
}

fn default_source() -> String {
    "google_fit".to_string()
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ScoreUpdateRequest {
    pub user_id: String,
    pub competition_id: String,
    pub steps: i64,
    pub distance: f64,
    pub calories: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Prize {
    pub id: String,
    pub competition_id: String,
    pub user_id: String,
    pub rank: i32,
    pub amount: f64,
    pub status: String,
    pub distributed_at: Option<DateTime<Utc>>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PrizeDistribution {
    pub rank_1_percentage: f64,
    pub rank_2_percentage: f64,
    pub rank_3_percentage: f64,
}

impl Default for PrizeDistribution {
    fn default() -> Self {
        Self {
            rank_1_percentage: 0.60,
            rank_2_percentage: 0.30,
            rank_3_percentage: 0.10,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WebSocketMessage {
    #[serde(rename = "type")]
    pub message_type: String,
    pub data: serde_json::Value,
    pub timestamp: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ErrorResponse {
    pub error: String,
    pub message: String,
    pub code: u16,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SuccessResponse<T> {
    pub success: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub data: Option<T>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub message: Option<String>,
}

impl<T> SuccessResponse<T> {
    pub fn new(data: T) -> Self {
        Self {
            success: true,
            data: Some(data),
            message: None,
        }
    }

    pub fn with_message(data: T, message: String) -> Self {
        Self {
            success: true,
            data: Some(data),
            message: Some(message),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CalculatePrizesRequest {
    pub prize_pool: f64,
}
