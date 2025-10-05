// Configuración de la aplicación
export const APP_CONFIG = {
  colors: {
    primary: '#0F172A',
    secondary: '#1E3A8A',
    accent: '#06B6D4',
    background: '#E2E8F0',
    white: '#FFFFFF',
  },
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
    timeout: 30000,
  },
  upload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png'],
  },
  auth: {
    // Contraseña estática para todos los usuarios
    staticPassword: '1234',
    // Lista de usuarios válidos
    validUsers: [
      {
        username: 'Matias',
        displayName: 'Matias Franco',
        role: 'Administrador',
        email: 'matias@oncoderma.com'
      },
      {
        username: 'Bianca',
        displayName: 'Bianca Sánchez',
        role: 'Doctora',
        email: 'bianca@oncoderma.com'
      },
      {
        username: 'Melissa',
        displayName: 'Melissa Duran',
        role: 'Especialista',
        email: 'melissa@oncoderma.com'
      },
      {
        username: 'Carlos',
        displayName: 'Carlos Berrios',
        role: 'Médico',
        email: 'carlos@oncoderma.com'
      },
      {
        username: 'Invitado',
        displayName: 'Usuario Invitado',
        role: 'Invitado',
        email: 'invitado@oncoderma.com'
      }
    ],
    // Credenciales legacy (mantener compatibilidad)
    credentials: {
      username: 'admin',
      password: '1234'
    }
  }
}

// Códigos de error
export const ERROR_CODES = {
  AUTH_INVALID_CREDENTIALS: 'INVALID_CREDS',
  FILE_TOO_LARGE: 'FILE_SIZE_EXCEEDED',
  FILE_INVALID_TYPE: 'INVALID_FILE_TYPE',
  PROCESSING_FAILED: 'AI_PROCESSING_ERROR',
  NETWORK_ERROR: 'NETWORK_UNAVAILABLE'
}

// Mensajes de error en español
export const ERROR_MESSAGES = {
  [ERROR_CODES.AUTH_INVALID_CREDENTIALS]: 'Usuario o contraseña incorrectos',
  [ERROR_CODES.FILE_TOO_LARGE]: 'El archivo es demasiado grande. Máximo 10MB',
  [ERROR_CODES.FILE_INVALID_TYPE]: 'Tipo de archivo no válido. Solo se permiten JPG y PNG',
  [ERROR_CODES.PROCESSING_FAILED]: 'Error al procesar la imagen. Inténtalo de nuevo',
  [ERROR_CODES.NETWORK_ERROR]: 'Error de conexión. Verifica tu internet',
}

// Algoritmos de análisis inteligente
export const ANALYSIS_ALGORITHMS = {
  // Patrones de distribución basados en datos médicos reales
  DISTRIBUTION_PATTERNS: {
    // Distribución por edad
    age_based: {
      young: { nv: 0.6, bkl: 0.2, vasc: 0.15, df: 0.03, akiec: 0.01, bcc: 0.005, mel: 0.005 },
      adult: { nv: 0.45, bkl: 0.25, vasc: 0.1, df: 0.08, akiec: 0.07, bcc: 0.03, mel: 0.02 },
      elderly: { nv: 0.3, bkl: 0.35, akiec: 0.15, bcc: 0.1, vasc: 0.05, df: 0.03, mel: 0.02 }
    },
    // Distribución por características de imagen simuladas
    image_features: {
      regular_borders: { nv: 0.7, bkl: 0.2, vasc: 0.05, df: 0.03, akiec: 0.015, bcc: 0.004, mel: 0.001 },
      irregular_borders: { mel: 0.15, bcc: 0.2, akiec: 0.25, nv: 0.2, bkl: 0.15, vasc: 0.03, df: 0.02 },
      uniform_color: { nv: 0.6, bkl: 0.25, vasc: 0.1, df: 0.03, akiec: 0.015, bcc: 0.004, mel: 0.001 },
      varied_color: { mel: 0.2, akiec: 0.3, bcc: 0.15, nv: 0.15, bkl: 0.15, vasc: 0.03, df: 0.02 }
    }
  },
  
  // Factores de riesgo
  RISK_FACTORS: {
    size_large: { mel: 1.5, bcc: 1.3, akiec: 1.2 },
    asymmetry: { mel: 2.0, bcc: 1.4, akiec: 1.3 },
    color_variation: { mel: 1.8, akiec: 1.5, bcc: 1.2 },
    border_irregular: { mel: 1.7, bcc: 1.3, akiec: 1.4 }
  },
  
  // Confianza del modelo según características
  CONFIDENCE_FACTORS: {
    high_quality_image: 0.95,
    medium_quality_image: 0.85,
    low_quality_image: 0.70,
    clear_features: 0.90,
    ambiguous_features: 0.75
  }
}

