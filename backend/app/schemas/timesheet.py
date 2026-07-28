from pydantic import BaseModel
from uuid import UUID
from datetime import date
from typing import Optional


# ==========================================
# CREATE TIMESHEET
# EmployeeID comes from JWT login
# ==========================================
class TimesheetCreate(BaseModel):
    WorkDate: date
    Month: int
    Year: int
    TaskID: UUID
    Project: str
    TaskDescription: str
    HoursWorked: float
    Remarks: Optional[str] = None


# ==========================================
# UPDATE TIMESHEET
# EmployeeID cannot be changed
# ==========================================
class TimesheetUpdate(BaseModel):
    WorkDate: Optional[date] = None
    Month: Optional[int] = None
    Year: Optional[int] = None
    TaskID: Optional[UUID] = None
    Project: Optional[str] = None
    TaskDescription: Optional[str] = None
    HoursWorked: Optional[float] = None
    Remarks: Optional[str] = None


# ==========================================
# RESPONSE MODEL
# ==========================================
class TimesheetResponse(BaseModel):
    EntryID: UUID
    EmployeeID: UUID
    WorkDate: date
    Month: int
    Year: int
    TaskID: UUID
    Project: str
    TaskDescription: str
    HoursWorked: float
    Remarks: Optional[str] = None

    class Config:
        from_attributes = True