from fastapi import APIRouter, UploadFile, File, HTTPException, status, Depends
from app.schemas.analysis import AnalysisResponse, AnalysisResult, ImageMetadata
from app.api.routes.auth import get_current_user
from app.schemas.auth import User
from app.core.config import settings
from app.models.ai_model import ai_model
from app.core.security import sanitize_filename, SecurityConfig
from PIL import Image, ImageFile
import random
import time
import os
import aiofiles
import asyncio
import logging
from datetime import datetime
from typing import Optional

# Intentar importar python-magic, usar fallback si no está disponible
try:
    import magic
    MAGIC_AVAILABLE = True
except ImportError:
    MAGIC_AVAILABLE = False
    logging.warning("python-magic no disponible, usando validación básica de imágenes")

# Permitir cargar imágenes truncadas
ImageFile.LOAD_TRUNCATED_IMAGES = True

router = APIRouter()
logger = logging.getLogger(__name__)

class FileUploadSecurity:
    """Clase para validaciones de seguridad en uploads"""
    
    @staticmethod
    def validate_file_size(size: int) -> bool:
        """Validar tamaño del archivo"""
        return size <= SecurityConfig.MAX_FILE_SIZE
    
    @staticmethod
    def validate_file_signature(content: bytes) -> bool:
        """Validar signature del archivo (magic numbers)"""
        if not content:
            return False
        
        # Signatures de archivos de imagen
        jpeg_signatures = [
            b'\xff\xd8\xff\xe0',  # JPEG JFIF
            b'\xff\xd8\xff\xe1',  # JPEG EXIF
            b'\xff\xd8\xff\xdb',  # JPEG raw
        ]
        
        png_signature = b'\x89\x50\x4e\x47\x0d\x0a\x1a\x0a'  # PNG
        
        # Verificar signatures
        for sig in jpeg_signatures:
            if content.startswith(sig):
                return True
        
        if content.startswith(png_signature):
            return True
        
        return False
    
    @staticmethod
    def generate_secure_filename(original_filename: str) -> str:
        """Generar nombre de archivo seguro"""
        import uuid
        import os
        
        # Sanitizar nombre original
        safe_name = sanitize_filename(original_filename)
        
        # Obtener extensión
        _, ext = os.path.splitext(safe_name)
        
        # Generar nombre único
        unique_name = f"{uuid.uuid4().hex}{ext}"
        
        return unique_name

def validate_image_content(file_path: str) -> bool:
    """Validar que el archivo sea realmente una imagen usando magic numbers"""
    if MAGIC_AVAILABLE:
        try:
            mime = magic.Magic(mime=True)
            file_type = mime.from_file(file_path)
            return file_type in ['image/jpeg', 'image/png', 'image/jpg']
        except Exception as e:
            logger.warning(f"Error usando python-magic: {e}")
    
    # Fallback usando PIL
    try:
        with Image.open(file_path) as img:
            img.verify()
        return True
    except Exception as e:
        logger.warning(f"Validación de imagen falló: {e}")
        return False

def generate_realistic_probability(image_size: tuple) -> float:
    """Generar probabilidad realista basada en características de la imagen"""
    width, height = image_size
    
    # Factores que pueden influir en el resultado (simulado)
    size_factor = min(width, height) / 1000  # Imágenes más grandes pueden tener mejor análisis
    
    # Distribución más realista: mayoría de casos son de bajo riesgo
    base_probability = random.choices(
        [
            random.uniform(5, 25),   # Bajo riesgo (70% de casos)
            random.uniform(25, 55),  # Riesgo moderado (20% de casos)
            random.uniform(55, 85)   # Alto riesgo (10% de casos)
        ],
        weights=[70, 20, 10]
    )[0]
    
    # Ajustar ligeramente por calidad de imagen
    quality_adjustment = random.uniform(-5, 5) * size_factor
    
    final_probability = max(5, min(85, base_probability + quality_adjustment))
    return round(final_probability, 1)

