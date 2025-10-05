import { APP_CONFIG, ERROR_CODES, ERROR_MESSAGES } from '../utils/constants'
import { authService } from './authService'
import cacheService, { withCache } from './cacheService'

class AnalysisService {
  constructor() {
    this.baseUrl = APP_CONFIG.api.baseUrl
    this.timeout = APP_CONFIG.api.timeout
    this.requestCache = new Map()
    this.lastHealthCheck = null
    this.healthCheckInterval = 30000 // 30 segundos
  }

  // Crear headers con autenticación
  getAuthHeaders() {
    const token = authService.getToken()
    const headers = {}
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    return headers
  }

  // Realizar request con timeout, caché y manejo de errores optimizado
  async makeRequest(url, options = {}) {
    const { signal: externalSignal, ...restOptions } = options
    const controller = new AbortController()
    
    // Combinar señales de abort si existe una externa
    if (externalSignal) {
      externalSignal.addEventListener('abort', () => controller.abort())
    }
    
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    // Generar clave de caché para requests GET
    const cacheKey = options.method === 'GET' ? `request_${url}` : null
    
    // Verificar caché para requests GET
    if (cacheKey && cacheService.has(cacheKey)) {
      clearTimeout(timeoutId)
      return { 
        ok: true, 
        json: () => Promise.resolve(cacheService.get(cacheKey))
      }
    }

    try {
      const response = await fetch(url, {
        ...restOptions,
        signal: controller.signal,
        headers: {
          ...this.getAuthHeaders(),
          ...restOptions.headers
        }
      })

      clearTimeout(timeoutId)
      
      // Guardar en caché si es exitoso y es GET
      if (response.ok && cacheKey) {
        const data = await response.clone().json()
        cacheService.set(cacheKey, data, 60000) // 1 minuto de caché
      }
      
      return response
    } catch (error) {
      clearTimeout(timeoutId)
      if (error.name === 'AbortError') {
        throw new Error('Timeout: El análisis tardó demasiado tiempo')
      }
      throw error
    }
  }

  // Generar hash de archivo para caché
  async generateFileHash(file) {
    const buffer = await file.arrayBuffer()
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }

  // Analizar imagen
  async analyzeImage(file, options = {}) {
    try {
      console.log('Iniciando análisis de imagen:', file.name)
      
      // Validar archivo antes de enviar
      const validation = this.validateFile(file)
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.errorCode,
          message: validation.message
        }
      }

      // Crear FormData para enviar la imagen
      const formData = new FormData()
      formData.append('file', file)

      console.log('Enviando imagen al servidor...')
      const response = await this.makeRequest(`${this.baseUrl}/api/analysis/upload`, {
        method: 'POST',
        body: formData,
        signal: options.signal,
        // No establecer Content-Type, el navegador lo hará automáticamente con boundary
      })

      const data = await response.json()
      console.log('Respuesta del servidor:', data)

