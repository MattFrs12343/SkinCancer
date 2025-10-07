"""
Middleware de seguridad para la aplicación OncoDerma
"""

from fastapi import Request, HTTPException, status
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response
import time
import logging
from collections import defaultdict
from typing import Dict
import os

logger = logging.getLogger(__name__)

# Almacenamiento para rate limiting (en producción usar Redis)
rate_limit_storage: Dict[str, list] = defaultdict(list)

class SecurityMiddleware(BaseHTTPMiddleware):
    """
    Middleware de seguridad que incluye:
    - Headers de seguridad
    - Rate limiting básico
    - Validación de uploads
    """
    
    def __init__(self, app, rate_limit_requests: int = 100, rate_limit_window: int = 3600):
        super().__init__(app)
        self.rate_limit_requests = rate_limit_requests
        self.rate_limit_window = rate_limit_window
    
    async def dispatch(self, request: Request, call_next):
        # Aplicar rate limiting
        client_ip = self.get_client_ip(request)
        if not self.check_rate_limit(client_ip):
            logger.warning(f"Rate limit exceeded for IP: {client_ip}")
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many requests. Please try again later."
            )
        
        # Validar uploads si es necesario
        if request.url.path.startswith("/api/analysis/upload"):
            self.validate_upload_request(request)
        
        # Procesar request
        response = await call_next(request)
        
        # Agregar headers de seguridad
        self.add_security_headers(response, request)
        
        return response
    
    def get_client_ip(self, request: Request) -> str:
        """Obtener IP real del cliente"""
        # Verificar headers de proxy
        forwarded_for = request.headers.get("X-Forwarded-For")
        if forwarded_for:
            return forwarded_for.split(",")[0].strip()
        
        real_ip = request.headers.get("X-Real-IP")
        if real_ip:
            return real_ip
        
        return request.client.host if request.client else "unknown"
    
    def check_rate_limit(self, client_ip: str) -> bool:
        """Verificar rate limit para la IP"""
        now = time.time()
        
        # Limpiar requests antiguos
        rate_limit_storage[client_ip] = [
            timestamp for timestamp in rate_limit_storage[client_ip]
            if now - timestamp < self.rate_limit_window
        ]
        
        # Verificar límite
        if len(rate_limit_storage[client_ip]) >= self.rate_limit_requests:
            return False
        
        # Agregar request actual
        rate_limit_storage[client_ip].append(now)
        return True
    
    def validate_upload_request(self, request: Request):
        """Validar requests de upload"""
        content_type = request.headers.get("content-type", "")
        
        # Verificar content type
        if not content_type.startswith("multipart/form-data"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid content type for file upload"
            )
        
        # Verificar tamaño
        content_length = request.headers.get("content-length")
        if content_length:
            max_size = 10 * 1024 * 1024  # 10MB
            if int(content_length) > max_size:
                raise HTTPException(
                    status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                    detail="File too large"
                )
    
    def add_security_headers(self, response: Response, request: Request):
        """Agregar headers de seguridad"""
        # Headers básicos de seguridad
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        
        # Content Security Policy
        csp_parts = [
            "default-src 'self'",
            "script-src 'self'",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data:",
            "font-src 'self'",
            "connect-src 'self'",
            "frame-ancestors 'none'"
        ]
        response.headers["Content-Security-Policy"] = "; ".join(csp_parts)
        
        # HSTS solo en HTTPS
        if request.url.scheme == "https":
            response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        
        # Permissions Policy
        response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"

def get_cors_config(environment: str = "development") -> dict:
    """
    Obtener configuración de CORS según el entorno
    """
    if environment == "production":
        return {
            "allow_origins": [
                "http://localhost:3000",
                "https://www.oncoderma.com"
            ],
            "allow_credentials": True,
            "allow_methods": ["GET", "POST"],
            "allow_headers": ["*"],
            "expose_headers": ["X-Request-ID"]
        }
    else:
        return {
            "allow_origins": [
                "http://localhost:3000",
                "http://127.0.0.1:3000",
                "http://localhost:5173",
                "http://127.0.0.1:5173"
            ],
            "allow_credentials": True,
            "allow_methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["*"],
            "expose_headers": ["X-Request-ID"]
        }