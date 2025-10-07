import { useState, useCallback, useRef } from 'react'
import { analysisService } from '../services/analysisService'
import { ERROR_MESSAGES } from '../utils/constants'
import { useAPICache } from '../utils/apiCache'
import { compressImage } from '../utils/optimization'

export const useImageAnalysis = () => {
  // Estados simples y confiables
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [progress, setProgress] = useState(0)
  const [connectionStatus, setConnectionStatus] = useState('unknown')

  // Referencias para evitar re-creaciones
  const progressIntervalRef = useRef(null)
  const abortControllerRef = useRef(null)
  const fileHashRef = useRef(null)

  // Hook de caché
  const cache = useAPICache()

  // Generar hash simple del archivo para caché
  const generateFileHash = useCallback(async (file) => {
    const buffer = await file.arrayBuffer()
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }, [])

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

    // Generar hash del archivo para caché
    const fileHash = await generateFileHash(file)
    fileHashRef.current = fileHash

    // Verificar si ya tenemos este resultado en caché
    const cachedResult = cache.get(`analysis:${fileHash}`)
    if (cachedResult) {
      console.log('Usando resultado desde caché')
      setResult(cachedResult)
      setError(null)
      setProgress(100)
      return {
        success: true,
        result: cachedResult,
        fromCache: true
      }
    }

    // Cancelar análisis anterior si existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    abortControllerRef.current = new AbortController()

    setIsAnalyzing(true)
    setError(null)
    setResult(null)
    setProgress(0)

    // Verificar conectividad antes del análisis
    const isOnline = await checkConnectivity()

    try {
      // Comprimir imagen antes del análisis para mejor performance
      const compressedFile = await compressImage(file, 1024, 0.8)
      console.log(`Imagen comprimida: ${file.size} -> ${compressedFile.size} bytes`)
      // Simular progreso durante el análisis
      progressIntervalRef.current = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return prev
          return Math.min(prev + Math.random() * 15, 90)
        })
      }, 300)

      console.log('Iniciando análisis de imagen...')
      const analysisResult = await analysisService.analyzeImage(compressedFile, {
        signal: abortControllerRef.current.signal
      })

      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
      setProgress(100)

      if (analysisResult.success) {
        // Guardar resultado en caché por 30 minutos
        cache.set(`analysis:${fileHash}`, analysisResult, 30 * 60 * 1000)
        
        setResult(analysisResult)
        setError(null)
        
        console.log('Análisis completado exitosamente:', analysisResult)
        
        return {
          success: true,
          result: analysisResult,
          isSimulated: analysisResult.isSimulated || false,
          fromCache: false
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
      if (err.name === 'AbortError') {
        console.log('Análisis cancelado')
        return { success: false, message: 'Análisis cancelado' }
      }

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
      
      // Limpiar intervalos
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
      
      // Resetear progreso después de un tiempo
      setTimeout(() => {
        setProgress(0)
      }, 2000)
    }
  }, [checkConnectivity])

  const reset = useCallback(() => {
    // Cancelar análisis en curso
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    
    // Limpiar intervalos
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
    }

    setIsAnalyzing(false)
    setResult(null)
    setError(null)
    setProgress(0)
    // Mantener connectionStatus
  }, [])

  // Obtener información del modelo con caché
  const getModelInfo = useCallback(async () => {
    try {
      const modelInfo = await analysisService.getModelInfo()
      return modelInfo
    } catch (error) {
      console.error('Error obteniendo info del modelo:', error)
      return { success: false, message: 'Error obteniendo información del modelo' }
    }
  }, [])

  // Verificar estado del servicio con caché
  const checkServiceHealth = useCallback(async () => {
    try {
      const health = await analysisService.checkHealth()
      return health
    } catch (error) {
      console.error('Error verificando salud del servicio:', error)
      return { healthy: false, message: 'Error verificando servicio' }
    }
  }, [])

  // Cleanup al desmontar
  const cleanup = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
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
    checkServiceHealth,
    cleanup
  }
}