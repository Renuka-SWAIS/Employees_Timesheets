from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError

from app.utils.jwt import verify_token

security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    token = credentials.credentials

    try:
        payload = verify_token(token)
        return payload

    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token",
        )