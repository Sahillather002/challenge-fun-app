import json
from typing import Any, Optional, List, Tuple
import redis.asyncio as redis
from app.config import settings

# Global Redis client
_redis_client: Optional[redis.Redis] = None

async def get_redis_client() -> redis.Redis:
    """Get or create Redis client"""
    global _redis_client
    if _redis_client is None:
        _redis_client = redis.from_url(
            settings.REDIS_URL,
            encoding="utf-8",
            decode_responses=True
        )
    return _redis_client

class CacheService:
    def __init__(self, redis_client: redis.Redis):
        self.client = redis_client

    async def set(self, key: str, value: Any, expiration: int = 3600) -> bool:
        """Set a value in cache with expiration in seconds"""
        try:
            data = json.dumps(value, default=str)
            await self.client.setex(key, expiration, data)
            return True
        except Exception as e:
            print(f"Cache set error: {e}")
            return False

    async def get(self, key: str) -> Optional[Any]:
        """Get a value from cache"""
        try:
            data = await self.client.get(key)
            if data:
                return json.loads(data)
            return None
        except Exception as e:
            print(f"Cache get error: {e}")
            return None

    async def delete(self, key: str) -> bool:
        """Delete a key from cache"""
        try:
            await self.client.delete(key)
            return True
        except Exception as e:
            print(f"Cache delete error: {e}")
            return False

    async def exists(self, key: str) -> bool:
        """Check if key exists"""
        try:
            return bool(await self.client.exists(key))
        except Exception as e:
            print(f"Cache exists error: {e}")
            return False

    async def zadd(self, key: str, score: float, member: str) -> bool:
        """Add member to sorted set"""
        try:
            await self.client.zadd(key, {member: score})
            return True
        except Exception as e:
            print(f"Cache zadd error: {e}")
            return False

    async def zrevrange_withscores(
        self, key: str, start: int, stop: int
    ) -> List[Tuple[str, float]]:
        """Get range from sorted set in reverse order with scores"""
        try:
            result = await self.client.zrevrange(key, start, stop, withscores=True)
            return [(member, score) for member, score in result]
        except Exception as e:
            print(f"Cache zrevrange error: {e}")
            return []

    async def zrevrank(self, key: str, member: str) -> Optional[int]:
        """Get reverse rank of member in sorted set"""
        try:
            rank = await self.client.zrevrank(key, member)
            return rank
        except Exception as e:
            print(f"Cache zrevrank error: {e}")
            return None

    async def zscore(self, key: str, member: str) -> Optional[float]:
        """Get score of member in sorted set"""
        try:
            score = await self.client.zscore(key, member)
            return score
        except Exception as e:
            print(f"Cache zscore error: {e}")
            return None

    async def zcard(self, key: str) -> int:
        """Get cardinality of sorted set"""
        try:
            count = await self.client.zcard(key)
            return count or 0
        except Exception as e:
            print(f"Cache zcard error: {e}")
            return 0

    async def publish(self, channel: str, message: Any) -> bool:
        """Publish message to channel"""
        try:
            data = json.dumps(message, default=str)
            await self.client.publish(channel, data)
            return True
        except Exception as e:
            print(f"Cache publish error: {e}")
            return False
