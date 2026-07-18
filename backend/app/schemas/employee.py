from pydantic import BaseModel
from uuid import UUID
from typing import Optional


class EmployeeBase(BaseModel):
    EmployeeCode: str
    EmployeeName: str
    EmailID: str
    RoleType: str
    Department: Optional[str] = None
    Designation: Optional[str] = None
    Status: Optional[str] = "Active"


class EmployeeCreate(EmployeeBase):
    pass


class EmployeeResponse(EmployeeBase):
    EmployeeID: UUID

    class Config:
        from_attributes = True