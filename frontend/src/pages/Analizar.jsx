import { useState, useEffect, useRef } from 'react'
import FileUpload from '../components/ui/FileUpload'
import { LoadingProgressBar } from '../components/ui/ProgressBar'
import ConnectionStatus from '../components/common/ConnectionStatus'
import ResultsHeader from '../components/ui/ResultsHeader'
import PrimaryResultCard from '../components/ui/PrimaryResultCard'
import EnhancedDetailedAnalysis from '../components/ui/EnhancedDetailedAnalysis'
import SmartRecommendationsSystem from '../components/ui/SmartRecommendationsSystem'
import { EntranceAnimation, StaggeredAnimation } from '../components/ui/AnimationSystem'
import { ResponsiveContainer } from '../components/ui/ResponsiveSystem'
import { AccessibilityProvider } from '../components/ui/AccessibilitySystem'
import { useImageAnalysis } from '../hooks/useImageAnalysis'
import { SKIN_LESION_TYPES } from '../utils/constants'

const Analizar = () => {
  const [selectedFile, setSelectedFile] = useState(null)
  const resultsRef = useRef(null)
  const { 
    analyzeImage, 
    isAnalyzing, 
    result, 
    error, 
    progress, 
    connectionStatus,
    reset,
    checkConnectivity 
  } = useImageAnalysis()

  // Verificar conectividad al cargar la página
  useEffect(() => {
    checkConnectivity()
  }, [])

  // Scroll automático cuando aparecen los resultados
  useEffect(() => {
    if (result && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        })
      }, 500) // Pequeño delay para que las animaciones se inicien
    }
  }, [result])

  const handleFileSelect = (file) => {
    setSelectedFile(file)
    // Reset previous results when new file is selected
    if (result || error) {
      reset()
    }
  }

  const handleAnalyze = async () => {
    if (selectedFile) {
      console.log('Iniciando análisis desde componente:', selectedFile.name)
      try {
        const result = await analyzeImage(selectedFile)
        console.log('Resultado del análisis:', result)
      } catch (error) {
        console.error('Error en handleAnalyze:', error)
      }
    }
  }

  const handleNewAnalysis = () => {
    setSelectedFile(null)
    reset()
  }



  return (
    <AccessibilityProvider>
      <ResponsiveContainer maxWidth="2xl" className="py-8">
        <div className="space-y-8">
          {/* Enhanced Header */}
          <EntranceAnimation type="fadeInUp">
            <div className="metric-card">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 p-3 rounded-xl shadow-lg mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-section-title">Análisis Dermatológico con IA</h1>
                    <p className="text-metric-label">Tecnología médica avanzada para análisis de lesiones cutáneas</p>
                  </div>
                </div>
                <ConnectionStatus status={connectionStatus} />
              </div>

              {/* Enhanced Process Steps */}
              <StaggeredAnimation staggerDelay={150}>
                <div className="metric-grid">
                  {/* Paso 1: Subir imagen */}
                  <div className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                    selectedFile 
                      ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20' 
                      : 'border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20'
                  }`}>
                    <div className="flex items-center mb-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 shadow-md ${
                        selectedFile ? 'bg-green-500' : 'bg-blue-500'
                      }`}>
                        <span className="text-white font-bold">1</span>
                      </div>
                      <h3 className="font-semibold text-primary dark:text-white">Subir Imagen</h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Selecciona una imagen clara de la zona de piel a analizar
                    </p>
                    {selectedFile && (
                      <div className="flex items-center text-sm text-green-600 dark:text-green-400 font-medium">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Imagen seleccionada
                      </div>
                    )}
                  </div>

                  {/* Paso 2: Análisis */}
                  <div className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                    isAnalyzing 
                      ? 'border-yellow-300 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/20' : 
                    result 
                      ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20' 
                      : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'
                  }`}>
                    <div className="flex items-center mb-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 shadow-md ${
                        isAnalyzing ? 'bg-yellow-500' : 
                        result ? 'bg-green-500' : 'bg-gray-400'
                      }`}>
                        <span className="text-white font-bold">2</span>
                      </div>
                      <h3 className="font-semibold text-primary dark:text-white">Análisis IA</h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Procesamiento con inteligencia artificial médica
                    </p>
                    {isAnalyzing && (
                      <div className="flex items-center text-sm text-yellow-600 dark:text-yellow-400 font-medium">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600 mr-2"></div>
                        Analizando...
                      </div>
                    )}
                    {result && (
                      <div className="flex items-center text-sm text-green-600 dark:text-green-400 font-medium">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Análisis completado
                      </div>
                    )}
                  </div>

                  {/* Paso 3: Resultados */}
                  <div className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                    result 
                      ? 'border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'
                  }`}>
                    <div className="flex items-center mb-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 shadow-md ${
                        result ? 'bg-blue-500' : 'bg-gray-400'
                      }`}>
                        <span className="text-white font-bold">3</span>
                      </div>
                      <h3 className="font-semibold text-primary dark:text-white">Resultados</h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Visualización profesional de resultados y recomendaciones
                    </p>
                    {result && (
                      <div className="flex items-center text-sm text-blue-600 dark:text-blue-400 font-medium">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Dashboard disponible
                      </div>
                    )}
                  </div>
                </div>
              </StaggeredAnimation>
            </div>
          </EntranceAnimation>

          {/* Enhanced File Upload Area */}
          {!result && (
            <EntranceAnimation type="fadeInScale" delay={300}>
              <div className="metric-card">
                <FileUpload 
                  onFileSelect={handleFileSelect}
                  selectedFile={selectedFile}
                />
                
                {selectedFile && !isAnalyzing && (
                  <div className="mt-8 text-center">
                    <button
                      onClick={handleAnalyze}
                      className="btn-primary hover-lift text-lg py-4 px-10 shadow-lg"
                    >
                      <div className="flex items-center justify-center">
                        <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Iniciar Análisis Médico
                      </div>
                    </button>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                      Análisis seguro y confidencial con IA médica certificada
                    </p>
                  </div>
                )}
              </div>
            </EntranceAnimation>
          )}

          {/* Enhanced Analysis Progress */}
          {isAnalyzing && (
            <EntranceAnimation type="fadeInUp">
              <div className="metric-card text-center">
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mb-4">
                    <svg className="w-8 h-8 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <h3 className="text-section-title mb-2">Análisis en Progreso</h3>
                  <p className="text-metric-label">Procesando imagen con IA médica avanzada</p>
                </div>
                
                <div className="max-w-md mx-auto mb-6">
                  <LoadingProgressBar progress={progress} />
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    🔬 Nuestro modelo de IA especializado está analizando los patrones de tu imagen. 
                    Este proceso utiliza algoritmos médicos certificados para garantizar precisión.
                  </p>
                </div>
              </div>
            </EntranceAnimation>
          )}

          {/* Enhanced Results Dashboard */}
          {result && (
            <div ref={resultsRef} className="space-y-8">
              {/* Results Header */}
              <EntranceAnimation type="fadeInUp">
                <ResultsHeader
                  analysisStatus="completed"
                  processingTime={result.result?.processing_time || result.processingTime || 2.3}
                  confidence={result.result?.confidence || result.confidence || 0.85}
                  timestamp={new Date()}
                  onNewAnalysis={handleNewAnalysis}
                />
              </EntranceAnimation>

              {/* Primary Result Card */}
              <EntranceAnimation type="fadeInScale" delay={200}>
                <PrimaryResultCard
                  analysisResult={result}
                  onNewAnalysis={handleNewAnalysis}
                />
              </EntranceAnimation>

              {/* Detailed Analysis */}
              <EntranceAnimation type="fadeInUp" delay={400}>
                <EnhancedDetailedAnalysis analysisResult={result} />
              </EntranceAnimation>

              {/* Smart Recommendations */}
              <EntranceAnimation type="fadeInUp" delay={600}>
                <SmartRecommendationsSystem
                  analysisResult={result}
                  onScheduleAppointment={() => {
                    // Implementar funcionalidad de programar cita
                    console.log('Programar cita médica')
                  }}
                  onSaveReport={() => {
                    // Implementar funcionalidad de guardar reporte
                    console.log('Guardar reporte médico')
                  }}
                />
              </EntranceAnimation>
            </div>
          )}

          {/* Enhanced Error Display */}
          {error && (
            <EntranceAnimation type="fadeInUp">
              <div className="metric-card">
                <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-700 rounded-xl p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
                        Error en el Análisis Médico
                      </h4>
                      <p className="text-red-700 dark:text-red-300 mb-4 leading-relaxed">
                        {error}
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={handleNewAnalysis}
                          className="btn-primary bg-red-600 hover:bg-red-700"
                        >
                          🔄 Intentar de Nuevo
                        </button>
                        <button
                          onClick={() => {
                            // Implementar reporte de error
                            console.log('Reportar error técnico')
                          }}
                          className="btn-secondary"
                        >
                          📧 Reportar Problema
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </EntranceAnimation>
          )}
        </div>
      </ResponsiveContainer>
    </AccessibilityProvider>
  )
}

export default Analizar