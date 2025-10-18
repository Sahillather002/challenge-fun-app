use axum::{
    extract::{
        ws::{Message, WebSocket},
        Path, Query, State, WebSocketUpgrade,
    },
    response::Response,
};
use serde::Deserialize;
use std::sync::Arc;
use crate::handlers::AppState;

#[derive(Deserialize)]
pub struct WsQuery {
    token: String,
}

pub async fn websocket_handler(
    ws: WebSocketUpgrade,
    State(_state): State<Arc<AppState>>,
    Path(competition_id): Path<String>,
    Query(params): Query<WsQuery>,
) -> Response {
    tracing::info!("WebSocket connection for competition: {}", competition_id);
    
    // TODO: Validate JWT token from params.token
    
    ws.on_upgrade(move |socket| handle_socket(socket, competition_id))
}

async fn handle_socket(mut socket: WebSocket, _competition_id: String) {
    // Send initial message
    if socket
        .send(Message::Text(
            r#"{"type":"connected","message":"Welcome to leaderboard updates"}"#.to_string(),
        ))
        .await
        .is_err()
    {
        return;
    }

    // Handle incoming messages
    while let Some(msg) = socket.recv().await {
        let msg = if let Ok(msg) = msg {
            msg
        } else {
            return;
        };

        match msg {
            Message::Text(t) => {
                tracing::debug!("Received text message: {}", t);
                // Echo back for now
                if socket.send(Message::Text(t)).await.is_err() {
                    return;
                }
            }
            Message::Close(_) => {
                tracing::info!("WebSocket closed");
                return;
            }
            _ => {}
        }
    }
}
