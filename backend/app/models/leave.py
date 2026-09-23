from sqlalchemy import Column, String, Float, Date, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func

from app.database.database import Base


class Leave(Base):
    __tablename__ = "employee_leaves"

    LeaveID = Column(
        "leaveid",
        UUID(as_uuid=True),
        primary_key=True
    )

    EmployeeID = Column(
        "employeeid",
        UUID(as_uuid=True),
        nullable=False
    )

    LeaveType = Column(
        "leavetype",
        String(50),
        nullable=False
    )

    FromDate = Column(
        "fromdate",
        Date,
        nullable=False
    )

    ToDate = Column(
        "todate",
        Date,
        nullable=False
    )

    TotalDays = Column(
        "totaldays",
        Float,
        nullable=False
    )

    # Half Day support
    # NULL for Full Day leave
    # "First Half" / "Second Half" for Half Day leave
    HalfDaySession = Column(
        "halfdaysession",
        String(20),
        nullable=True
    )

    Reason = Column(
        "reason",
        String(500)
    )

    CreatedDate = Column(
        "createddate",
        TIMESTAMP,
        server_default=func.now()
    )

    ModifiedDate = Column(
        "modifieddate",
        TIMESTAMP,
        server_default=func.now(),
        onupdate=func.now()
    )