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
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">
          Análisis de Imágenes de Piel
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Sube una imagen clara de la zona de piel que quieres analizar y obtén una evaluación con inteligencia artificial
        </p>
      </div>

      {/* Estado de conexión */}
      <div className="max-w-4xl mx-auto">
        <ConnectionStatus />
      </div>

      {/* Contenido principal */}
      <div className="max-w-4xl mx-auto">
        {!result ? (
          // Vista de subida y análisis
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Panel de subida */}
            <div className="card">
              <h2 className="text-2xl font-semibold text-primary mb-6">
                1. Selecciona una imagen
              </h2>
              <FileUpload 
                onFileSelect={handleFileSelect}
                disabled={isAnalyzing}
              />
              
              {selectedFile && !isAnalyzing && (
                <div className="mt-6">
                  <button
                    onClick={handleAnalyze}
                    className="w-full btn-primary text-lg py-3"
                  >
                    Analizar Imagen
                  </button>
                </div>
              )}
            </div>

            {/* Panel de procesamiento */}
            <div className="card">
              <h2 className="text-2xl font-semibold text-primary mb-6">
                2. Procesamiento con IA
              </h2>
              
              {!selectedFile && !isAnalyzing && (
                <div className="text-center py-12 text-gray-500">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p>Selecciona una imagen para comenzar el análisis</p>
                </div>
              )}

              {selectedFile && !isAnalyzing && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <p className="text-primary font-medium">Listo para analizar</p>
                  <p className="text-sm text-gray-600 mt-2">
                    Haz clic en "Analizar Imagen" para comenzar
                  </p>
                </div>
              )}

              {isAnalyzing && (
                <div className="text-center py-8">
                  <LoadingProgressBar size="lg" className="mb-6" />
                  <h3 className="text-lg font-medium text-primary mb-4">
                    Analizando imagen...
                  </h3>
                  <LinearProgressBar 
                    percentage={progress} 
                    color="secondary" 
                    className="mb-4"
                  />
                  <p className="text-sm text-gray-600">
                    Nuestro modelo de IA está procesando tu imagen. Esto puede tomar unos segundos.
                  </p>
                </div>
              )}

              {error && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-red-600 font-medium mb-2">Error en el análisis</p>
                  <p className="text-sm text-gray-600">{error}</p>
                  <button
                    onClick={() => reset()}
                    className="mt-4 text-sm text-secondary hover:text-primary transition-colors duration-200"
                  >
                    Intentar de nuevo
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Vista de resultados
          <div className="space-y-8">
            {/* Resultado principal */}
            <div className="card text-center">
              <h2 className="text-3xl font-semibold text-primary mb-8">
                Resultado del Análisis
              </h2>
              
              <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
                {/* Progress bar circular */}
                <div>
                  <CircularProgressBar 
                    percentage={result.result.probability}
                    size={200}
                    color="dynamic"
                    animated={true}
                  />
                </div>
                
                {/* Información del resultado */}
                <div className="text-left space-y-4 max-w-md">
                  <div>
                    <h3 className="text-xl font-semibold text-primary mb-2">
                      Información del análisis:
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex justify-between">
                        <span>Probabilidad:</span>
                        <span className="font-medium">{result.result.probability}%</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Confianza:</span>
                        <span className="font-medium">{(result.result.confidence * 100).toFixed(1)}%</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Tiempo de procesamiento:</span>
                        <span className="font-medium">{result.result.processing_time.toFixed(1)}s</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Fecha:</span>
                        <span className="font-medium">
                          {new Date(result.result.timestamp).toLocaleDateString('es-ES')}
                        </span>
                      </li>
                    </ul>
                  </div>
                  
                  {result.isSimulated && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm text-blue-700">
                        ℹ️ Resultado simulado (modo demo)
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Recomendación */}
            <div className="card">
              {(() => {
                const recommendation = getRecommendation(result.result.probability)
                return (
                  <div className={`${recommendation.bgColor} ${recommendation.borderColor} border rounded-lg p-6`}>
                    <h3 className={`text-xl font-semibold ${recommendation.color} mb-4`}>
                      📋 Recomendación: {recommendation.title}
                    </h3>
                    <p className="text-gray-700 mb-4">
                      {recommendation.message}
                    </p>
                    <div className="bg-white/50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-800 mb-2">Próximos pasos recomendados:</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Consulta con un dermatólogo para evaluación profesional</li>
                        <li>• Lleva esta imagen y resultado a tu cita médica</li>
                        <li>• Mantén un registro fotográfico de la lesión</li>
                        <li>• Realiza autoexámenes regulares de la piel</li>
                      </ul>
                    </div>
                  </div>
                )
              })()}
            </div>



            {/* Acciones */}
            <div className="text-center space-y-4">
              <button
                onClick={handleNewAnalysis}
                className="btn-primary text-lg px-8 py-3"
              >
                Realizar Nuevo Análisis
              </button>
              <div>
                <a
                  href="https://wa.me/8888888"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors duration-200"
                >
                  <span>📱</span>
                  <span>Contactar soporte por WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Analizar