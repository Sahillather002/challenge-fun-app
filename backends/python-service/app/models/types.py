from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class User(BaseModel):
    id: str
    email: str
    name: str
    created_at: datetime

class Competition(BaseModel):
    id: str
    name: str
    description: str
    entry_fee: float
    prize_pool: float
    start_date: datetime
    end_date: datetime
    status: str
    type: str = Field(..., alias="competition_type")
    created_at: datetime

class LeaderboardEntry(BaseModel):
    user_id: str
    user_name: str
    competition_id: str
    score: int
    rank: int
    steps: int
    distance: float
    calories: float
    last_synced_at: datetime
    updated_at: datetime

class Leaderboard(BaseModel):
    competition_id: str
    entries: List[LeaderboardEntry]
    total_count: int
    updated_at: datetime

class FitnessData(BaseModel):
    id: str
    user_id: str
    competition_id: str
    steps: int
    distance: float
    calories: float
    active_minutes: int
    source: str
    date: datetime
    synced_at: datetime
    created_at: datetime

class FitnessSyncRequest(BaseModel):
    user_id: str
    competition_id: str
    steps: int
    distance: float
    calories: float
    active_minutes: int
    source: str = "google_fit"
    date: datetime

class ScoreUpdateRequest(BaseModel):
    user_id: str
    competition_id: str
    steps: int
    distance: float
    calories: float

class Prize(BaseModel):
    id: str
    competition_id: str
    user_id: str
    rank: int
    amount: float
    status: str
    distributed_at: Optional[datetime] = None
    created_at: datetime

class PrizeDistribution(BaseModel):
    rank_1_percentage: float = 0.60
    rank_2_percentage: float = 0.30
    rank_3_percentage: float = 0.10

class CalculatePrizesRequest(BaseModel):
    prize_pool: float

class WebSocketMessage(BaseModel):
    type: str
    data: dict
    timestamp: datetime

class ErrorResponse(BaseModel):
    error: str
    message: str
    code: int

class SuccessResponse(BaseModel):
    success: bool = True
    data: Optional[dict] = None
    message: Optional[str] = None
