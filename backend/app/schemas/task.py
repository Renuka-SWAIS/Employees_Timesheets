from datetime import date
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel


class TaskCreate(BaseModel):
    TaskCode: str
    TaskName: str
    StartDate: date
    EndDate: date
    ApprovedHours: Decimal


class TaskUpdate(BaseModel):
    TaskCode: str | None = None
    TaskName: str | None = None
    StartDate: date | None = None
    EndDate: date | None = None
    ApprovedHours: Decimal | None = None


class TaskResponse(BaseModel):
    TaskID: UUID
    TaskCode: str
    TaskName: str
    StartDate: date
    EndDate: date
    ApprovedHours: Decimal

    class Config:
        from_attributes = True