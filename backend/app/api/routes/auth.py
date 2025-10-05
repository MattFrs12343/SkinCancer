from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.schemas.auth import LoginRequest, LoginResponse, User
from app.core.config import settings
import time
import logging
import hashlib
import secrets

router = APIRouter()
security = HTTPBearer(auto_error=False)
logger = logging.getLogger(__name__)

# Credenciales estáticas para demo
DEMO_CREDENTIALS = {
    "username": "admin",
    "password": "1234"
}

# Almacén temporal de tokens (en producción usar Redis o base de datos)
active_tokens = {}

def generate_token(username: str) -> str:
    """Generar token único para el usuario"""
    timestamp = str(time.time())
    random_part = secrets.token_hex(16)
    token_data = f"{username}:{timestamp}:{random_part}"
    return hashlib.sha256(token_data.encode()).hexdigest()

def validate_token(token: str) -> dict:
    """Validar token y retornar información del usuario"""
    return active_tokens.get(token)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Dependency para obtener usuario actual desde token"""
    if not credentials:
        return None
    
    user_data = validate_token(credentials.credentials)
    if not user_data:
        return None
    
    return User(**user_data)

@router.post("/login", response_model=LoginResponse)
async def login(credentials: LoginRequest):
    """
    Endpoint de autenticación con credenciales estáticas
    Solo para propósitos de demostración
    """
    try:
        logger.info(f"Intento de login para usuario: {credentials.username}")
        
        # Simular tiempo de procesamiento realista
        await asyncio.sleep(0.3)
        
        # Validar campos requeridos
        if not credentials.username or not credentials.password:
            logger.warning("Intento de login con campos vacíos")
            return LoginResponse(
                success=False,
                message="Usuario y contraseña son requeridos"
            )
        
        # Validar credenciales estáticas
        if (credentials.username.strip() == DEMO_CREDENTIALS["username"] and 
            credentials.password == DEMO_CREDENTIALS["password"]):
            
            # Generar token único
            token = generate_token(credentials.username)
            
            # Información del usuario
            user_data = {
                "username": credentials.username,
                "is_authenticated": True,
                "login_time": time.time()
            }
            
            # Almacenar token (en producción usar Redis con TTL)
            active_tokens[token] = user_data
            
            logger.info(f"Login exitoso para usuario: {credentials.username}")
            
            return LoginResponse(
                success=True,
                message="Autenticación exitosa",
                token=token,
                user=user_data
            )
        else:
            logger.warning(f"Credenciales incorrectas para usuario: {credentials.username}")
            return LoginResponse(
                success=False,
                message="Usuario o contraseña incorrectos"
            )
            
    except Exception as e:
        logger.error(f"Error durante autenticación: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor durante la autenticación"
        )

@router.post("/logout")
async def logout(current_user: User = Depends(get_current_user)):
    """
    Endpoint de logout - invalida el token actual
    """
    try:
        if current_user:
            # Encontrar y eliminar token del usuario
            tokens_to_remove = []
            for token, user_data in active_tokens.items():
                if user_data.get("username") == current_user.username:
                    tokens_to_remove.append(token)
            
            for token in tokens_to_remove:
                del active_tokens[token]
            
            logger.info(f"Logout exitoso para usuario: {current_user.username}")
            return {
                "success": True, 
                "message": f"Sesión cerrada exitosamente para {current_user.username}"
            }
        else:
            return {
                "success": True, 
                "message": "Sesión cerrada exitosamente"
            }
            
    except Exception as e:
        logger.error(f"Error durante logout: {str(e)}", exc_info=True)
        return {
            "success": False,
            "message": "Error al cerrar sesión"
        }

@router.get("/me")
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """
    Obtener información del usuario actual
    """
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o expirado"
        )
    
    return {
        "success": True,
        "user": current_user.dict()
    }

@router.get("/validate")
async def validate_token_endpoint(current_user: User = Depends(get_current_user)):
    """
    Validar si el token actual es válido
    """
    if current_user:
        return {
            "success": True,
            "valid": True,
            "user": current_user.dict()
        }
    else:
        return {
            "success": True,
            "valid": False,
            "message": "Token inválido o expirado"
        }

# Importar asyncio para sleep
import asyncio