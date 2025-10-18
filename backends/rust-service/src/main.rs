mod config;
mod handlers;
mod middleware;
mod models;
mod services;
mod utils;

use axum::{
    routing::{get, post},
    Router,
};
use std::net::SocketAddr;
use tower_http::cors::{Any, CorsLayer};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

#[tokio::main]
async fn main() {
    // Initialize tracing
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "info".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    // Load configuration
    let config = config::Config::from_env().expect("Failed to load configuration");

    // Initialize services
    let redis_client = services::cache::create_redis_client(&config.redis_url)
        .await
        .expect("Failed to connect to Redis");
    
    let cache_service = services::cache::CacheService::new(redis_client.clone());
    let leaderboard_service = services::leaderboard::LeaderboardService::new(
        cache_service.clone(),
        redis_client.clone(),
    );
    let fitness_service = services::fitness::FitnessService::new(
        cache_service.clone(),
        config.supabase_url.clone(),
    );

    // Create shared state
    let state = std::sync::Arc::new(handlers::AppState {
        config: config.clone(),
        leaderboard_service,
        fitness_service,
    });

    // Configure CORS
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    // Build router
    let app = Router::new()
        // Health check
        .route("/health", get(handlers::health_check))
        
        // API routes
        .route("/api/v1/leaderboard/:competition_id", 
            get(handlers::leaderboard::get_leaderboard))
        .route("/api/v1/leaderboard/update", 
            post(handlers::leaderboard::update_score))
        .route("/api/v1/prizes/calculate/:competition_id", 
            post(handlers::leaderboard::calculate_prizes))
        .route("/api/v1/prizes/distribute/:competition_id", 
            post(handlers::leaderboard::distribute_prizes))
        
        // Fitness routes
        .route("/api/v1/fitness/sync", 
            post(handlers::fitness::sync_fitness_data))
        .route("/api/v1/fitness/stats/:user_id", 
            get(handlers::fitness::get_user_stats))
        
        // WebSocket route
        .route("/ws/leaderboard/:competition_id", 
            get(handlers::websocket::websocket_handler))
        
        .layer(cors)
        .with_state(state);

    // Start server
    let addr = SocketAddr::from(([0, 0, 0, 0], config.port));
    tracing::info!("Server listening on {}", addr);

    let listener = tokio::net::TcpListener::bind(addr)
        .await
        .expect("Failed to bind to address");

    axum::serve(listener, app)
        .await
        .expect("Server failed");
}
