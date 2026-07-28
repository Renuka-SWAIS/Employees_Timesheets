from uuid import UUID, uuid4

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database.database import get_db
from app.models.task import Task
from app.models.timesheet import Timesheet
from app.schemas.task import TaskCreate, TaskUpdate
from app.utils.dependencies import get_current_user

router = APIRouter(
    prefix="/tasks",
    tags=["Tasks"],
)


# ==========================================
# Get All Tasks
# ==========================================
@router.get("/")
def get_tasks(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):

    tasks = (
        db.query(Task)
        .order_by(Task.TaskCode)
        .all()
    )

    result = []

    for task in tasks:

        spent = (
            db.query(
                func.coalesce(
                    func.sum(Timesheet.HoursWorked),
                    0,
                )
            )
            .filter(
                Timesheet.TaskID == task.TaskID
            )
            .scalar()
        )

        result.append({

            "TaskID": task.TaskID,
            "TaskCode": task.TaskCode,
            "TaskName": task.TaskName,
            "StartDate": task.StartDate,
            "EndDate": task.EndDate,

            "ApprovedHours": float(task.ApprovedHours),

            "HoursSpent": float(spent),

            "RemainingHours": float(task.ApprovedHours) - float(spent),

        })

    return result


# ==========================================
# Get Single Task
# ==========================================
@router.get("/{task_id}")
def get_task(
    task_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):

    task = (
        db.query(Task)
        .filter(Task.TaskID == UUID(task_id))
        .first()
    )

    if not task:
        raise HTTPException(
            status_code=404,
            detail="Task not found",
        )

    return task


# ==========================================
# Create Task
# ==========================================
@router.post("/")
def create_task(
    data: TaskCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):

    if current_user["role"] != "Admin":
        raise HTTPException(
            status_code=403,
            detail="Only Admin can create tasks",
        )

    existing = (
        db.query(Task)
        .filter(Task.TaskCode == data.TaskCode)
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Task Code already exists",
        )

    task = Task(
        TaskID=uuid4(),
        TaskCode=data.TaskCode,
        TaskName=data.TaskName,
        StartDate=data.StartDate,
        EndDate=data.EndDate,
        ApprovedHours=data.ApprovedHours,
    )

    db.add(task)
    db.commit()
    db.refresh(task)

    return {
        "message": "Task created successfully",
        "TaskID": str(task.TaskID),
    }


# ==========================================
# Update Task
# ==========================================
@router.put("/{task_id}")
def update_task(
    task_id: str,
    data: TaskUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):

    if current_user["role"] != "Admin":
        raise HTTPException(
            status_code=403,
            detail="Only Admin can update tasks",
        )

    task = (
        db.query(Task)
        .filter(Task.TaskID == UUID(task_id))
        .first()
    )

    if not task:
        raise HTTPException(
            status_code=404,
            detail="Task not found",
        )

    update_data = data.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(task, key, value)

    db.commit()
    db.refresh(task)

    return {
        "message": "Task updated successfully",
    }


# ==========================================
# Delete Task
# ==========================================
@router.delete("/{task_id}")
def delete_task(
    task_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):

    if current_user["role"] != "Admin":
        raise HTTPException(
            status_code=403,
            detail="Only Admin can delete tasks",
        )

    task = (
        db.query(Task)
        .filter(Task.TaskID == UUID(task_id))
        .first()
    )

    if not task:
        raise HTTPException(
            status_code=404,
            detail="Task not found",
        )

    db.delete(task)
    db.commit()

    return {
        "message": "Task deleted successfully",
    }