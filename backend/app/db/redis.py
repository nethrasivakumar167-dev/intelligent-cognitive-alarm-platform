import redis
import json
from app.core.config import settings

class RedisClient:
    def __init__(self):
        self.r = redis.Redis.from_url(settings.REDIS_URL, decode_responses=True)

    def set_session(self, session_id: str, data: dict, ttl_seconds: int = 300):
        self.r.setex(f"session:{session_id}", ttl_seconds, json.dumps(data))

    def get_session(self, session_id: str) -> dict | None:
        val = self.r.get(f"session:{session_id}")
        return json.loads(val) if val else None

    def delete_session(self, session_id: str):
        self.r.delete(f"session:{session_id}")

redis_client = RedisClient()