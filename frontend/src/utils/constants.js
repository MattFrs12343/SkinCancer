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