// Tipos de lesiones dermatológicas
export const SKIN_LESION_TYPES = {
  nv: {
    code: 'nv',
    name: 'Melanocytic Nevus',
    fullName: 'Nevus melanocítico',
    type: 'Benigno',
    isCancer: false,
    severity: 'low',
    icon: '🔵',
    description: 'Lunares comunes, no cancerosos.',
    detailedDescription: 'Lesiones pigmentadas benignas formadas por melanocitos. Generalmente estables y sin riesgo de malignización.',
    characteristics: ['Bordes regulares', 'Color uniforme', 'Simetría', 'Tamaño estable'],
    recommendations: ['Autoexamen mensual', 'Protección solar', 'Consulta si hay cambios'],
    urgency: 'routine',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    gradient: 'from-green-100 to-green-200'
  },
  mel: {
    code: 'mel',
    name: 'Melanoma',
    fullName: 'Melanoma',
    type: 'Maligno',
    isCancer: true,
    severity: 'high',
    icon: '⚠️',
    description: 'Cáncer de piel más agresivo; se origina en los melanocitos.',
    detailedDescription: 'Tumor maligno de melanocitos con alta capacidad metastásica. Requiere evaluación y tratamiento inmediato.',
    characteristics: ['Asimetría', 'Bordes irregulares', 'Color variado', 'Diámetro >6mm', 'Evolución'],
    recommendations: ['Consulta dermatológica URGENTE', 'Biopsia', 'Estadificación', 'Tratamiento oncológico'],
    urgency: 'urgent',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    gradient: 'from-red-100 to-red-200'
  },
  bkl: {
    code: 'bkl',
    name: 'Benign Keratosis-like Lesion',
    fullName: 'Lesiones tipo queratosis benigna',
    type: 'Benigno',
    isCancer: false,
    severity: 'low',
    icon: '🟢',
    description: 'Lesiones similares a queratosis seborreica o lentigo benigno.',
    detailedDescription: 'Lesiones epidérmicas benignas que incluyen queratosis seborreica y lentigo solar. No requieren tratamiento urgente.',
    characteristics: ['Superficie rugosa', 'Color marrón uniforme', 'Bordes bien definidos', 'Crecimiento lento'],
    recommendations: ['Observación', 'Protección solar', 'Consulta si hay cambios rápidos'],
    urgency: 'routine',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    gradient: 'from-green-100 to-emerald-200'
  },
  bcc: {
    code: 'bcc',
    name: 'Basal Cell Carcinoma',
    fullName: 'Carcinoma basocelular',
    type: 'Maligno',
    isCancer: true,
    severity: 'high',
    icon: '🟠',
    description: 'Cáncer de piel más común; crecimiento lento pero invasivo.',
    detailedDescription: 'Carcinoma de células basales. Cáncer de piel más frecuente, localmente invasivo pero raramente metastásico.',
    characteristics: ['Pápula perlada', 'Telangiectasias', 'Ulceración central', 'Bordes elevados'],
    recommendations: ['Consulta dermatológica pronta', 'Biopsia confirmatoria', 'Cirugía de Mohs', 'Seguimiento'],
    urgency: 'priority',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    gradient: 'from-orange-100 to-amber-200'
  },
  akiec: {
    code: 'akiec',
    name: 'Actinic Keratosis / Intraepithelial Carcinoma',
    fullName: 'Queratosis actínica / Carcinoma intraepitelial',
    type: 'Precanceroso / Maligno',
    isCancer: 'potential',
    severity: 'medium',
    icon: '⚠️',
    description: 'Lesión precancerosa que puede transformarse en carcinoma escamoso.',
    detailedDescription: 'Lesión precancerosa causada por daño solar crónico. Riesgo de progresión a carcinoma escamoso.',
    characteristics: ['Superficie rugosa', 'Eritema', 'Descamación', 'Zonas fotoexpuestas'],
    recommendations: ['Evaluación dermatológica', 'Tratamiento preventivo', 'Crioterapia/PDT', 'Protección solar estricta'],
    urgency: 'priority',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    gradient: 'from-yellow-100 to-orange-200'
  },
  vasc: {
    code: 'vasc',
    name: 'Vascular Lesion',
    fullName: 'Lesión vascular',
    type: 'Benigno',
    isCancer: false,
    severity: 'low',
    icon: '🟣',
    description: 'Manchas vasculares o angiomas, no cancerosos.',
    detailedDescription: 'Lesiones vasculares benignas incluyendo hemangiomas, angiomas y malformaciones capilares.',
    characteristics: ['Color rojizo-violáceo', 'Palidez a la presión', 'Bordes bien definidos', 'Superficie lisa'],
    recommendations: ['Observación', 'Tratamiento cosmético opcional', 'Láser vascular si molesta'],
    urgency: 'routine',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    gradient: 'from-purple-100 to-pink-200'
  },
  df: {
    code: 'df',
    name: 'Dermatofibroma',
    fullName: 'Dermatofibroma',
    type: 'Benigno',
    isCancer: false,
    severity: 'low',
    icon: '🟤',
    description: 'Pequeño nódulo cutáneo benigno de origen fibroso.',
    detailedDescription: 'Tumor fibroso benigno de la dermis. Frecuentemente en extremidades, especialmente en mujeres.',
    characteristics: ['Nódulo firme', 'Color marrón', 'Signo del hoyuelo', 'Crecimiento lento'],
    recommendations: ['Observación', 'Extirpación si molesta', 'Confirmación histológica si dudas'],
    urgency: 'routine',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    gradient: 'from-amber-100 to-yellow-200'
  }
}