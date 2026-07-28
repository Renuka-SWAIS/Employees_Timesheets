"""SWAIS standard FastAPI entry point.

Module path is always `app.main:app`
"""

import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings

# Database
from app.database.database import Base, engine

# Import all models
from app.models.employee import Employee
from app.models.timesheet import Timesheet
from app.models.leave import Leave
from app.models.task import Task

from app.routers import (
    auth,
    employees,
    example,
    timesheet,
    leave,
    task,
)

app = FastAPI(title=settings.app_name)

# Create database tables automatically
Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("uploads", exist_ok=True)

app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads",
)


@app.get("/health")
def health():
    return {
        "status": "ok",
        "app": settings.app_name,
    }


app.include_router(example.router)
app.include_router(employees.router)
app.include_router(timesheet.router)
app.include_router(leave.router)
app.include_router(auth.router)
app.include_router(task.router)