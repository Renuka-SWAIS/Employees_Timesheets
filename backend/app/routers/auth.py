from fastapi import APIRouter, Depends, HTTPException
from google.auth.transport import requests
from google.oauth2 import id_token
from sqlalchemy.orm import Session

from app.config import settings
from app.database.database import get_db
from app.models.employee import Employee
from app.schemas.auth import (
    GoogleLoginRequest,
    LoginResponse,
    UserResponse,
)
from app.utils.jwt import create_access_token


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post("/google", response_model=LoginResponse)
def google_login(
    request: GoogleLoginRequest,
    db: Session = Depends(get_db),
):
    try:
        idinfo = id_token.verify_oauth2_token(
            request.credential,
            requests.Request(),
            settings.google_client_id,
        )

        email = idinfo.get("email")

        if not email:
            raise HTTPException(
                status_code=401,
                detail="Google account email not found",
            )

    except HTTPException:
        raise

    except Exception as error:
        print("Google token verification failed:", str(error))

        raise HTTPException(
            status_code=401,
            detail="Invalid Google Token",
        )

    employee = (
        db.query(Employee)
        .filter(
            Employee.EmailID == email,
            Employee.Status == "Active",
        )
        .first()
    )

    if not employee:
        raise HTTPException(
            status_code=403,
            detail="Employee not authorized",
        )

    token = create_access_token(
        {
            "employee_id": str(employee.EmployeeID),
            "role": employee.RoleType,
            "email": employee.EmailID,
        }
    )

    return {
        "access_token": token,
        "user": UserResponse(
            EmployeeID=str(employee.EmployeeID),
            EmployeeName=employee.EmployeeName,
            EmailID=employee.EmailID,
            RoleType=employee.RoleType,
            Department=employee.Department,
            Designation=employee.Designation,
        ),
    }