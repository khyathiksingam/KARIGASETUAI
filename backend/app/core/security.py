"""Security utilities for JWT token creation, validation, and OTP generation."""
import hashlib
import random
import hmac
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.core.config import settings

security_bearer = HTTPBearer(auto_error=False)

def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """Create a signed JWT access token."""
    to_encode = data.copy()
    now = datetime.now(timezone.utc)
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire, "iat": now})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    """Decode and validate a JWT access token."""
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except (jwt.PyJWTError, Exception):
        return None

def generate_six_digit_otp() -> str:
    """Generate a random 6-digit numeric OTP code."""
    return f"{random.randint(100000, 999999)}"

def hash_otp(otp: str, salt: str = "karigasetu_salt") -> str:
    """Hash an OTP for secure comparison."""
    return hashlib.sha256(f"{otp}:{salt}".encode("utf-8")).hexdigest()

def verify_otp_hash(otp: str, hashed: str, salt: str = "karigasetu_salt") -> bool:
    """Verify an entered OTP against the stored hash."""
    test_hash = hash_otp(otp, salt)
    return hmac.compare_digest(test_hash, hashed)

def get_current_token_payload(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_bearer)) -> Dict[str, Any]:
    """Dependency to retrieve and authenticate JWT token payload."""
    if not credentials or not credentials.credentials:
        # For development/demo mode convenience, allow fallback demo user if no token provided
        return {"sub": "user-seller-demo", "role": "SELLER", "email": "savita@example.com"}
    
    payload = decode_access_token(credentials.credentials)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return payload
