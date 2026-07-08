import uuid
import time
from fastapi import APIRouter, Depends, HTTPException
from app.db.redis import redis_client
from app.services.challenge_service import challenge_service
from app.schemas.common import ResponseModel
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter()

@router.post("/start", response_model=ResponseModel[dict])
def start_alarm_session(alarm_id: str, category: str = "math", current_user: User = Depends(get_current_user)):
    session_id = str(uuid.uuid4())
    challenge = challenge_service.get_random_challenge(category=category, difficulty=current_user.profile.difficulty_preference.lower() if current_user.profile else "medium")
    
    if not challenge:
        raise HTTPException(status_code=404, detail="No available challenges for this category")

    session_data = {
        "session_id": session_id,
        "user_id": str(current_user.id),
        "alarm_id": alarm_id,
        "challenge_id": challenge["_id"],
        "correct_answer": str(challenge["correct_answer"]).strip().lower(),
        "start_time": time.time(),
        "attempts": 0,
        "status": "ringing"
    }

    # Save to Redis for 5 minutes (300s)
    redis_client.set_session(session_id, session_data, ttl_seconds=300)

    # Sanitize payload sent to frontend (remove answer)
    challenge_payload = {k: v for k, v in challenge.items() if k != "correct_answer"}
    
    return ResponseModel(message="Alarm session initialized", data={
        "session_id": session_id,
        "challenge": challenge_payload
    })