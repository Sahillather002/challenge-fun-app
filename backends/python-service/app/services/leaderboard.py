from datetime import datetime
from typing import List
from app.models.types import (
    Leaderboard,
    LeaderboardEntry,
    Prize,
    PrizeDistribution,
    ScoreUpdateRequest
)
from app.services.cache import CacheService

class LeaderboardService:
    def __init__(self, cache: CacheService):
        self.cache = cache

    async def get_leaderboard(self, competition_id: str, limit: int = 100) -> Leaderboard:
        """Get leaderboard for a competition"""
        key = f"leaderboard:{competition_id}"
        
        entries_data = await self.cache.zrevrange_withscores(key, 0, limit - 1)
        
        leaderboard_entries = []
        for i, (user_id, score) in enumerate(entries_data):
            user_details = await self._get_user_details(competition_id, user_id)
            
            if not user_details:
                user_details = {
                    "user_id": user_id,
                    "user_name": "Unknown",
                    "steps": 0,
                    "distance": 0.0,
                    "calories": 0.0,
                    "last_synced_at": datetime.utcnow().isoformat(),
                }
            
            entry = LeaderboardEntry(
                user_id=user_id,
                user_name=user_details.get("user_name", "Unknown"),
                competition_id=competition_id,
                score=int(score),
                rank=i + 1,
                steps=user_details.get("steps", 0),
                distance=user_details.get("distance", 0.0),
                calories=user_details.get("calories", 0.0),
                last_synced_at=datetime.fromisoformat(
                    user_details.get("last_synced_at", datetime.utcnow().isoformat())
                ),
                updated_at=datetime.utcnow()
            )
            leaderboard_entries.append(entry)
        
        total_count = await self.cache.zcard(key)
        
        return Leaderboard(
            competition_id=competition_id,
            entries=leaderboard_entries,
            total_count=total_count,
            updated_at=datetime.utcnow()
        )

    async def update_score(self, req: ScoreUpdateRequest) -> bool:
        """Update user score in leaderboard"""
        key = f"leaderboard:{req.competition_id}"
        score = float(req.steps)
        
        await self.cache.zadd(key, score, req.user_id)
        
        # Store detailed user data
        user_details_key = f"user_details:{req.competition_id}:{req.user_id}"
        user_details = {
            "user_id": req.user_id,
            "competition_id": req.competition_id,
            "score": int(score),
            "steps": req.steps,
            "distance": req.distance,
            "calories": req.calories,
            "last_synced_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat(),
        }
        
        await self.cache.set(user_details_key, user_details, 86400)
        
        # Publish update
        await self._publish_leaderboard_update(req.competition_id, req.user_id, int(score))
        
        return True

    async def calculate_prizes(
        self, competition_id: str, prize_pool: float
    ) -> List[Prize]:
        """Calculate prize distribution for a competition"""
        leaderboard = await self.get_leaderboard(competition_id, 3)
        
        if not leaderboard.entries:
            raise ValueError("No participants in competition")
        
        distribution = PrizeDistribution()
        prizes = []
        
        if len(leaderboard.entries) > 0:
            prizes.append(Prize(
                id=f"prize-{competition_id}-1",
                competition_id=competition_id,
                user_id=leaderboard.entries[0].user_id,
                rank=1,
                amount=prize_pool * distribution.rank_1_percentage,
                status="pending",
                created_at=datetime.utcnow()
            ))
        
        if len(leaderboard.entries) > 1:
            prizes.append(Prize(
                id=f"prize-{competition_id}-2",
                competition_id=competition_id,
                user_id=leaderboard.entries[1].user_id,
                rank=2,
                amount=prize_pool * distribution.rank_2_percentage,
                status="pending",
                created_at=datetime.utcnow()
            ))
        
        if len(leaderboard.entries) > 2:
            prizes.append(Prize(
                id=f"prize-{competition_id}-3",
                competition_id=competition_id,
                user_id=leaderboard.entries[2].user_id,
                rank=3,
                amount=prize_pool * distribution.rank_3_percentage,
                status="pending",
                created_at=datetime.utcnow()
            ))
        
        # Cache prizes
        prizes_key = f"prizes:{competition_id}"
        await self.cache.set(prizes_key, [p.dict() for p in prizes], 604800)
        
        return prizes

    async def _get_user_details(self, competition_id: str, user_id: str):
        """Get user details from cache"""
        key = f"user_details:{competition_id}:{user_id}"
        return await self.cache.get(key)

    async def _publish_leaderboard_update(
        self, competition_id: str, user_id: str, score: int
    ):
        """Publish leaderboard update to Redis pub/sub"""
        channel = f"leaderboard:{competition_id}"
        message = {
            "type": "score_update",
            "competition_id": competition_id,
            "user_id": user_id,
            "score": score,
            "timestamp": datetime.utcnow().isoformat(),
        }
        await self.cache.publish(channel, message)
