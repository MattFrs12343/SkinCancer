import { useState, useEffect } from 'react'
import FileUpload from '../components/ui/FileUpload'
import CircularProgressBar, { LoadingProgressBar, LinearProgressBar } from '../components/ui/ProgressBar'
import ConnectionStatus from '../components/common/ConnectionStatus'
import { useImageAnalysis } from '../hooks/useImageAnalysis'

const Analizar = () => {
  const [selectedFile, setSelectedFile] = useState(null)
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

  const handleFileSelect = (file) => {
    setSelectedFile(file)
    // Reset previous results when new file is selected
    if (result || error) {
      reset()
    }
  }

  const handleAnalyze = async () => {
    if (selectedFile) {
      await analyzeImage(selectedFile)
    }
  }

  const handleNewAnalysis = () => {
    setSelectedFile(null)
    reset()
  }

  const getRecommendation = (probability) => {
    if (probability <= 30) {
      return {
        title: 'Riesgo Bajo',
        message: 'Los resultados sugieren un riesgo bajo. Sin embargo, es recomendable realizar chequeos regulares con un dermatólogo.',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200'
      }
    } else if (probability <= 60) {
      return {
        title: 'Riesgo Moderado', 
        message: 'Los resultados sugieren un riesgo moderado. Se recomienda consultar con un dermatólogo para una evaluación profesional.',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200'
      }
    } else {
      return {
        title: 'Riesgo Alto',
        message: 'Los resultados sugieren un riesgo alto. Es importante consultar con un dermatólogo lo antes posible para una evaluación detallada.',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200'
      }
    }
  }

  return (
    <div className="py-8 space-y-8">
      {/* Header */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="bg-secondary/10 p-3 rounded-full mr-4">
              <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary">Análisis de Imágenes</h1>
              <p className="text-sm text-gray-600">Evaluación con inteligencia artificial</p>
            </div>
          </div>
          <div className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-xs font-medium flex items-center">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
            IA Avanzada
          </div>
        </div>
        <ConnectionStatus />
      </div>

      {/* Contenido principal */}
      <div className="max-w-4xl mx-auto">
        {!result ? (
          // Vista de subida y análisis
          <div className="grid lg:grid-cols-2 gap-4">
            {/* Panel de subida */}
            <div className="card">
              <div className="flex items-center mb-4">
                <div className="bg-blue-500/10 p-2 rounded-full mr-3">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-primary">1. Selecciona Imagen</h2>
                  <p className="text-xs text-gray-600">Sube una foto clara de la lesión</p>
                </div>
              </div>
              <FileUpload 
                onFileSelect={handleFileSelect}
                disabled={isAnalyzing}
              />
              
              {selectedFile && !isAnalyzing && (
                <div className="mt-4">
                  <button
                    onClick={handleAnalyze}
                    className="w-full btn-primary py-3"
                  >
                    Analizar Imagen
                  </button>
                </div>
              )}
            </div>

            {/* Panel de procesamiento */}
            <div className="card">
              <div className="flex items-center mb-4">
                <div className="bg-secondary/10 p-2 rounded-full mr-3">
                  <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-primary">2. Procesamiento IA</h2>
                  <p className="text-xs text-gray-600">Análisis con inteligencia artificial</p>
                </div>
              </div>
              
              {!selectedFile && !isAnalyzing && (
                <div className="text-center py-8 text-gray-500">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-sm">Selecciona una imagen para comenzar</p>
                </div>
              )}

              {selectedFile && !isAnalyzing && (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <p className="text-primary font-medium text-sm">Listo para analizar</p>
                  <p className="text-xs text-gray-600 mt-1">
                    Haz clic en "Analizar Imagen"
                  </p>
                </div>
              )}

              {isAnalyzing && (
                <div className="text-center py-6">
                  <LoadingProgressBar size="md" className="mb-4" />
                  <h3 className="text-sm font-medium text-primary mb-2">
                    Analizando imagen...
                  </h3>
                  <LinearProgressBar 
                    percentage={progress} 
                    color="secondary" 
                    className="mb-3"
                  />
                  <p className="text-xs text-gray-600">
                    Procesando con IA. Esto toma unos segundos.
                  </p>
                </div>
              )}

              {error && (
                <div className="text-center py-6">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-red-600 font-medium mb-1 text-sm">Error en el análisis</p>
                  <p className="text-xs text-gray-600">{error}</p>
                  <button
                    onClick={() => reset()}
                    className="mt-3 text-xs text-secondary hover:text-primary transition-colors duration-200"
                  >
                    Intentar de nuevo
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Vista de resultados
          <div className="space-y-4">
            {/* Resultado principal */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="bg-green-500/10 p-3 rounded-full mr-4">
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-primary">Resultado del Análisis</h2>
                    <p className="text-sm text-gray-600">Evaluación completada con IA</p>
                  </div>
                </div>
                {result.isSimulated && (
                  <div className="bg-blue-500/10 text-blue-600 px-3 py-1 rounded-full text-xs font-medium flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Demo
                  </div>
                )}
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 items-center">
                {/* Progress bar circular */}
                <div className="text-center">
                  <CircularProgressBar 
                    percentage={result.result.probability}
                    size={180}
                    color="dynamic"
                    animated={true}
                  />
                </div>
                
                {/* Información del resultado */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-primary mb-3">
                    Detalles del Análisis
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Probabilidad</p>
                      <p className="font-bold text-primary">{result.result.probability}%</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Confianza</p>
                      <p className="font-bold text-primary">{(result.result.confidence * 100).toFixed(1)}%</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Tiempo</p>
                      <p className="font-bold text-primary">{result.result.processing_time.toFixed(1)}s</p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-3 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Fecha</p>
                      <p className="font-bold text-primary text-xs">
                        {new Date(result.result.timestamp).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recomendación */}
            <div className="card">
              {(() => {
                const recommendation = getRecommendation(result.result.probability)
                return (
                  <div>
                    <div className="flex items-center mb-4">
                      <div className={`${recommendation.color === 'text-green-600' ? 'bg-green-500/10' : recommendation.color === 'text-yellow-600' ? 'bg-yellow-500/10' : 'bg-red-500/10'} p-2 rounded-full mr-3`}>
                        <svg className={`w-5 h-5 ${recommendation.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className={`text-lg font-bold ${recommendation.color}`}>
                          Recomendación: {recommendation.title}
                        </h3>
                        <p className="text-xs text-gray-600">Basado en el análisis de IA</p>
                      </div>
                    </div>
                    
                    <div className={`${recommendation.bgColor} ${recommendation.borderColor} border rounded-lg p-4 mb-4`}>
                      <p className="text-sm text-primary mb-3">
                        {recommendation.message}
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4">
                      <h4 className="font-bold text-primary mb-3 text-sm">Próximos pasos recomendados:</h4>
                      <div className="grid md:grid-cols-2 gap-3">
                        {[
                          { icon: '👨‍⚕️', text: 'Consulta con dermatólogo' },
                          { icon: '📋', text: 'Lleva este resultado a tu cita' },
                          { icon: '📸', text: 'Mantén registro fotográfico' },
                          { icon: '🔍', text: 'Realiza autoexámenes regulares' }
                        ].map((step, index) => (
                          <div key={index} className="flex items-center bg-white p-2 rounded-lg">
                            <span className="text-lg mr-2">{step.icon}</span>
                            <span className="text-xs text-primary font-medium">{step.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })()}
            </div>

            {/* Acciones */}
            <div className="card text-center">
              <div className="space-y-4">
                <button
                  onClick={handleNewAnalysis}
                  className="btn-primary px-6 py-3 w-full md:w-auto"
                >
                  Realizar Nuevo Análisis
                </button>
                <div>
                  <a
                    href="https://wa.me/67708839"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors duration-200 text-sm"
                  >
                    <span>📱</span>
                    <span>Contactar soporte por WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Analizar