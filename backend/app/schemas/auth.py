from pydantic import BaseModel, EmailStr


class GoogleLoginRequest(BaseModel):
    credential: str


class UserResponse(BaseModel):
    EmployeeID: str
    EmployeeName: str
    EmailID: EmailStr
    RoleType: str
    Department: str
    Designation: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse