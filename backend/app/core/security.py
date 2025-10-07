"""
Configuraciones y middleware de seguridad para OncoDerma API
"""

from fastapi import Request, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response
import time
import logging
from collections import defaultdict
from typing import Dict, Optional
import hashlib
import secrets

logger = logging.getLogger(__name__)

# Rate limiting storage (en producción usar Redis)
rate_limit_storage: Dict[str, list] = defaultdict(list)

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """
    Middleware para agregar headers de seguridad
    """
    
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        
        # Headers de seguridad
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
        
        # Content Security Policy
        csp = (
            "default-src 'self'; "
            "script-src 'self'; "
            "style-src 'self' 'unsafe-inline'; "
            "img-src 'self' data:; "
            "font-src 'self'; "
            "connect-src 'self'; "
            "frame-ancestors 'none';"
        )
        response.headers["Content-Security-Policy"] = csp
        
        # HSTS (solo en HTTPS)
        if request.url.scheme == "https":
            response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        
        return response

class RateLimitMiddleware(BaseHTTPMiddleware):
    """
    Middleware para rate limiting básico
    """
    
    def __init__(self, app, calls: int = 100, period: int = 60):
        super().__init__(app)
        self.calls = calls
        self.period = period
    
    async def dispatch(self, request: Request, call_next):
        # Obtener IP del cliente
        client_ip = self.get_client_ip(request)
        
        # Verificar rate limit
        if not self.is_allowed(client_ip):
            logger.warning(f"Rate limit exceeded for IP: {client_ip}")
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many requests. Please try again later."
            )
        
        response = await call_next(request)
        return response
    
    def get_client_ip(self, request: Request) -> str:
        """Obtener IP real del cliente considerando proxies"""
        forwarded_for = request.headers.get("X-Forwarded-For")
        if forwarded_for:
            return forwarded_for.split(",")[0].strip()
        
        real_ip = request.headers.get("X-Real-IP")
        if real_ip:
            return real_ip
        
        return request.client.host if request.client else "unknown"
    
    def is_allowed(self, client_ip: str) -> bool:
        """Verificar si la IP está dentro del límite de rate"""
        now = time.time()
        
        # Limpiar requests antiguos
        rate_limit_storage[client_ip] = [
            timestamp for timestamp in rate_limit_storage[client_ip]
            if now - timestamp < self.period
        ]
        
        # Verificar límite
        if len(rate_limit_storage[client_ip]) >= self.calls:
            return False
        
        # Agregar request actual
        rate_limit_storage[client_ip].append(now)
        return True

class FileUploadSecurityMiddleware(BaseHTTPMiddleware):
    """
    Middleware específico para seguridad en uploads de archivos
    """
    
    ALLOWED_MIME_TYPES = {
        'image/jpeg',
        'image/jpg', 
        'image/png'
    }
    
    MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
    
    async def dispatch(self, request: Request, call_next):
        # Solo aplicar a endpoints de upload
        if request.url.path.startswith("/api/analysis/upload"):
            await self.validate_upload_request(request)
        
        response = await call_next(request)
        return response
    
    async def validate_upload_request(self, request: Request):
        """Validar request de upload antes del procesamiento"""
        content_type = request.headers.get("content-type", "")
        
        # Verificar que sea multipart/form-data
        if not content_type.startswith("multipart/form-data"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid content type for file upload"
            )
        
        # Verificar tamaño del contenido
        content_length = request.headers.get("content-length")
        if content_length and int(content_length) > self.MAX_FILE_SIZE:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail="File too large"
            )

def generate_secure_token() -> str:
    """Generar token seguro para autenticación"""
    return secrets.token_urlsafe(32)

def hash_password(password: str, salt: Optional[str] = None) -> tuple[str, str]:
    """Hash de contraseña con salt"""
    if salt is None:
        salt = secrets.token_hex(16)
    
    # Usar PBKDF2 para hash seguro
    password_hash = hashlib.pbkdf2_hmac(
        'sha256',
        password.encode('utf-8'),
        salt.encode('utf-8'),
        100000  # 100k iteraciones
    )
    
    return password_hash.hex(), salt

def verify_password(password: str, password_hash: str, salt: str) -> bool:
    """Verificar contraseña contra hash"""
    computed_hash, _ = hash_password(password, salt)
    return secrets.compare_digest(computed_hash, password_hash)

def sanitize_filename(filename: str) -> str:
    """Sanitizar nombre de archivo para prevenir path traversal"""
    import os
    import re
    
    # Remover caracteres peligrosos
    filename = re.sub(r'[^\w\-_\.]', '', filename)
    
    # Prevenir nombres de archivo especiales
    dangerous_names = {'CON', 'PRN', 'AUX', 'NUL', 'COM1', 'COM2', 'COM3', 'COM4', 
                      'COM5', 'COM6', 'COM7', 'COM8', 'COM9', 'LPT1', 'LPT2', 
                      'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9'}
    
    name_without_ext = os.path.splitext(filename)[0].upper()
    if name_without_ext in dangerous_names:
        filename = f"safe_{filename}"
    
    # Limitar longitud
    if len(filename) > 255:
        name, ext = os.path.splitext(filename)
        filename = name[:255-len(ext)] + ext
    
    return filename or "unnamed_file"

class SecurityConfig:
    """Configuración centralizada de seguridad"""
    
    # Rate limiting
    RATE_LIMIT_CALLS = 100
    RATE_LIMIT_PERIOD = 60  # segundos
    
    # File upload
    MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
    ALLOWED_EXTENSIONS = {'.jpg', '.jpeg', '.png'}
    ALLOWED_MIME_TYPES = {'image/jpeg', 'image/jpg', 'image/png'}
    
    # Authentication
    TOKEN_EXPIRE_HOURS = 24
    
    # CORS
    ALLOWED_ORIGINS = [
        "http://localhost:3000",
        "http://127.0.0.1:3000", 
http://localhost:3000
    ]
    
    # Headers de seguridad
    SECURITY_HEADERS = {
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY", 
        "X-XSS-Protection": "1; mode=block",
        "Referrer-Policy": "strict-origin-when-cross-origin"
    }