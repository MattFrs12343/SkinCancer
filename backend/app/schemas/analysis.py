from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ImageMetadata(BaseModel):
    size: int
    type: str
    dimensions: dict

class AnalysisResult(BaseModel):
    probability: float  # 0-100
    processing_time: float  # segundos
    confidence: float  # 0-1
    timestamp: str
    image_metadata: ImageMetadata

class AnalysisResponse(BaseModel):
    success: bool
    result: Optional[AnalysisResult] = None
    error: Optional[str] = None
    message: Optional[str] = None