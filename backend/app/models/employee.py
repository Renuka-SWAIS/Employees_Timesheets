from sqlalchemy import Column, String, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func

from app.database.database import Base


class Employee(Base):
    __tablename__ = "employee_master"

    EmployeeID = Column("employeeid", UUID(as_uuid=True), primary_key=True)
    EmployeeCode = Column("employeecode", String(20), unique=True, nullable=False)
    EmployeeName = Column("employeename", String(100), nullable=False)
    EmailID = Column("emailid", String(150), unique=True, nullable=False)
    RoleType = Column("roletype", String(20), nullable=False)
    Department = Column("department", String(100))
    Designation = Column("designation", String(100))
    Status = Column("status", String(20), default="Active")

    # NEW
    PhotoURL = Column("photourl", String(255), nullable=True)

    CreatedDate = Column("createddate", TIMESTAMP, server_default=func.now())
    ModifiedDate = Column(
        "modifieddate",
        TIMESTAMP,
        server_default=func.now(),
        onupdate=func.now()
    )