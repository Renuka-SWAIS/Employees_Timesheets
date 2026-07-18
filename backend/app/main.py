"""SWAIS standard FastAPI entry point.

Module path is always `app.main:app` — pm2/uvicorn/Nginx all assume this.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles   # <-- NEW

from app.config import settings
from app.routers import example, employees, timesheet, auth

import os   # <-- NEW

app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------
# Create uploads folder
# -------------------------
os.makedirs("uploads", exist_ok=True)

# -------------------------
# Serve uploaded images
# -------------------------
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


@app.get("/health")
def health():
    return {
        "status": "ok",
        "app": settings.app_name,
    }


# Routes
app.include_router(example.router)
app.include_router(employees.router)
app.include_router(timesheet.router)
app.include_router(auth.router)