      if (response.ok && data.success) {
        return {
          success: true,
          result: data.result,
          message: data.message || 'Análisis completado exitosamente'
        }
      } else {
        return {
          success: false,
          error: data.error || ERROR_CODES.PROCESSING_FAILED,
          message: data.message || ERROR_MESSAGES[ERROR_CODES.PROCESSING_FAILED]
        }
      }
    } catch (error) {
      console.error('Error en análisis:', error)
      
      // Si hay error de red, intentar análisis local simulado
      if (error.message.includes('fetch') || error.message.includes('Timeout') || error.message.includes('NetworkError')) {
        console.log('Error de conexión, usando análisis local simulado...')
        return this.simulateAnalysis(file)
      }
      
      return {
        success: false,
        error: ERROR_CODES.NETWORK_ERROR,
        message: ERROR_MESSAGES[ERROR_CODES.NETWORK_ERROR]
      }
    }
  }

  // Validar archivo antes del análisis
  validateFile(file) {
    if (!file) {
      return {
        isValid: false,
        errorCode: 'NO_FILE',
        message: 'No se ha seleccionado ningún archivo'
      }
    }

    // Validar tipo de archivo
    if (!APP_CONFIG.upload.allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        errorCode: ERROR_CODES.FILE_INVALID_TYPE,
        message: ERROR_MESSAGES[ERROR_CODES.FILE_INVALID_TYPE]
      }
    }

    // Validar tamaño de archivo
    if (file.size > APP_CONFIG.upload.maxFileSize) {
      return {
        isValid: false,
        errorCode: ERROR_CODES.FILE_TOO_LARGE,
        message: ERROR_MESSAGES[ERROR_CODES.FILE_TOO_LARGE]
      }
    }

    // Validar que no esté vacío
    if (file.size === 0) {
      return {
        isValid: false,
        errorCode: 'EMPTY_FILE',
        message: 'El archivo está vacío'
      }
    }

    return { isValid: true }
  }

  // Análisis simulado local (fallback)
  simulateAnalysis(file) {
    return new Promise((resolve) => {
      console.log('Ejecutando análisis simulado local...')
      
      // Simular tiempo de procesamiento realista
      const processingTime = Math.random() * 3 + 2 // 2-5 segundos
      
      setTimeout(() => {
        // Generar resultado simulado con distribución realista
        const riskCategories = [
          { min: 5, max: 25, weight: 70 },   // Bajo riesgo (70%)
          { min: 25, max: 55, weight: 20 },  // Riesgo moderado (20%)
          { min: 55, max: 85, weight: 10 }   // Alto riesgo (10%)
        ]
        
        const random = Math.random() * 100
        let cumulative = 0
        let selectedCategory = riskCategories[0]
        
        for (const category of riskCategories) {
          cumulative += category.weight
          if (random <= cumulative) {
            selectedCategory = category
            break
          }
        }
        
        const probability = Math.round(
          Math.random() * (selectedCategory.max - selectedCategory.min) + selectedCategory.min
        )
        
        const confidence = Math.random() * 0.2 + 0.75 // 0.75-0.95
        
        // Simular metadatos de imagen
        const imageMetadata = {
          size: file.size,
          type: file.type,
          dimensions: {
            width: Math.floor(Math.random() * 1000) + 500,
            height: Math.floor(Math.random() * 1000) + 500,
            format: file.type.split('/')[1].toUpperCase(),
            mode: 'RGB'
          }
        }
        
        const result = {
          probability,
          processing_time: Math.round(processingTime * 100) / 100,
          confidence: Math.round(confidence * 100) / 100,
          timestamp: new Date().toISOString(),
          image_metadata: imageMetadata
        }

        console.log('Análisis simulado completado:', result)

        resolve({
          success: true,
          result,
          message: 'Análisis completado (modo simulado - sin conexión)',
          isSimulated: true
        })
      }, processingTime * 1000)
    })
  }

  // Obtener información del modelo de IA con caché
  getModelInfo = withCache(
    async () => {
      const response = await this.makeRequest(`${this.baseUrl}/api/analysis/model-info`, {
        method: 'GET'
      })
      
      if (response.ok) {
        const data = await response.json()
        return { success: true, data }
      } else {
        return { success: false, message: 'Error obteniendo información del modelo' }
      }
    },
    () => 'model_info',
    300000 // 5 minutos de caché
  )

  // Obtener estadísticas del servicio
  async getStats() {
    try {
      const response = await this.makeRequest(`${this.baseUrl}/api/analysis/stats`)
      
      if (response.ok) {
        const data = await response.json()
        return { success: true, data }
      } else {
        return { success: false, message: 'Error obteniendo estadísticas' }
      }
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error)
      return { success: false, message: 'Error de conexión' }
    }
  }

  // Validar estado del servicio con caché inteligente
  async checkHealth() {
    const now = Date.now()
    
    // Usar caché si el último check fue reciente
    if (this.lastHealthCheck && (now - this.lastHealthCheck.timestamp) < this.healthCheckInterval) {
      return this.lastHealthCheck.result
    }

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)

      const response = await fetch(`${this.baseUrl}/api/analysis/health`, {
        method: 'GET',
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      let result
      if (response.ok) {
        const data = await response.json()
        result = { 
          healthy: true, 
          data,
          message: 'Servicio disponible'
        }
      } else {
        result = { 
          healthy: false, 
          message: 'Servicio no disponible'
        }
      }

      // Guardar en caché
      this.lastHealthCheck = {
        timestamp: now,
        result
      }

      return result
    } catch (error) {
      console.warn('Servicio de análisis no disponible:', error.message)
      
      const result = { 
        healthy: false, 
        message: 'Servicio offline',
        error: error.message
      }

      // Guardar resultado negativo en caché por menos tiempo
      this.lastHealthCheck = {
        timestamp: now,
        result
      }

      return result
    }
  }

  // Verificar conectividad general con caché
  checkConnectivity = withCache(
    async () => {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 3000)
        
        const response = await fetch(`${this.baseUrl}/health`, {
          method: 'GET',
          signal: controller.signal
        })
        
        clearTimeout(timeoutId)
        return response.ok
      } catch (error) {
        return false
      }
    },
    () => 'connectivity_check',
    10000 // 10 segundos de caché
  )

  // Limpiar caché manualmente
  clearCache() {
    this.requestCache.clear()
    this.lastHealthCheck = null
    cacheService.clear()
  }

  // Obtener estadísticas de rendimiento
  getPerformanceStats() {
    return {
      cacheStats: cacheService.getStats(),
      lastHealthCheck: this.lastHealthCheck?.timestamp,
      requestCacheSize: this.requestCache.size
    }
  }
}

// Exportar instancia singleton
export const analysisService = new AnalysisService()
export default analysisService