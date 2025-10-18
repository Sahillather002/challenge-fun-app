from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query
from typing import Dict, Set
import json
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

# Store active connections by competition ID
active_connections: Dict[str, Set[WebSocket]] = {}

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, Set[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, competition_id: str):
        await websocket.accept()
        if competition_id not in self.active_connections:
            self.active_connections[competition_id] = set()
        self.active_connections[competition_id].add(websocket)
        logger.info(f"Client connected to competition {competition_id}")

    def disconnect(self, websocket: WebSocket, competition_id: str):
        if competition_id in self.active_connections:
            self.active_connections[competition_id].discard(websocket)
            if not self.active_connections[competition_id]:
                del self.active_connections[competition_id]
        logger.info(f"Client disconnected from competition {competition_id}")

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast_to_competition(self, message: dict, competition_id: str):
        if competition_id in self.active_connections:
            message_str = json.dumps(message)
            for connection in self.active_connections[competition_id]:
                try:
                    await connection.send_text(message_str)
                except Exception as e:
                    logger.error(f"Error broadcasting message: {e}")

manager = ConnectionManager()

@router.websocket("/leaderboard/{competition_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    competition_id: str,
    token: str = Query(...)
):
    """WebSocket endpoint for real-time leaderboard updates"""
    # TODO: Validate JWT token
    
    await manager.connect(websocket, competition_id)
    
    try:
        # Send welcome message
        await manager.send_personal_message(
            json.dumps({
                "type": "connected",
                "message": f"Connected to leaderboard updates for competition {competition_id}"
            }),
            websocket
        )
        
        # Keep connection alive and handle incoming messages
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            # Handle different message types
            if message.get("type") == "ping":
                await manager.send_personal_message(
                    json.dumps({"type": "pong"}),
                    websocket
                )
            elif message.get("type") == "subscribe":
                # Handle subscription
                pass
            
    except WebSocketDisconnect:
        manager.disconnect(websocket, competition_id)
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        manager.disconnect(websocket, competition_id)
