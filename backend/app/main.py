"""SWAIS standard FastAPI entry point.

Module path is always `app.main:app` — pm2/uvicorn/Nginx all assume this.
"""

import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.routers import auth, employees, example, timesheet


app = FastAPI(title=settings.app_name)

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
app.include_router(auth.router)