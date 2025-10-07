# Design Document

## Overview

Este documento describe el diseño para integrar un modelo de inteligencia artificial real en el sistema OncoDerma, reemplazando el modelo simulado actual. La integración mantendrá la compatibilidad con la API existente mientras proporciona análisis reales de imágenes de piel usando modelos de deep learning pre-entrenados.

El diseño se enfoca en una arquitectura modular que permita intercambiar diferentes modelos de IA, mantener el rendimiento del sistema, y proporcionar un fallback robusto al modo simulado cuando sea necesario.

## Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   FastAPI       │    │   AI Engine     │
│   (React)       │◄──►│   Backend       │◄──►│   Manager       │
│                 │    │                 │    │                 │
│ • File Upload   │    │ • Validation    │    │ • Model Loader  │
│ • Results UI    │    │ • Processing    │    │ • Inference     │
│ • Progress      │    │ • Error Handle  │    │ • Preprocessing │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                       │
                                │                       ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │   Fallback      │    │   Model Storage │
                       │   Simulator     │    │                 │
                       │                 │    │ • TensorFlow    │
                       │ • Backup Mode   │    │ • PyTorch       │
                       │ • Same API      │    │ • ONNX          │
                       └─────────────────┘    └─────────────────┘
```

### AI Model Integration Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        AI Engine Manager                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   Model Loader  │  │  Preprocessor   │  │  Postprocessor  │ │
│  │                 │  │                 │  │                 │ │
│  │ • Load Models   │  │ • Resize        │  │ • Probability   │ │
│  │ • Validation    │  │ • Normalize     │  │ • Confidence    │ │
│  │ • Hot Swap      │  │ • Augment       │  │ • Metadata      │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │ TensorFlow Hub  │  │  PyTorch Model  │  │   ONNX Runtime  │ │
│  │                 │  │                 │  │                 │ │
│  │ • EfficientNet  │  │ • ResNet        │  │ • Optimized     │ │
│  │ • MobileNet     │  │ • DenseNet      │  │ • Cross-platform│ │
│  │ • Custom Models │  │ • Vision Trans. │  │ • Fast Inference│ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. AI Engine Manager

**Responsabilidad**: Gestionar la carga, configuración y ejecución de modelos de IA.

```python
class AIEngineManager:
    def __init__(self, config: AIConfig)
    async def load_model(self, model_path: str, model_type: str) -> bool
    async def predict(self, image_tensor: np.ndarray) -> PredictionResult
    async def get_model_info(self) -> ModelInfo
    async def health_check(self) -> HealthStatus
    def hot_swap_model(self, new_model_path: str) -> bool
```

**Interfaces**:
- `ModelLoader`: Carga diferentes tipos de modelos (TensorFlow, PyTorch, ONNX)
- `ModelValidator`: Valida que los modelos cargados funcionen correctamente
- `ConfigManager`: Gestiona configuración de modelos desde archivos

### 2. Image Preprocessor

**Responsabilidad**: Preparar imágenes para el análisis del modelo de IA.

```python
class ImagePreprocessor:
    def __init__(self, target_size: Tuple[int, int], normalization: str)
    async def preprocess(self, image_path: str) -> np.ndarray
    def resize_image(self, image: Image, target_size: Tuple[int, int]) -> Image
    def normalize_pixels(self, image_array: np.ndarray) -> np.ndarray
    def validate_image_quality(self, image: Image) -> QualityMetrics
```

**Características**:
- Redimensionado inteligente manteniendo aspect ratio
- Normalización según el modelo (ImageNet, custom)
- Validación de calidad de imagen
- Augmentación de datos para mejorar robustez

### 3. Model Inference Engine

**Responsabilidad**: Ejecutar inferencia en los modelos cargados.

```python
class InferenceEngine:
    def __init__(self, model_type: str)
    async def predict(self, preprocessed_image: np.ndarray) -> RawPrediction
    def batch_predict(self, images: List[np.ndarray]) -> List[RawPrediction]
    def get_attention_maps(self, image: np.ndarray) -> AttentionMap
    def explain_prediction(self, prediction: RawPrediction) -> Explanation
