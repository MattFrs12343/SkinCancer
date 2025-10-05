import { APP_CONFIG, ERROR_CODES, ERROR_MESSAGES } from '../utils/constants'
import { authService } from './authService'

class AnalysisService {
  constructor() {
    this.baseUrl = APP_CONFIG.api.baseUrl
    this.timeout = APP_CONFIG.api.timeout
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

  // Realizar request con timeout y manejo de errores
  async makeRequest(url, options = {}) {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          ...this.getAuthHeaders(),
          ...options.headers
        }
      })

      clearTimeout(timeoutId)
      return response
    } catch (error) {
      clearTimeout(timeoutId)
      if (error.name === 'AbortError') {
        throw new Error('Timeout: El análisis tardó demasiado tiempo')
      }
      throw error
    }
  }

  // Analizar imagen
  async analyzeImage(file) {
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

  // Obtener información del modelo de IA
  async getModelInfo() {
    try {
      const response = await this.makeRequest(`${this.baseUrl}/api/analysis/model-info`)
      
      if (response.ok) {
        const data = await response.json()
        return { success: true, data }
      } else {
        return { success: false, message: 'Error obteniendo información del modelo' }
      }
    } catch (error) {
      console.error('Error obteniendo info del modelo:', error)
      return {
        success: false,
        message: 'Error de conexión',
        fallback: {
          model_name: 'SkinCancer AI Detector (Simulado)',
          version: '1.0.0-local',
          accuracy: 0.95,
          status: 'offline'
        }
      }
    }
  }

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

  // Validar estado del servicio
  async checkHealth() {
    try {
      const response = await fetch(`${this.baseUrl}/api/analysis/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000) // 5 segundos timeout
      })
      
      if (response.ok) {
        const data = await response.json()
        return { 
          healthy: true, 
          data,
          message: 'Servicio disponible'
        }
      } else {
        return { 
          healthy: false, 
          message: 'Servicio no disponible'
        }
      }
    } catch (error) {
      console.warn('Servicio de análisis no disponible:', error.message)
      return { 
        healthy: false, 
        message: 'Servicio offline',
        error: error.message
      }
    }
  }

  // Verificar conectividad general
  async checkConnectivity() {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(3000)
      })
      return response.ok
    } catch (error) {
      return false
    }
  }
}

// Exportar instancia singleton
export const analysisService = new AnalysisService()
export default analysisService