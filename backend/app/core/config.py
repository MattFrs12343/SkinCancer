from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    # API Configuration
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    DEBUG: bool = True
    
    # CORS Configuration
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3000"
    ]
    
    # Security
    ALLOWED_HOSTS: List[str] = ["*"]
    SECRET_KEY: str = "oncoderma-secret-key-change-in-production"
    
    # File Upload
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_FILE_TYPES: List[str] = ["image/jpeg", "image/jpg", "image/png"]
    UPLOAD_DIR: str = os.path.join(os.getcwd(), "temp_uploads")
    
    # AI Model (simulado)
    MODEL_PATH: str = "/app/models/skin_cancer_model.pkl"
    PROCESSING_TIME_MIN: int = 2  # segundos mínimos de procesamiento
    PROCESSING_TIME_MAX: int = 8  # segundos máximos de procesamiento
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# Crear instancia global de configuración
settings = Settings()

# Crear directorio de uploads si no existe
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)