```

**Soporte para**:
- TensorFlow/Keras models (.h5, SavedModel)
- PyTorch models (.pth, .pt)
- ONNX models (.onnx)
- TensorFlow Lite (.tflite) para optimización

### 4. Result Postprocessor

**Responsabilidad**: Convertir predicciones raw en resultados interpretables.

```python
class ResultPostprocessor:
    def __init__(self, class_mapping: Dict[int, str])
    def process_prediction(self, raw_prediction: RawPrediction) -> AnalysisResult
    def calculate_confidence(self, prediction_scores: np.ndarray) -> float
    def generate_recommendations(self, result: AnalysisResult) -> Recommendations
    def create_attention_visualization(self, attention_map: AttentionMap) -> Image
```

### 5. Fallback Manager

**Responsabilidad**: Gestionar el fallback al modo simulado cuando el modelo real falla.

```python
class FallbackManager:
    def __init__(self, simulator: SkinCancerAIModel)
    async def should_use_fallback(self) -> bool
    async def execute_fallback(self, image_path: str) -> AnalysisResult
    def log_fallback_usage(self, reason: str) -> None
    def get_fallback_stats(self) -> FallbackStats
```

## Data Models

### Configuration Models

```python
@dataclass
class AIConfig:
    model_path: str
    model_type: str  # 'tensorflow', 'pytorch', 'onnx'
    input_size: Tuple[int, int]
    normalization: str  # 'imagenet', 'custom'
    class_names: List[str]
    confidence_threshold: float
    batch_size: int
    use_gpu: bool
    fallback_enabled: bool

@dataclass
class ModelInfo:
    name: str
    version: str
    framework: str
    input_shape: Tuple[int, ...]
    output_classes: List[str]
    accuracy: float
    training_date: str
    model_size_mb: float
```

### Prediction Models

```python
@dataclass
class RawPrediction:
    class_probabilities: np.ndarray
    confidence_score: float
    processing_time: float
    attention_map: Optional[np.ndarray]

@dataclass
class AnalysisResult:
    probability: float  # 0-100
    confidence: float   # 0-1
    class_prediction: str
    processing_time: float
    model_version: str
    attention_regions: Optional[List[BoundingBox]]
    feature_importance: Optional[Dict[str, float]]
    recommendations: Recommendations
```

### Quality Assessment Models

```python
@dataclass
class QualityMetrics:
    resolution_score: float
    brightness_score: float
    contrast_score: float
    blur_score: float
    overall_quality: float
    quality_warnings: List[str]
```

## Error Handling

### Error Categories

1. **Model Loading Errors**
   - Model file not found
   - Incompatible model format
   - Insufficient memory
   - GPU not available

2. **Inference Errors**
   - Input shape mismatch
   - Model prediction failure
   - Timeout during inference
   - Memory allocation errors

3. **Image Processing Errors**
   - Corrupted image data
   - Unsupported format
   - Preprocessing failure
   - Quality too low for analysis

### Error Handling Strategy

```python
class AIErrorHandler:
    def handle_model_error(self, error: Exception) -> ErrorResponse
    def handle_inference_error(self, error: Exception) -> ErrorResponse
    def handle_preprocessing_error(self, error: Exception) -> ErrorResponse
    def should_retry(self, error: Exception) -> bool
    def get_fallback_strategy(self, error: Exception) -> FallbackStrategy
