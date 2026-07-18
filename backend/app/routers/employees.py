from fastapi import (
    APIRouter,
    Depends,
    UploadFile,
    File,
    HTTPException,
)
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from uuid import uuid4
from datetime import datetime
import os
import shutil

from app.database.database import get_db
from app.models.employee import Employee
from app.schemas.employee import EmployeeCreate
from app.utils.dependencies import get_current_user

router = APIRouter(
    prefix="/employees",
    tags=["Employees"],
)

UPLOAD_FOLDER = "uploads"


# =====================================================
# Request Model
# =====================================================

class EmployeeUpdate(BaseModel):
    EmployeeName: Optional[str] = None
    Department: Optional[str] = None
    Designation: Optional[str] = None


# =====================================================
# Helper
# =====================================================

def get_employee_by_id(db: Session, employee_id: str):
    employee = (
        db.query(Employee)
        .filter(Employee.EmployeeID == employee_id)
        .first()
    )

    if not employee:
        raise HTTPException(
            status_code=404,
            detail="Employee not found",
        )

    return employee


# =====================================================
# Get All Employees (Admin)
# =====================================================

@router.get("/")
def get_employees(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):

    if current_user["role"] != "Admin":
        raise HTTPException(
            status_code=403,
            detail="Only Admin can view employees",
        )

    employees = db.query(Employee).all()

    return [
        {
            "EmployeeID": str(emp.EmployeeID),
            "EmployeeCode": emp.EmployeeCode,
            "EmployeeName": emp.EmployeeName,
            "EmailID": emp.EmailID,
            "RoleType": emp.RoleType,
            "Department": emp.Department,
            "Designation": emp.Designation,
            "Status": emp.Status,
            "PhotoURL": emp.PhotoURL,
        }
        for emp in employees
    ]


# =====================================================
# Logged In User Profile
# =====================================================

@router.get("/me")
def get_my_profile(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):

    employee = get_employee_by_id(
        db,
        current_user["employee_id"],
    )

    return {
        "EmployeeID": str(employee.EmployeeID),
        "EmployeeCode": employee.EmployeeCode,
        "EmployeeName": employee.EmployeeName,
        "EmailID": employee.EmailID,
        "RoleType": employee.RoleType,
        "Department": employee.Department,
        "Designation": employee.Designation,
        "Status": employee.Status,
        "PhotoURL": employee.PhotoURL,
    }


# =====================================================
# Create Employee
# =====================================================

@router.post("/")
def create_employee(
    employee: EmployeeCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):

    if current_user["role"] != "Admin":
        raise HTTPException(
            status_code=403,
            detail="Only Admin can create employees",
        )

    existing = (
        db.query(Employee)
        .filter(Employee.EmailID == employee.EmailID)
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Employee already exists",
        )

    new_employee = Employee(
        EmployeeID=uuid4(),
        EmployeeCode=employee.EmployeeCode,
        EmployeeName=employee.EmployeeName,
        EmailID=employee.EmailID,
        RoleType=employee.RoleType,
        Department=employee.Department,
        Designation=employee.Designation,
        Status=employee.Status,
        PhotoURL=None,
        CreatedDate=datetime.now(),
        ModifiedDate=datetime.now(),
    )

    db.add(new_employee)
    db.commit()
    db.refresh(new_employee)

    return {
        "message": "Employee created successfully",
        "EmployeeID": str(new_employee.EmployeeID),
    }


# =====================================================
# Upload Photo
# =====================================================

@router.post("/{employee_id}/photo")
def upload_photo(
    employee_id: str,
    photo: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):

    if (
        current_user["role"] != "Admin"
        and str(current_user["employee_id"]) != employee_id
    ):
        raise HTTPException(
            status_code=403,
            detail="Access denied",
        )

    employee = get_employee_by_id(db, employee_id)

    extension = photo.filename.split(".")[-1].lower()

    if extension not in ["jpg", "jpeg", "png"]:
        raise HTTPException(
            status_code=400,
            detail="Only jpg, jpeg and png allowed",
        )

    os.makedirs(UPLOAD_FOLDER, exist_ok=True)

    filename = f"{employee.EmployeeID}.{extension}"

    filepath = os.path.join(
        UPLOAD_FOLDER,
        filename,
    )

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(photo.file, buffer)

    employee.PhotoURL = f"/uploads/{filename}"
    employee.ModifiedDate = datetime.now()

    db.commit()
    db.refresh(employee)

    return {
        "message": "Photo uploaded successfully",
        "PhotoURL": employee.PhotoURL,
    }


# =====================================================
# Update Employee
# =====================================================

@router.put("/{employee_id}")
def update_employee(
    employee_id: str,
    data: EmployeeUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):

    if (
        current_user["role"] != "Admin"
        and str(current_user["employee_id"]) != employee_id
    ):
        raise HTTPException(
            status_code=403,
            detail="Access denied",
        )

    employee = get_employee_by_id(db, employee_id)

    if data.EmployeeName is not None:
        employee.EmployeeName = data.EmployeeName

    if data.Department is not None:
        employee.Department = data.Department

    if data.Designation is not None:
        employee.Designation = data.Designation

    employee.ModifiedDate = datetime.now()

    db.commit()
    db.refresh(employee)

    return {
        "message": "Employee updated successfully",
        "employee": {
            "EmployeeID": str(employee.EmployeeID),
            "EmployeeName": employee.EmployeeName,
            "Department": employee.Department,
            "Designation": employee.Designation,
            "PhotoURL": employee.PhotoURL,
        },
    }


# =====================================================
# Get Employee By ID
# =====================================================

@router.get("/{employee_id}")
def get_employee(
    employee_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):

    if (
        current_user["role"] != "Admin"
        and str(current_user["employee_id"]) != employee_id
    ):
        raise HTTPException(
            status_code=403,
            detail="Access denied",
        )

    employee = get_employee_by_id(db, employee_id)

    return {
        "EmployeeID": str(employee.EmployeeID),
        "EmployeeCode": employee.EmployeeCode,
        "EmployeeName": employee.EmployeeName,
        "EmailID": employee.EmailID,
        "RoleType": employee.RoleType,
        "Department": employee.Department,
        "Designation": employee.Designation,
        "Status": employee.Status,
        "PhotoURL": employee.PhotoURL,
    }


# =====================================================
# Delete Employee
# =====================================================

@router.delete("/{employee_id}")
def delete_employee(
    employee_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):

    if current_user["role"] != "Admin":
        raise HTTPException(
            status_code=403,
            detail="Only Admin can delete employees",
        )

    employee = get_employee_by_id(db, employee_id)

    if employee.PhotoURL:
        photo_path = employee.PhotoURL.replace("/", os.sep).lstrip(os.sep)

        if os.path.exists(photo_path):
            os.remove(photo_path)

    db.delete(employee)
    db.commit()

    return {
        "message": "Employee deleted successfully",
    }