from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import uuid4

from app.database.database import get_db
from app.models.timesheet import Timesheet
from app.schemas.timesheet import TimesheetCreate, TimesheetUpdate
from app.utils.dependencies import get_current_user


router = APIRouter(
    prefix="/timesheet",
    tags=["Timesheet"]
)


# ==========================================
# Get All Timesheets
# ==========================================
@router.get("/")
def get_timesheets(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):

    # Admin -> All employees' timesheets
    if current_user["role"] == "Admin":
        return db.query(Timesheet).all()

    # Employee -> Only own timesheets
    return (
        db.query(Timesheet)
        .filter(
            Timesheet.EmployeeID == current_user["employee_id"]
        )
        .all()
    )


# ==========================================
# Get Timesheets of One Employee (Admin)
# ==========================================
@router.get("/employee/{employee_id}")
def get_employee_timesheets(
    employee_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):

    if current_user["role"] != "Admin":
        raise HTTPException(
            status_code=403,
            detail="Only Admin can view employee timesheets"
        )

    return (
        db.query(Timesheet)
        .filter(
            Timesheet.EmployeeID == employee_id
        )
        .order_by(
            Timesheet.WorkDate.desc()
        )
        .all()
    )


# ==========================================
# Get Single Timesheet
# ==========================================
@router.get("/{entry_id}")
def get_timesheet(
    entry_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):

    timesheet = (
        db.query(Timesheet)
        .filter(
            Timesheet.EntryID == entry_id
        )
        .first()
    )

    if not timesheet:
        raise HTTPException(
            status_code=404,
            detail="Timesheet not found"
        )

    # Employee can view only own timesheet
    if (
        current_user["role"] != "Admin"
        and str(timesheet.EmployeeID)
        != current_user["employee_id"]
    ):
        raise HTTPException(
            status_code=403,
            detail="Access Denied"
        )

    return timesheet


# ==========================================
# Create Timesheet
# ==========================================
@router.post("/")
def create_timesheet(
    timesheet: TimesheetCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):

    employee_id = current_user["employee_id"]

    new_entry = Timesheet(
        EntryID=uuid4(),
        EmployeeID=employee_id,
        TaskID=timesheet.TaskID,
        WorkDate=timesheet.WorkDate,
        Month=timesheet.WorkDate.month,
        Year=timesheet.WorkDate.year,
        Project=timesheet.Project,
        TaskDescription=timesheet.TaskDescription,
        HoursWorked=timesheet.HoursWorked,
        Remarks=timesheet.Remarks,
        CreatedBy=current_user["email"],
        ModifiedBy=current_user["email"],
    )

    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)

    return {
        "message": "Timesheet created successfully",
        "EntryID": str(new_entry.EntryID),
    }


# ==========================================
# Update Timesheet
# ==========================================
@router.put("/{entry_id}")
def update_timesheet(
    entry_id: str,
    data: TimesheetUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):

    timesheet = (
        db.query(Timesheet)
        .filter(
            Timesheet.EntryID == entry_id
        )
        .first()
    )

    if not timesheet:
        raise HTTPException(
            status_code=404,
            detail="Timesheet not found"
        )

    # ==========================================
    # Employee can edit only own timesheet
    # Admin can edit any employee timesheet
    # ==========================================
    if (
        current_user["role"] != "Admin"
        and str(timesheet.EmployeeID)
        != current_user["employee_id"]
    ):
        raise HTTPException(
            status_code=403,
            detail="Access Denied"
        )

    # ==========================================
    # Employee can edit only current month
    # Admin can edit any month
    # ==========================================
    if current_user["role"] != "Admin":

        today = date.today()

        # Existing timesheet must belong to current month
        if (
            timesheet.WorkDate.month != today.month
            or timesheet.WorkDate.year != today.year
        ):
            raise HTTPException(
                status_code=403,
                detail="Past month timesheets cannot be edited"
            )

        # ==========================================
        # If WorkDate is changed,
        # new date must also be in current month
        # ==========================================
        if "WorkDate" in data.model_dump(
            exclude_unset=True
        ):

            new_work_date = data.WorkDate

            if (
                new_work_date.month != today.month
                or new_work_date.year != today.year
            ):
                raise HTTPException(
                    status_code=403,
                    detail="Timesheet date must remain in the current month"
                )

    # ==========================================
    # Update fields
    # ==========================================
    update_data = data.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(
            timesheet,
            key,
            value
        )

    # ==========================================
    # Update Month / Year when WorkDate changes
    # ==========================================
    if "WorkDate" in update_data:

        timesheet.Month = (
            timesheet.WorkDate.month
        )

        timesheet.Year = (
            timesheet.WorkDate.year
        )

    # ==========================================
    # Modified By
    # ==========================================
    timesheet.ModifiedBy = (
        current_user["email"]
    )

    db.commit()
    db.refresh(timesheet)

    return {
        "message": "Timesheet updated successfully"
    }


# ==========================================
# Delete Timesheet
# ==========================================
@router.delete("/{entry_id}")
def delete_timesheet(
    entry_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):

    timesheet = (
        db.query(Timesheet)
        .filter(
            Timesheet.EntryID == entry_id
        )
        .first()
    )

    if not timesheet:
        raise HTTPException(
            status_code=404,
            detail="Timesheet not found"
        )

    # Employee can delete only own timesheet
    # Admin can delete any timesheet
    if (
        current_user["role"] != "Admin"
        and str(timesheet.EmployeeID)
        != current_user["employee_id"]
    ):
        raise HTTPException(
            status_code=403,
            detail="Access Denied"
        )

    db.delete(timesheet)
    db.commit()

    return {
        "message": "Timesheet deleted successfully"
    }