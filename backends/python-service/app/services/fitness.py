from datetime import datetime
from app.models.types import FitnessData, FitnessSyncRequest
from app.services.cache import CacheService

class FitnessService:
    def __init__(self, cache: CacheService):
        self.cache = cache

    async def sync_fitness_data(self, req: FitnessSyncRequest) -> bool:
        """Sync fitness data from external sources"""
        fitness_key = f"fitness:{req.user_id}:{req.competition_id}:{req.date.strftime('%Y-%m-%d')}"
        
        fitness_data = FitnessData(
            id=f"{req.user_id}-{req.competition_id}-{int(req.date.timestamp())}",
            user_id=req.user_id,
            competition_id=req.competition_id,
            steps=req.steps,
            distance=req.distance,
            calories=req.calories,
            active_minutes=req.active_minutes,
            source=req.source,
            date=req.date,
            synced_at=datetime.utcnow(),
            created_at=datetime.utcnow()
        )
        
        await self.cache.set(fitness_key, fitness_data.dict(), 2592000)  # 30 days
        
        # Update aggregated stats
        await self._update_aggregated_stats(
            req.user_id,
            req.competition_id,
            fitness_data
        )
        
        return True

    async def get_user_stats(
        self, user_id: str, competition_id: str
    ) -> FitnessData:
        """Get aggregated fitness statistics for a user"""
        stats_key = f"fitness_stats:{user_id}:{competition_id}"
        
        stats = await self.cache.get(stats_key)
        
        if not stats:
            return FitnessData(
                id="",
                user_id=user_id,
                competition_id=competition_id,
                steps=0,
                distance=0.0,
                calories=0.0,
                active_minutes=0,
                source="",
                date=datetime.utcnow(),
                synced_at=datetime.utcnow(),
                created_at=datetime.utcnow()
            )
        
        return FitnessData(**stats)

    async def _update_aggregated_stats(
        self, user_id: str, competition_id: str, new_data: FitnessData
    ):
        """Update aggregated statistics for a user in a competition"""
        stats_key = f"fitness_stats:{user_id}:{competition_id}"
        
        current_stats = await self.cache.get(stats_key)
        
        if not current_stats:
            current_stats = {
                "id": "",
                "user_id": user_id,
                "competition_id": competition_id,
                "steps": 0,
                "distance": 0.0,
                "calories": 0.0,
                "active_minutes": 0,
                "source": new_data.source,
                "date": datetime.utcnow().isoformat(),
                "synced_at": datetime.utcnow().isoformat(),
                "created_at": datetime.utcnow().isoformat()
            }
        
        # Update aggregated values
        current_stats["steps"] += new_data.steps
        current_stats["distance"] += new_data.distance
        current_stats["calories"] += new_data.calories
        current_stats["active_minutes"] += new_data.active_minutes
        current_stats["synced_at"] = datetime.utcnow().isoformat()
        current_stats["source"] = new_data.source
        
        await self.cache.set(stats_key, current_stats, 2592000)  # 30 days
