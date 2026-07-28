from uuid import UUID, uuid4

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.leave import Leave
from app.schemas.leave import LeaveCreate, LeaveUpdate
from app.utils.dependencies import get_current_user
from app.models.employee import Employee

router = APIRouter(
    prefix="/leaves",
    tags=["Leaves"],
)


# ==========================================
# Get Logged-in User Leaves / All Leaves
# ==========================================
@router.get("/")
def get_leaves(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):

    # Admin -> All leaves with employee details
    if current_user["role"] == "Admin":

        rows = (
            db.query(Leave, Employee)
            .join(
                Employee,
                Leave.EmployeeID == Employee.EmployeeID,
            )
            .order_by(Leave.FromDate.desc())
            .all()
        )

        result = []

        for leave, employee in rows:
            result.append(
                {
                    "LeaveID": leave.LeaveID,
                    "EmployeeID": leave.EmployeeID,
                    "EmployeeName": employee.EmployeeName,
                    "EmployeeCode": employee.EmployeeCode,
                    "LeaveType": leave.LeaveType,
                    "FromDate": leave.FromDate,
                    "ToDate": leave.ToDate,
                    "TotalDays": leave.TotalDays,
                    "Reason": leave.Reason,
                }
            )

        return result

    # Employee -> Only own leaves
    return (
        db.query(Leave)
        .filter(
            Leave.EmployeeID == UUID(current_user["employee_id"])
        )
        .order_by(Leave.FromDate.desc())
        .all()
    )


# ==========================================
# Get Employee Leaves (Admin)
# ==========================================
@router.get("/employee/{employee_id}")
def get_employee_leaves(
    employee_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    if current_user["role"] != "Admin":
        raise HTTPException(
            status_code=403,
            detail="Only Admin can view employee leaves",
        )

    return (
        db.query(Leave)
        .filter(Leave.EmployeeID == UUID(employee_id))
        .order_by(Leave.FromDate.desc())
        .all()
    )


# ==========================================
# Create Leave
# ==========================================
@router.post("/employee/{employee_id}")
def create_leave(
    employee_id: str,
    leave: LeaveCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    try:

        # Employee can create only their own leave
        if (
            current_user["role"] != "Admin"
            and current_user["employee_id"] != employee_id
        ):
            raise HTTPException(
                status_code=403,
                detail="Not authorized to create leave for another employee",
            )

        total_days = (leave.ToDate - leave.FromDate).days + 1

        new_leave = Leave(
            LeaveID=uuid4(),
            EmployeeID=UUID(employee_id),
            LeaveType=leave.LeaveType,
            FromDate=leave.FromDate,
            ToDate=leave.ToDate,
            TotalDays=float(total_days),
            Reason=leave.Reason,
        )

        db.add(new_leave)
        db.commit()
        db.refresh(new_leave)

        return {
            "message": "Leave created successfully",
            "LeaveID": str(new_leave.LeaveID),
        }

    except SQLAlchemyError as e:
        db.rollback()
        print("DATABASE ERROR:", e)
        raise HTTPException(
            status_code=500,
            detail=str(e),
        )


# ==========================================
# Update Leave
# ==========================================
@router.put("/{leave_id}")
def update_leave(
    leave_id: str,
    data: LeaveUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):

    leave = (
        db.query(Leave)
        .filter(Leave.LeaveID == UUID(leave_id))
        .first()
    )

    if not leave:
        raise HTTPException(
            status_code=404,
            detail="Leave not found",
        )

    # Employee can edit only own leave
    if (
        current_user["role"] != "Admin"
        and leave.EmployeeID != UUID(current_user["employee_id"])
    ):
        raise HTTPException(
            status_code=403,
            detail="Not authorized to edit this leave",
        )

    update_data = data.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(leave, key, value)

    if leave.FromDate and leave.ToDate:
        leave.TotalDays = float(
            (leave.ToDate - leave.FromDate).days + 1
        )

    db.commit()
    db.refresh(leave)

    return {
        "message": "Leave updated successfully",
    }


# ==========================================
# Delete Leave
# ==========================================
@router.delete("/{leave_id}")
def delete_leave(
    leave_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):

    leave = (
        db.query(Leave)
        .filter(Leave.LeaveID == UUID(leave_id))
        .first()
    )

    if not leave:
        raise HTTPException(
            status_code=404,
            detail="Leave not found",
        )

    # Employee can delete only own leave
    if (
        current_user["role"] != "Admin"
        and leave.EmployeeID != UUID(current_user["employee_id"])
    ):
        raise HTTPException(
            status_code=403,
            detail="Not authorized to delete this leave",
        )

    db.delete(leave)
    db.commit()

    return {
        "message": "Leave deleted successfully",
    }