```

**Fallback Hierarchy**:
1. Retry with different preprocessing
2. Use alternative model (if available)
3. Switch to simulated model
4. Return error with detailed message

## Testing Strategy

### Unit Testing

1. **Model Loading Tests**
   - Test loading different model formats
   - Test invalid model handling
   - Test configuration validation

2. **Preprocessing Tests**
   - Test image resizing and normalization
   - Test quality assessment
   - Test edge cases (very small/large images)

3. **Inference Tests**
   - Test prediction accuracy with known samples
   - Test batch processing
   - Test performance benchmarks

### Integration Testing

1. **End-to-End Pipeline Tests**
   - Test complete analysis workflow
   - Test error handling and fallback
   - Test concurrent requests

2. **API Compatibility Tests**
   - Ensure response format matches existing API
   - Test backward compatibility
   - Test performance under load

### Performance Testing

1. **Latency Tests**
   - Single image processing time
   - Batch processing efficiency
   - Memory usage optimization

2. **Throughput Tests**
   - Concurrent request handling
   - Queue management
   - Resource utilization

## Implementation Phases

### Phase 1: Core Infrastructure
- Implement AIEngineManager base class
- Create configuration system
- Set up model loading framework
- Implement basic TensorFlow support

### Phase 2: Preprocessing Pipeline
- Implement ImagePreprocessor
- Add quality assessment
- Create normalization strategies
- Add image validation

### Phase 3: Inference Engine
- Implement TensorFlow inference
- Add PyTorch support
- Implement ONNX runtime
- Add batch processing

### Phase 4: Integration & Testing
- Integrate with existing API
- Implement fallback system
- Add comprehensive testing
- Performance optimization

### Phase 5: Advanced Features
- Add attention maps
- Implement model explanations
- Add hot-swapping capability
- Advanced monitoring and logging

## Configuration Management

### Model Configuration File (models.yaml)

```yaml
models:
  primary:
    name: "SkinLesionClassifier"
    path: "./models/skin_classifier_v2.h5"
    type: "tensorflow"
    input_size: [224, 224]
    normalization: "imagenet"
    classes:
      - "benign"
      - "malignant"
    confidence_threshold: 0.7
    
  fallback:
    name: "LightweightClassifier"
    path: "./models/mobile_classifier.tflite"
    type: "tflite"
    input_size: [128, 128]
    
settings:
  use_gpu: true
  batch_size: 1
  max_processing_time: 15
  fallback_enabled: true
  log_predictions: true
```

### Environment Variables

```bash
# Model Configuration
AI_MODEL_PATH=./models/skin_classifier_v2.h5
AI_MODEL_TYPE=tensorflow
AI_USE_GPU=true
AI_BATCH_SIZE=1

# Performance Settings
AI_MAX_PROCESSING_TIME=15
AI_MEMORY_LIMIT=2048

# Fallback Settings
AI_FALLBACK_ENABLED=true
AI_FALLBACK_THRESHOLD=3  # failures before fallback
```

## Security Considerations

### Model Security
- Validate model files before loading
- Implement model signing/verification
- Secure model storage and access
- Monitor for model tampering

### Data Privacy
- Ensure temporary image deletion
- No model training on user data
- Secure processing pipeline
- Audit trail for analysis requests

### Resource Protection
- Memory usage limits
- Processing time limits
- Rate limiting for inference
- Resource monitoring and alerts

## Monitoring and Logging

### Metrics to Track
- Model loading success/failure rates
- Inference latency and throughput
- Memory and GPU utilization
- Fallback usage frequency
- Error rates by category

### Logging Strategy
- Structured logging with correlation IDs
- Performance metrics logging
- Error details with stack traces
- Model version and configuration logging
- User interaction logging (anonymized)

## Deployment Considerations

### Model Deployment
- Model versioning strategy
- Blue-green deployment for models
- Rollback procedures
- Health checks for models

### Infrastructure Requirements
- GPU support (optional but recommended)
- Memory requirements (minimum 4GB)
- Storage for model files
- Network bandwidth for model downloads

### Scaling Considerations
- Horizontal scaling with load balancers
- Model caching strategies
- Queue management for high load
- Auto-scaling based on demand