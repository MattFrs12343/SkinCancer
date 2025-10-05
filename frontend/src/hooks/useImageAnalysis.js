import { useState, useCallback } from 'react'
import { analysisService } from '../services/analysisService'
import { ERROR_MESSAGES } from '../utils/constants'

export const useImageAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [progress, setProgress] = useState(0)
  const [connectionStatus, setConnectionStatus] = useState('unknown') // 'online', 'offline', 'unknown'

  // Verificar conectividad
  const checkConnectivity = useCallback(async () => {
    try {
      const isConnected = await analysisService.checkConnectivity()
      setConnectionStatus(isConnected ? 'online' : 'offline')
      return isConnected
    } catch (error) {
      setConnectionStatus('offline')
      return false
    }
  }, [])

  const analyzeImage = useCallback(async (file) => {
    if (!file) {
      setError('No se ha seleccionado ningún archivo')
      return { success: false, message: 'No hay archivo' }
    }

    setIsAnalyzing(true)
    setError(null)
    setResult(null)
    setProgress(0)

    // Verificar conectividad antes del análisis
    const isOnline = await checkConnectivity()

    try {
      // Simular progreso durante el análisis
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return prev
          return prev + Math.random() * 15
        })
      }, 300)

      console.log('Iniciando análisis de imagen...')
      const analysisResult = await analysisService.analyzeImage(file)

      clearInterval(progressInterval)
      setProgress(100)

      if (analysisResult.success) {
        setResult(analysisResult)
        setError(null)
        
        console.log('Análisis completado exitosamente:', analysisResult)
        
        return {
          success: true,
          result: analysisResult,
          isSimulated: analysisResult.isSimulated || false
        }
      } else {
        const errorMessage = analysisResult.error 
          ? ERROR_MESSAGES[analysisResult.error] || analysisResult.message
          : analysisResult.message || 'Error al procesar la imagen'
        
        setError(errorMessage)
        setResult(null)
        
        console.error('Error en análisis:', errorMessage)
        
        return {
          success: false,
          message: errorMessage,
          error: analysisResult.error
        }
      }
    } catch (err) {
      console.error('Error inesperado en análisis:', err)
      
      const errorMessage = 'Error de conexión. Inténtalo de nuevo.'
      setError(errorMessage)
      setResult(null)
      
      return {
        success: false,
        message: errorMessage,
        error: 'NETWORK_ERROR'
      }
    } finally {
      setIsAnalyzing(false)
      // Mantener el progreso en 100% por un momento antes de resetear
      setTimeout(() => {
        if (!isAnalyzing) {
          setProgress(0)
        }
      }, 2000)
    }
  }, [checkConnectivity])

  const reset = useCallback(() => {
    setIsAnalyzing(false)
    setResult(null)
    setError(null)
    setProgress(0)
  }, [])

  // Obtener información del modelo
  const getModelInfo = useCallback(async () => {
    try {
      const modelInfo = await analysisService.getModelInfo()
      return modelInfo
    } catch (error) {
      console.error('Error obteniendo info del modelo:', error)
      return { success: false, message: 'Error obteniendo información del modelo' }
    }
  }, [])

  // Verificar estado del servicio
  const checkServiceHealth = useCallback(async () => {
    try {
      const health = await analysisService.checkHealth()
      return health
    } catch (error) {
      console.error('Error verificando salud del servicio:', error)
      return { healthy: false, message: 'Error verificando servicio' }
    }
  }, [])

  return {
    // Estados
    isAnalyzing,
    result,
    error,
    progress,
    connectionStatus,
    
    // Acciones
    analyzeImage,
    reset,
    checkConnectivity,
    getModelInfo,
    checkServiceHealth
  }
}