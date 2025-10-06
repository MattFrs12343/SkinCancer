from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
import time
import logging
import os
import asyncio
import gc
from contextlib import asynccontextmanager
from functools import lru_cache

# Imports para las rutas
def lazy_import_routes():
    try:
        from app.api.routes import auth, analysis
        return auth, analysis
    except ImportError:
        # Fallback si no existen las rutas
        return None, None

def lazy_import_config():
    try:
        from app.core.config import settings
        return settings
    except ImportError:
        # Configuración básica
        class BasicSettings:
            DEBUG = os.getenv("FASTAPI_ENV") != "production"
            MAX_FILE_SIZE = int(os.getenv("MAX_UPLOAD_SIZE", "10485760"))
            ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"]
            API_HOST = "0.0.0.0"
            API_PORT = 8000
            ALLOWED_HOSTS = ["*"]
        return BasicSettings()

# Configuración
settings = lazy_import_config()

# Configurar logging
logging.basicConfig(
    level=logging.INFO if settings.DEBUG else logging.WARNING,
    format="%(levelname)s - %(message)s",
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger(__name__)

# Cache básico
@lru_cache(maxsize=100)
def get_cached_response(cache_key: str):
    return None

# Estadísticas de performance
performance_stats = {
    "requests_count": 0,
    "start_time": time.time()
}

# Lifespan de la aplicación
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("OncoDerma API starting...")
    gc.collect()
    
    yield
    
    # Shutdown
    logger.info("OncoDerma API shutting down...")
    gc.collect()

# Crear instancia de FastAPI
app = FastAPI(
    title="OncoDerma API",
    description="API para análisis dermatológico con IA",
    version="1.0.0",
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
    openapi_url="/openapi.json" if settings.DEBUG else None,
    lifespan=lifespan
)

# Middleware de performance
@app.middleware("http")
async def performance_middleware(request: Request, call_next):
    start_time = time.time()
    performance_stats["requests_count"] += 1
    
    try:
        response = await call_next(request)
        process_time = time.time() - start_time
        
        # Headers de respuesta
        response.headers["X-Process-Time"] = str(round(process_time, 3))
        response.headers["X-Request-ID"] = str(performance_stats["requests_count"])
        
        # Log requests lentos o con errores
        if response.status_code >= 400 or process_time > 2.0:
            logger.warning(f"{request.method} {request.url} - {response.status_code} - {process_time:.3f}s")
        
        return response
        
    except Exception as e:
        logger.error(f"Request failed: {str(e)}")
        raise
    finally:
        # Cleanup periódico de memoria
        if performance_stats["requests_count"] % 10 == 0:
            gc.collect()

# Middleware de compresión
app.add_middleware(GZipMiddleware, minimum_size=1000)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configurar dominios específicos en producción
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
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

# Incluir rutas con lazy loading
try:
    auth, analysis = lazy_import_routes()
    if auth and analysis:
        app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])
        app.include_router(analysis.router, prefix="/api/analysis", tags=["analysis"])
except Exception as e:
    logger.warning(f"Could not load routes: {e}")

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
    """Health check de la aplicación"""
    uptime = time.time() - performance_stats["start_time"]
    
    return {
        "status": "healthy",
        "service": "oncoderma-api",
        "version": "1.0.0",
        "timestamp": time.time(),
        "environment": os.getenv("FASTAPI_ENV", "development"),
        "performance": {
            "uptime_seconds": round(uptime, 2),
            "requests_count": performance_stats["requests_count"]
        }
    }

# Información de la API
@app.get("/info")
async def api_info():
    return {
        "name": "OncoDerma API",
        "description": "API para análisis dermatológico con IA",
        "version": "1.0.0",
        "endpoints": {
            "auth": "/api/auth",
            "analysis": "/api/analysis",
            "health": "/health",
            "info": "/info"
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