@router.post("/upload", response_model=AnalysisResponse)
async def analyze_image(
    file: UploadFile = File(...),
    current_user: Optional[User] = Depends(get_current_user)
):
    """
    Endpoint para análisis de imágenes de piel con IA simulada
    Requiere autenticación opcional para logging
    """
    temp_path = None
    
    try:
        logger.info(f"Iniciando análisis de imagen: {file.filename}")
        
        # Validar que se subió un archivo
        if not file or not file.filename:
            logger.warning("Intento de análisis sin archivo")
            return AnalysisResponse(
                success=False,
                error="NO_FILE",
                message="No se ha proporcionado ningún archivo"
            )
        
        # Validar tipo de archivo por content-type
        if file.content_type not in settings.ALLOWED_FILE_TYPES:
            logger.warning(f"Tipo de archivo no válido: {file.content_type}")
            return AnalysisResponse(
                success=False,
                error="INVALID_FILE_TYPE",
                message="Tipo de archivo no válido. Solo se permiten JPG y PNG"
            )
        
        # Leer contenido del archivo
        content = await file.read()
        
        # Validaciones de seguridad
        if not FileUploadSecurity.validate_file_size(len(content)):
            logger.warning(f"Archivo demasiado grande: {len(content)} bytes")
            return AnalysisResponse(
                success=False,
                error="FILE_SIZE_EXCEEDED",
                message=f"El archivo es demasiado grande. Máximo {settings.MAX_FILE_SIZE / (1024*1024):.1f}MB"
            )
        
        # Validar signature del archivo
        if not FileUploadSecurity.validate_file_signature(content):
            logger.warning(f"Signature de archivo inválida: {file.filename}")
            return AnalysisResponse(
                success=False,
                error="INVALID_FILE_SIGNATURE",
                message="El archivo no es una imagen válida"
            )
        
        # Validar que el archivo no esté vacío
        if len(content) == 0:
            logger.warning("Archivo vacío recibido")
            return AnalysisResponse(
                success=False,
                error="EMPTY_FILE",
                message="El archivo está vacío"
            )
        
        # Crear archivo temporal con nombre seguro
        secure_filename = FileUploadSecurity.generate_secure_filename(file.filename)
        temp_path = os.path.join(settings.UPLOAD_DIR, secure_filename)
        
        # Guardar archivo temporalmente
        async with aiofiles.open(temp_path, 'wb') as temp_file:
            await temp_file.write(content)
        
        # Validar que es realmente una imagen
        if not validate_image_content(temp_path):
            logger.warning(f"Archivo no es una imagen válida: {file.filename}")
            return AnalysisResponse(
                success=False,
                error="INVALID_IMAGE",
                message="El archivo no es una imagen válida o está corrupto"
            )
        
        # Obtener metadatos de la imagen
        try:
            with Image.open(temp_path) as img:
                width, height = img.size
                format_name = img.format
                mode = img.mode
                
                # Validar dimensiones mínimas
                if width < 50 or height < 50:
                    return AnalysisResponse(
                        success=False,
                        error="IMAGE_TOO_SMALL",
                        message="La imagen es demasiado pequeña. Mínimo 50x50 píxeles"
                    )
                
                image_metadata = ImageMetadata(
                    size=len(content),
                    type=file.content_type,
                    dimensions={
                        "width": width, 
                        "height": height,
                        "format": format_name,
                        "mode": mode
                    }
                )
        except Exception as img_error:
            logger.error(f"Error procesando imagen: {str(img_error)}")
            return AnalysisResponse(
                success=False,
                error="IMAGE_PROCESSING_ERROR",
                message="Error al procesar la imagen. Verifique que sea un archivo válido"
            )
        
        # Análisis con modelo de IA simulado
        logger.info("Iniciando análisis con modelo de IA")
        
        try:
            # Usar el modelo de IA simulado
            ai_result = await ai_model.analyze_image(temp_path)
            
            probability = ai_result['probability']
            confidence = ai_result['confidence']
            actual_processing_time = ai_result['processing_time']
            
            # Agregar información adicional del modelo
            logger.info(f"Modelo IA - Versión: {ai_result['model_version']}, Calidad imagen: {ai_result['image_quality_score']}")
            
        except Exception as ai_error:
            logger.error(f"Error en modelo IA, usando fallback: {ai_error}")
            
            # Fallback al método anterior si el modelo IA falla
            processing_start = time.time()
            
            base_time = settings.PROCESSING_TIME_MIN
            size_factor = (width * height) / (1024 * 1024)
            processing_time = base_time + (size_factor * 0.5)
            processing_time = min(processing_time, settings.PROCESSING_TIME_MAX)
            
            await asyncio.sleep(processing_time)
            
            probability = generate_realistic_probability((width, height))
            
            base_confidence = 0.85
            quality_factor = min(width, height) / 1000
            confidence = min(0.95, base_confidence + (quality_factor * 0.1))
            confidence = round(confidence, 2)
            
            processing_end = time.time()
            actual_processing_time = round(processing_end - processing_start, 2)
        
        result = AnalysisResult(
            probability=probability,
            processing_time=actual_processing_time,
            confidence=confidence,
            timestamp=datetime.now().isoformat(),
            image_metadata=image_metadata
        )
        
        logger.info(f"Análisis completado: {probability}% probabilidad, {confidence} confianza")
        
        return AnalysisResponse(
            success=True,
            result=result,
            message="Análisis completado exitosamente"
        )
        
    except Exception as e:
        logger.error(f"Error durante análisis: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno durante el procesamiento de la imagen"
        )
        
    finally:
        # Eliminar archivo temporal por seguridad
        if temp_path and os.path.exists(temp_path):
            try:
                os.remove(temp_path)
                logger.info(f"Archivo temporal eliminado: {temp_path}")
            except Exception as cleanup_error:
                logger.error(f"Error eliminando archivo temporal: {cleanup_error}")

@router.get("/health")
async def analysis_health():
    """
    Health check para el servicio de análisis
    """
    return {
        "status": "healthy",
        "service": "analysis",
        "version": "1.0.0",
        "limits": {
            "max_file_size_mb": round(settings.MAX_FILE_SIZE / (1024 * 1024), 1),
            "allowed_types": settings.ALLOWED_FILE_TYPES,
            "processing_time_range": f"{settings.PROCESSING_TIME_MIN}-{settings.PROCESSING_TIME_MAX}s"
        },
        "upload_dir": settings.UPLOAD_DIR,
        "timestamp": datetime.now().isoformat()
    }

@router.get("/model-info")
async def get_model_info():
    """
    Información del modelo de IA
    """
    return ai_model.get_model_info()

@router.get("/stats")
async def analysis_stats():
    """
    Estadísticas del servicio de análisis (simuladas)
    """
    return {
        "total_analyses": random.randint(1000, 5000),
        "analyses_today": random.randint(50, 200),
        "average_processing_time": round(random.uniform(2.5, 4.5), 2),
        "success_rate": round(random.uniform(0.95, 0.99), 3),
        "most_common_result_range": "10-30% (bajo riesgo)",
        "model_info": ai_model.get_model_info(),
        "timestamp": datetime.now().isoformat()
    }