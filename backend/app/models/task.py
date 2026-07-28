from sqlalchemy import Column, String, Date, Numeric, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid

from app.database.database import Base


class Task(Base):
    __tablename__ = "task_master"

    TaskID = Column(
        "taskid",
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    TaskCode = Column(
        "taskcode",
        String(30),
        unique=True,
        nullable=False,
    )

    TaskName = Column(
        "taskname",
        String(255),
        nullable=False,
    )

    StartDate = Column(
        "startdate",
        Date,
        nullable=False,
    )

    EndDate = Column(
        "enddate",
        Date,
        nullable=False,
    )

    ApprovedHours = Column(
        "approvedhours",
        Numeric(10, 2),
        nullable=False,
        default=0,
    )

    CreatedDate = Column(
        "createddate",
        DateTime(timezone=True),
        server_default=func.now(),
    )

    ModifiedDate = Column(
        "modifieddate",
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )