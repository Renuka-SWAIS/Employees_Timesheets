from sqlalchemy import Column, String, Integer, Float, Date, TIMESTAMP ,ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func

from app.database.database import Base


class Timesheet(Base):
    __tablename__ = "timesheet"

    EntryID = Column("entryid", UUID(as_uuid=True), primary_key=True)

    EmployeeID = Column("employeeid", UUID(as_uuid=True), nullable=False)

    TaskID = Column(
    "taskid",
    UUID(as_uuid=True),
    ForeignKey("task_master.taskid"),
    nullable=True,)
                   

    WorkDate = Column("workdate", Date, nullable=False)

    Month = Column("month", Integer, nullable=False)

    Year = Column("year", Integer, nullable=False)

    Project = Column("project", String(100))

    TaskDescription = Column("taskdescription", String(500))

    HoursWorked = Column("hoursworked", Float)

    Remarks = Column("remarks", String(500))

    CreatedBy = Column("createdby", String(100))

    ModifiedBy = Column("modifiedby", String(100))

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