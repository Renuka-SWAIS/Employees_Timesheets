from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from uuid import uuid4
from datetime import datetime

from app.database.database import get_db
from app.models.employee import Employee
from app.schemas.employee import EmployeeCreate
from app.utils.dependencies import get_current_user

import os
import shutil

router = APIRouter(
    prefix="/employees",
    tags=["Employees"]
)


# ==========================
# Request Model (Update)
# ==========================
class EmployeeUpdate(BaseModel):
    EmployeeName: str
    Department: str
    Designation: str


# ==========================
# Get All Employees
# ==========================
@router.get("/")
def get_employees(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):

    if current_user["role"] != "Admin":
        raise HTTPException(
            status_code=403,
            detail="Only Admin can view employees"
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


# ==========================
# Create Employee
# ==========================
@router.post("/")
def create_employee(
    employee: EmployeeCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):

    if current_user["role"] != "Admin":
        raise HTTPException(
            status_code=403,
            detail="Only Admin can create employees"
        )

    existing = (
        db.query(Employee)
        .filter(Employee.EmailID == employee.EmailID)
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Employee email already exists"
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


# ==========================
# Upload Employee Photo
# ==========================
@router.post("/{employee_id}/photo")
def upload_photo(
    employee_id: str,
    photo: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):

    if current_user["role"] != "Admin":
        raise HTTPException(
            status_code=403,
            detail="Only Admin can upload photos"
        )

    employee = (
        db.query(Employee)
        .filter(Employee.EmployeeID == employee_id)
        .first()
    )

    if not employee:
        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    os.makedirs("uploads", exist_ok=True)

    extension = photo.filename.split(".")[-1]
    filename = f"{employee.EmployeeID}.{extension}"
    filepath = os.path.join("uploads", filename)

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


# ==========================
# Update Employee
# ==========================
@router.put("/{employee_id}")
def update_employee(
    employee_id: str,
    data: EmployeeUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):

    if current_user["role"] != "Admin":
        raise HTTPException(
            status_code=403,
            detail="Only Admin can update employees"
        )

    employee = (
        db.query(Employee)
        .filter(Employee.EmployeeID == employee_id)
        .first()
    )

    if not employee:
        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    employee.EmployeeName = data.EmployeeName
    employee.Department = data.Department
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


# ==========================
# Get Single Employee
# ==========================
@router.get("/{employee_id}")
def get_employee(
    employee_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):

    if current_user["role"] != "Admin":
        raise HTTPException(
            status_code=403,
            detail="Only Admin can view employee details"
        )

    employee = (
        db.query(Employee)
        .filter(Employee.EmployeeID == employee_id)
        .first()
    )

    if not employee:
        raise HTTPException(
            status_code=404,
            detail="Employee not found"
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


# ==========================
# Delete Employee
# ==========================
@router.delete("/{employee_id}")
def delete_employee(
    employee_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):

    if current_user["role"] != "Admin":
        raise HTTPException(
            status_code=403,
            detail="Only Admin can delete employees"
        )

    employee = (
        db.query(Employee)
        .filter(Employee.EmployeeID == employee_id)
        .first()
    )

    if not employee:
        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    db.delete(employee)
    db.commit()

    return {
        "message": "Employee deleted successfully"
    }