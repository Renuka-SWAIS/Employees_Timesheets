from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv

# Load variables from .env
load_dotenv()

# Read DATABASE_URL from .env
DATABASE_URL = os.getenv("DATABASE_URL")

# Create database engine
engine = create_engine(DATABASE_URL)

# Create database session
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Base class for all models
Base = declarative_base()

# Dependency for FastAPI
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()