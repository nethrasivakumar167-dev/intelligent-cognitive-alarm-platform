from datetime import datetime, timedelta
from typing import Optional, Any
import jwt
from passlib.context import CryptContext
import hashlib
from app.core.config import settings

pwd_context = CryptContext(schemes=["pbkdf2_sha256", "bcrypt"], deprecated="auto")

# bcrypt has a 72-byte input limit; consistently truncate on the byte level
# so hashing and verification use the same input.
_BCRYPT_MAX_BYTES = 72

def _prepare_password(password: str) -> str:
    """Prepare password for bcrypt: if password (in bytes) exceeds
    bcrypt's 72-byte limit, return its SHA-256 hex digest instead. This
    preserves entropy while avoiding truncation issues and backend bugs.
    """
    b = password.encode("utf-8")
    if len(b) <= _BCRYPT_MAX_BYTES:
        return password
    return hashlib.sha256(b).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(_prepare_password(plain_password), hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(_prepare_password(password))

def create_access_token(subject: str | Any, expires_delta: Optional[timedelta] = None) -> str:
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt