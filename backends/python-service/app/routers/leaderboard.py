from fastapi import APIRouter, HTTPException, Query
from app.models.types import (
    Leaderboard,
    ScoreUpdateRequest,
    CalculatePrizesRequest,
    SuccessResponse
)
from app.services.cache import CacheService, get_redis_client
from app.services.leaderboard import LeaderboardService

router = APIRouter()

@router.get("/leaderboard/{competition_id}", response_model=SuccessResponse)
async def get_leaderboard(
    competition_id: str,
    limit: int = Query(100, ge=1, le=1000)
):
    """Get leaderboard for a competition"""
    try:
        redis_client = await get_redis_client()
        cache_service = CacheService(redis_client)
        leaderboard_service = LeaderboardService(cache_service)
        
        leaderboard = await leaderboard_service.get_leaderboard(
            competition_id, limit
        )
        
        return SuccessResponse(
            success=True,
            data=leaderboard.dict()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/leaderboard/update", response_model=SuccessResponse)
async def update_score(req: ScoreUpdateRequest):
    """Update user score in leaderboard"""
    try:
        redis_client = await get_redis_client()
        cache_service = CacheService(redis_client)
        leaderboard_service = LeaderboardService(cache_service)
        
        await leaderboard_service.update_score(req)
        
        return SuccessResponse(
            success=True,
            message="Score updated successfully"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/prizes/calculate/{competition_id}", response_model=SuccessResponse)
async def calculate_prizes(
    competition_id: str,
    req: CalculatePrizesRequest
):
    """Calculate prize distribution"""
    try:
        redis_client = await get_redis_client()
        cache_service = CacheService(redis_client)
        leaderboard_service = LeaderboardService(cache_service)
        
        prizes = await leaderboard_service.calculate_prizes(
            competition_id, req.prize_pool
        )
        
        return SuccessResponse(
            success=True,
            data={"prizes": [p.dict() for p in prizes]}
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/prizes/distribute/{competition_id}", response_model=SuccessResponse)
async def distribute_prizes(competition_id: str):
    """Distribute prizes to winners"""
    # Mock implementation - integrate with payment gateway
    return SuccessResponse(
        success=True,
        message=f"Prizes distribution initiated for competition {competition_id}"
    )
