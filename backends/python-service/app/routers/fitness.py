from fastapi import APIRouter, HTTPException, Query
from app.models.types import FitnessSyncRequest, SuccessResponse
from app.services.cache import CacheService, get_redis_client
from app.services.fitness import FitnessService

router = APIRouter()

@router.post("/fitness/sync", response_model=SuccessResponse)
async def sync_fitness_data(req: FitnessSyncRequest):
    """Sync fitness data from external sources"""
    try:
        redis_client = await get_redis_client()
        cache_service = CacheService(redis_client)
        fitness_service = FitnessService(cache_service)
        
        await fitness_service.sync_fitness_data(req)
        
        return SuccessResponse(
            success=True,
            message="Fitness data synced successfully"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/fitness/stats/{user_id}", response_model=SuccessResponse)
async def get_user_stats(
    user_id: str,
    competition_id: str = Query(..., description="Competition ID")
):
    """Get user fitness statistics"""
    try:
        redis_client = await get_redis_client()
        cache_service = CacheService(redis_client)
        fitness_service = FitnessService(cache_service)
        
        stats = await fitness_service.get_user_stats(user_id, competition_id)
        
        return SuccessResponse(
            success=True,
            data=stats.dict()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
