"""SWAIS standard: the ONLY place environment variables are read.

Never hardcode URLs/ports/credentials elsewhere. Never log secret values.
"""

import os
from dotenv import load_dotenv

# Load .env file
load_dotenv()


class Settings:
    def __init__(self) -> None:
        # App name shown in Swagger
        self.app_name: str = os.getenv(
            "APP_NAME",
            "SWAIS Employee Timesheet Backend"
        )

        # Backend port
        self.port: int = int(os.getenv("PORT", "2006"))

        # Database connection (required)
        self.database_url: str = self._require("DATABASE_URL")

        # CORS settings for frontend
        self.cors_origins: list[str] = [
            origin.strip()
            for origin in os.getenv("CORS_ORIGINS", "").split(",")
            if origin.strip()
        ]
         # Google OAuth
        self.google_client_id = self._require(
            "GOOGLE_CLIENT_ID"
        )

        # JWT
        self.jwt_secret_key = self._require(
            "JWT_SECRET_KEY"
        )

        self.jwt_algorithm = os.getenv(
            "JWT_ALGORITHM",
            "HS256"
        )

        self.access_token_expire_minutes = int(
            os.getenv(
                "ACCESS_TOKEN_EXPIRE_MINUTES",
                "480"
            )
        )

    @staticmethod
    def _require(name: str) -> str:
        value = os.getenv(name)
        if not value:
            raise RuntimeError(
                f"Required environment variable {name} is not set. "
                f"Copy .env.example to .env and fill it in."
            )
        return value


settings = Settings()