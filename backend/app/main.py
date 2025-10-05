from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from starlette.middleware.base import BaseHTTPMiddleware
import time
import logging
import os
import asyncio
import psutil
from contextlib import asynccontextmanager
from app.api.routes import auth, analysis
from app.core.config import settings
from app.core.security_middleware import SecurityMiddleware, get_cors_config

# Configurar logging optimizado
logging.basicConfig(
    level=logging.INFO if settings.DEBUG else logging.WARNING,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler("app.log") if not settings.DEBUG else logging.NullHandler()
    ]
)
logger = logging.getLogger(__name__)

# Cache en memoria para respuestas frecuentes
response_cache = {}
cache_ttl = {}

# Estadísticas de rendimiento
performance_stats = {
    "requests_count": 0,
    "avg_response_time": 0,
    "cache_hits": 0,
    "cache_misses": 0,
    "start_time": time.time()
}

# Lifespan para inicialización y cleanup
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting OncoDerma API...")
    logger.info(f"Debug mode: {settings.DEBUG}")
    logger.info(f"Environment: {os.getenv('VITE_ENVIRONMENT', 'development')}")
    
    # Inicializar caché de limpieza
    cleanup_task = asyncio.create_task(cleanup_cache_periodically())
    
    yield
    
    # Shutdown
    logger.info("Shutting down OncoDerma API...")
    cleanup_task.cancel()
    try:
        await cleanup_task
    except asyncio.CancelledError:
        pass

# Crear instancia de FastAPI optimizada
app = FastAPI(
    title="OncoDerma API",
    description="API para análisis de imágenes de piel con inteligencia artificial",
    version="1.0.0",
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
    openapi_url="/openapi.json" if settings.DEBUG else None,
    lifespan=lifespan,
    # Configuración de seguridad
    dependencies=[],
    swagger_ui_parameters={"defaultModelsExpandDepth": -1} if settings.DEBUG else None
)

# Middleware optimizado para logging y métricas
@app.middleware("http")
async def performance_middleware(request: Request, call_next):
    start_time = time.time()
    
    # Incrementar contador de requests
    performance_stats["requests_count"] += 1
    
    # Verificar caché para requests GET
    cache_key = None
    if request.method == "GET":
        cache_key = f"{request.method}:{request.url}"
        if cache_key in response_cache:
            # Verificar TTL
            if time.time() < cache_ttl.get(cache_key, 0):
                performance_stats["cache_hits"] += 1
                cached_response = response_cache[cache_key]
                logger.debug(f"Cache hit: {cache_key}")
                return JSONResponse(content=cached_response)
            else:
                # Limpiar caché expirado
                response_cache.pop(cache_key, None)
                cache_ttl.pop(cache_key, None)
    
    # Log request solo en debug
    if settings.DEBUG:
        logger.info(f"Request: {request.method} {request.url}")
    
    response = await call_next(request)
    
    # Calcular tiempo de respuesta
    process_time = time.time() - start_time
    
    # Actualizar estadísticas
    current_avg = performance_stats["avg_response_time"]
    count = performance_stats["requests_count"]
    performance_stats["avg_response_time"] = (current_avg * (count - 1) + process_time) / count
    
    # Guardar en caché si es exitoso y GET
    if request.method == "GET" and response.status_code == 200 and cache_key:
        try:
            # Solo cachear respuestas pequeñas (< 1MB)
            content_length = response.headers.get("content-length")
            if not content_length or int(content_length) < 1024 * 1024:
                # Leer contenido para caché
                body = b""
                async for chunk in response.body_iterator:
                    body += chunk
                
                # Recrear response
                response = JSONResponse(
                    content=body.decode() if isinstance(body, bytes) else body,
                    status_code=response.status_code,
                    headers=dict(response.headers)
                )
                
                # Guardar en caché por 5 minutos
                response_cache[cache_key] = body.decode() if isinstance(body, bytes) else body
                cache_ttl[cache_key] = time.time() + 300
                performance_stats["cache_misses"] += 1
        except Exception as e:
            logger.warning(f"Error caching response: {e}")
    
    # Agregar headers de rendimiento
    response.headers["X-Process-Time"] = str(process_time)
    response.headers["X-Request-ID"] = str(performance_stats["requests_count"])
    
    # Log response solo en debug o si es lento
    if settings.DEBUG or process_time > 1.0:
        logger.info(f"Response: {response.status_code} - {process_time:.4f}s")
    
    return response

# Función para limpiar caché periódicamente
async def cleanup_cache_periodically():
    while True:
        try:
            await asyncio.sleep(300)  # Cada 5 minutos
            current_time = time.time()
            expired_keys = [
                key for key, ttl in cache_ttl.items() 
                if current_time > ttl
            ]
            
            for key in expired_keys:
                response_cache.pop(key, None)
                cache_ttl.pop(key, None)
            
            if expired_keys:
                logger.info(f"Cleaned {len(expired_keys)} expired cache entries")
                
        except asyncio.CancelledError:
            break
        except Exception as e:
            logger.error(f"Error in cache cleanup: {e}")

# Middleware de compresión (debe ir primero para comprimir todas las respuestas)
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Middleware de seguridad
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
    # Obtener estadísticas del sistema
    memory_info = psutil.virtual_memory()
    cpu_percent = psutil.cpu_percent(interval=0.1)
    
    uptime = time.time() - performance_stats["start_time"]
    
    return {
        "status": "healthy",
        "service": "oncoderma-api",
        "version": "1.0.0",
        "timestamp": time.time(),
        "debug_mode": settings.DEBUG,
        "performance": {
            "uptime_seconds": round(uptime, 2),
            "requests_count": performance_stats["requests_count"],
            "avg_response_time": round(performance_stats["avg_response_time"], 4),
            "cache_hit_rate": round(
                performance_stats["cache_hits"] / 
                max(performance_stats["cache_hits"] + performance_stats["cache_misses"], 1) * 100, 2
            ),
            "cache_entries": len(response_cache)
        },
        "system": {
            "memory_usage_percent": memory_info.percent,
            "memory_available_mb": round(memory_info.available / 1024 / 1024, 2),
            "cpu_usage_percent": cpu_percent
        }
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
        },
        "performance": performance_stats,
        "cache_info": {
            "entries": len(response_cache),
            "hit_rate": round(
                performance_stats["cache_hits"] / 
                max(performance_stats["cache_hits"] + performance_stats["cache_misses"], 1) * 100, 2
            )
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