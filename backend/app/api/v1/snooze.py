from fastapi import APIRouter, HTTPException, Depends
from app.db.redis import redis_client
from app.services.snooze_service import snooze_service
from app.schemas.common import ResponseModel
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter()

@router.post("/snooze", response_model=ResponseModel[dict])
def snooze_alarm(session_id: str, current_user: User = Depends(get_current_user)):
    session = redis_client.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session expired")

    snooze_count = session.get("snooze_count", 0) + 1
    penalty = snooze_service.calculate_snooze_penalty("medium", snooze_count)

    if not penalty["snooze_allowed"]:
        raise HTTPException(status_code=400, detail="Snooze limit reached! You MUST solve the challenge now.")

    session["snooze_count"] = snooze_count
    session["status"] = "snoozed"
    redis_client.set_session(session_id, session, ttl_seconds=300)

    return ResponseModel(message=f"Alarm snoozed ({snooze_count}/3). Difficulty escalated to {penalty['new_difficulty']}!", data=penalty)