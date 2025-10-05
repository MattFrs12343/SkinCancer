from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
import time
import logging
import os
from app.api.routes import auth, analysis
from app.core.config import settings
from app.core.security_middleware import SecurityMiddleware, get_cors_config

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Crear instancia de FastAPI
app = FastAPI(
    title="OncoDerma API",
    description="API para análisis de imágenes de piel con inteligencia artificial",
    version="1.0.0",
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
    openapi_url="/openapi.json" if settings.DEBUG else None,
    # Configuración de seguridad
    dependencies=[],
    swagger_ui_parameters={"defaultModelsExpandDepth": -1} if settings.DEBUG else None
)

# Middleware para logging de requests
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    
    # Log request
    logger.info(f"Request: {request.method} {request.url}")
    
    response = await call_next(request)
    
    # Log response
    process_time = time.time() - start_time
    logger.info(f"Response: {response.status_code} - {process_time:.4f}s")
    
    return response

# Middleware de seguridad (debe ir primero)
app.add_middleware(SecurityMiddleware, rate_limit_requests=100, rate_limit_window=3600)

# Configurar CORS según el entorno
environment = os.getenv("VITE_ENVIRONMENT", "development")
cors_config = get_cors_config(environment)

app.add_middleware(
    CORSMiddleware,
    **cors_config
)

# Middleware de hosts confiables
if settings.ALLOWED_HOSTS != ["*"]:
    app.add_middleware(
        TrustedHostMiddleware, 
        allowed_hosts=settings.ALLOWED_HOSTS
    )

# Manejadores de excepciones globales
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    logger.error(f"HTTP Exception: {exc.status_code} - {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": "HTTP_ERROR",
            "message": exc.detail,
            "status_code": exc.status_code
        }
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.error(f"Validation Error: {exc.errors()}")
    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "error": "VALIDATION_ERROR",
            "message": "Datos de entrada inválidos",
            "details": exc.errors()
        }
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unexpected error: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": "INTERNAL_SERVER_ERROR",
            "message": "Error interno del servidor"
        }
    )

# Incluir rutas
app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])
app.include_router(analysis.router, prefix="/api/analysis", tags=["analysis"])

# Rutas principales
@app.get("/")
async def root():
    return {
        "message": "OncoDerma API - Análisis de piel con IA",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs" if settings.DEBUG else "disabled"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "oncoderma-api",
        "version": "1.0.0",
        "timestamp": time.time(),
        "debug_mode": settings.DEBUG
    }

# Información de la API
@app.get("/info")
async def api_info():
    return {
        "name": "OncoDerma API",
        "description": "API para análisis de imágenes de piel con IA",
        "version": "1.0.0",
        "endpoints": {
            "auth": "/api/auth",
            "analysis": "/api/analysis",
            "health": "/health",
            "docs": "/docs" if settings.DEBUG else None
        },
        "limits": {
            "max_file_size_mb": settings.MAX_FILE_SIZE / (1024 * 1024),
            "allowed_file_types": settings.ALLOWED_FILE_TYPES
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.API_HOST,
        port=settings.API_PORT,
        reload=settings.DEBUG,
        log_level="info"
    )