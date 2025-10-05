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
    console.log('getRecommendation called with probability:', probability, typeof probability)
    
    const numProbability = Number(probability)
    
    if (numProbability <= 30) {
      return {
        title: 'Riesgo Bajo',
        message: 'Los resultados sugieren un riesgo bajo. Sin embargo, es recomendable realizar chequeos regulares con un dermatólogo.',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200'
      }
    } else if (numProbability <= 60) {
      return {
        title: 'Riesgo Moderado',
        message: 'Los resultados indican un riesgo moderado. Se recomienda consultar con un dermatólogo para una evaluación más detallada.',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200'
      }
    } else {
      return {
        title: 'Riesgo Alto',
        message: 'Los resultados sugieren un riesgo alto. Es importante consultar con un dermatólogo lo antes posible para una evaluación profesional.',
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary">Análisis de Imágenes</h1>
              <p className="text-sm text-gray-600">Sube una imagen para análisis con IA</p>
            </div>
          </div>
          <ConnectionStatus status={connectionStatus} />
        </div>

        {/* Proceso paso a paso */}
        <div className="grid md:grid-cols-3 gap-4">
          {/* Paso 1: Subir imagen */}
          <div className={`p-4 rounded-lg border-2 transition-all duration-300 ${
            selectedFile ? 'border-green-300 bg-green-50' : 'border-blue-300 bg-blue-50'
          }`}>
            <div className="flex items-center mb-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                selectedFile ? 'bg-green-500' : 'bg-blue-500'
              }`}>
                <span className="text-white font-bold text-sm">1</span>
              </div>
              <h3 className="font-semibold text-primary">Subir Imagen</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Selecciona una imagen clara de la zona de piel a analizar
            </p>
            {selectedFile && (
              <div className="flex items-center text-xs text-green-600">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Imagen seleccionada
              </div>
            )}
          </div>

          {/* Paso 2: Análisis */}
          <div className={`p-4 rounded-lg border-2 transition-all duration-300 ${
            isAnalyzing ? 'border-yellow-300 bg-yellow-50' : 
            result ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-gray-50'
          }`}>
            <div className="flex items-center mb-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                isAnalyzing ? 'bg-yellow-500' : 
                result ? 'bg-green-500' : 'bg-gray-400'
              }`}>
                <span className="text-white font-bold text-sm">2</span>
              </div>
              <h3 className="font-semibold text-primary">Análisis IA</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Procesamiento con inteligencia artificial
            </p>
            {isAnalyzing && (
              <div className="flex items-center text-xs text-yellow-600">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-yellow-600 mr-1"></div>
                Analizando...
              </div>
            )}
            {result && (
              <div className="flex items-center text-xs text-green-600">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Análisis completado
              </div>
            )}
          </div>

          {/* Paso 3: Resultados */}
          <div className={`p-4 rounded-lg border-2 transition-all duration-300 ${
            result ? 'border-blue-300 bg-blue-50' : 'border-gray-300 bg-gray-50'
          }`}>
            <div className="flex items-center mb-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                result ? 'bg-blue-500' : 'bg-gray-400'
              }`}>
                <span className="text-white font-bold text-sm">3</span>
              </div>
              <h3 className="font-semibold text-primary">Resultados</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Visualización de resultados y recomendaciones
            </p>
            {result && (
              <div className="flex items-center text-xs text-blue-600">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Resultados disponibles
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Área de subida de archivos */}
      {!result && (
        <div className="card">
          <FileUpload 
            onFileSelect={handleFileSelect}
            selectedFile={selectedFile}
          />
          
          {selectedFile && !isAnalyzing && (
            <div className="mt-6 text-center">
              <button
                onClick={handleAnalyze}
                className="bg-gradient-to-r from-accent to-secondary hover:from-accent/90 hover:to-secondary/90 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                <div className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Analizar Imagen
                </div>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Progreso del análisis */}
      {isAnalyzing && (
        <div className="card">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-primary mb-4">Analizando imagen...</h3>
            <div className="flex justify-center mb-6">
              <LoadingProgressBar progress={progress} />
            </div>
            <p className="text-gray-600">
              Nuestro modelo de IA está procesando tu imagen. Esto puede tomar unos segundos.
            </p>
          </div>
        </div>
      )}

      {/* Resultados */}
      {result && (
        <div className="space-y-6">
          {/* Resultado principal */}
          <div className="card">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-primary mb-4">Resultado del Análisis</h3>
                <CircularProgressBar 
                  percentage={result.result?.probability || result.probability} 
                  size={200}
                  strokeWidth={8}
                  animated={true}
                  color="dynamic"
                />
                <p className="text-sm text-gray-600 mt-4">
                  Tiempo de procesamiento: {result.result?.processing_time || result.processingTime || 'N/A'}s
                </p>
              </div>
              
              <div>
                {(() => {
                  const probability = result.result?.probability || result.probability
                  console.log('Rendering recommendation for probability:', probability)
                  const recommendation = getRecommendation(probability)
                  return (
                    <div className={`p-6 rounded-lg border ${recommendation.bgColor} ${recommendation.borderColor}`}>
                      <h4 className={`text-lg font-semibold mb-3 ${recommendation.color}`}>
                        {recommendation.title}
                      </h4>
                      <p className="text-white leading-relaxed">
                        {recommendation.message}
                      </p>
                      <div className="mt-3 text-sm text-gray-500">
                        Probabilidad: {probability}%
                      </div>
                    </div>
                  )
                })()}
                
                <div className="mt-6">
                  <button
                    onClick={handleNewAnalysis}
                    className="w-full bg-gradient-to-r from-secondary to-accent hover:from-secondary/90 hover:to-accent/90 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
                  >
                    Realizar Nuevo Análisis
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Información adicional */}
          <div className="card">
            <h4 className="text-lg font-semibold text-primary mb-4">Información Importante</h4>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <h5 className="font-semibold text-yellow-800 mb-2">Disclaimer Médico</h5>
                  <p className="text-sm text-yellow-700">
                    Este análisis es únicamente una herramienta de apoyo y NO reemplaza el diagnóstico médico profesional. 
                    Siempre consulta con un dermatólogo o especialista para evaluación y diagnóstico definitivo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="card">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <h4 className="text-lg font-semibold text-red-800 mb-2">Error en el Análisis</h4>
                <p className="text-red-700">{error}</p>
                <button
                  onClick={handleNewAnalysis}
                  className="mt-4 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Intentar de Nuevo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Analizar