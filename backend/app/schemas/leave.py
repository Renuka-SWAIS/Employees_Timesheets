from pydantic import BaseModel
from uuid import UUID
from datetime import date
from typing import Optional


# ==========================================
# CREATE LEAVE
# EmployeeID comes from URL/JWT
# ==========================================
class LeaveCreate(BaseModel):

    LeaveType: str

    FromDate: date

    ToDate: date

    Reason: Optional[str] = None

    # Full Day / Half Day
    LeaveDuration: str = "Full Day"

    # First Half / Second Half
    # Required only for Half Day
    HalfDaySession: Optional[str] = None


# ==========================================
# UPDATE LEAVE
# ==========================================
class LeaveUpdate(BaseModel):

    LeaveType: Optional[str] = None

    FromDate: Optional[date] = None

    ToDate: Optional[date] = None

    Reason: Optional[str] = None

    LeaveDuration: Optional[str] = None

    HalfDaySession: Optional[str] = None


# ==========================================
# RESPONSE MODEL
# ==========================================
class LeaveResponse(BaseModel):

    LeaveID: UUID

    EmployeeID: UUID

    LeaveType: str

    FromDate: date

    ToDate: date

    TotalDays: float

    Reason: Optional[str] = None

    LeaveDuration: str = "Full Day"

    HalfDaySession: Optional[str] = None

    class Config:
        from_attributes = True