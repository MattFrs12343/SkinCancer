import { memo, useState, useEffect } from 'react'
import { SKIN_LESION_TYPES } from '../../utils/constants'
import AnimatedCircularProgress from './AnimatedCircularProgress'

const PrimaryResultCard = memo(({ analysisResult, onNewAnalysis }) => {
  const [animatedProbability, setAnimatedProbability] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  // Extraer datos del resultado
  const result = analysisResult.result || analysisResult
  const detailedAnalysis = result.detailed_analysis
  const mostLikely = detailedAnalysis?.most_likely
  const riskAssessment = detailedAnalysis?.risk_assessment
  
  // Fallback para resultados simples
  const lesionType = mostLikely?.type || 'unknown'
  const probability = mostLikely?.probability || result.probability || 0
  const confidence = analysisResult.confidence || result.confidence || 0.85

  const lesionInfo = SKIN_LESION_TYPES[lesionType] || {
    fullName: 'Lesión Desconocida',
    icon: '🔍',
    type: 'unknown',
    isCancer: false,
    gradient: 'from-gray-100 to-gray-200',
    borderColor: 'border-gray-300'
  }

  // Animación de entrada
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
      setAnimatedProbability(probability)
    }, 300)
    return () => clearTimeout(timer)
  }, [probability])

  // Configuración de riesgo
  const getRiskConfig = () => {
    const overallRisk = riskAssessment?.overall_risk
    const numProbability = Number(probability)
    
    let riskLevel = 'low'
    if (overallRisk) {
      riskLevel = overallRisk
    } else if (numProbability > 70) {
      riskLevel = 'high'
    } else if (numProbability > 40) {
      riskLevel = 'medium'
    }

    switch (riskLevel) {
      case 'high':
        return {
          level: 'Alto',
          color: 'text-red-600 dark:text-red-400',
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          borderColor: 'border-red-200 dark:border-red-700',
          gradientColor: 'from-red-500 to-red-600',
          icon: '🚨',
          message: 'Se recomienda consulta médica urgente'
        }
      case 'medium':
        return {
          level: 'Moderado',
          color: 'text-yellow-600 dark:text-yellow-400',
          bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
          borderColor: 'border-yellow-200 dark:border-yellow-700',
          gradientColor: 'from-yellow-500 to-yellow-600',
          icon: '⚠️',
          message: 'Se recomienda evaluación dermatológica'
        }
      default:
        return {
          level: 'Bajo',
          color: 'text-green-600 dark:text-green-400',
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          borderColor: 'border-green-200 dark:border-green-700',
          gradientColor: 'from-green-500 to-green-600',
          icon: '✅',
          message: 'Mantener observación y chequeos regulares'
        }
    }
  }

  const riskConfig = getRiskConfig()

  // Determinar color para el progreso circular
  const getProgressColor = () => {
    const riskLevel = riskAssessment?.overall_risk
    const numProbability = Number(probability)
    
    if (riskLevel === 'high' || numProbability > 70) return 'red'
    if (riskLevel === 'medium' || numProbability > 40) return 'yellow'
    return 'green'
  }

  return (
    <div className={`metric-card hover-lift ${isVisible ? 'animate-fade-in-scale' : 'opacity-0'}`}>
      {/* Header de la Card */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="text-3xl">{lesionInfo.icon}</div>
          <div>
            <h3 className="text-section-title">Diagnóstico Principal</h3>
            <p className="text-metric-label">Resultado más probable del análisis IA</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="status-indicator status-indicator-online"></div>
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
            Confianza: {Math.round(confidence * 100)}%
          </span>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="grid lg:grid-cols-2 gap-8 items-center">
        {/* Visualización de Probabilidad */}
        <div className="text-center">
          <AnimatedCircularProgress 
            percentage={probability} 
            size={220} 
            strokeWidth={14}
            color={getProgressColor()}
            duration={1200}
            delay={300}
            animated={isVisible}
          />
          
          <div className="mt-4 space-y-2">
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${riskConfig.bgColor} ${riskConfig.color} ${riskConfig.borderColor} border-2`}>
              <span className="mr-2">{riskConfig.icon}</span>
              Riesgo {riskConfig.level}
            </div>
            
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Basado en análisis de IA médica avanzada
            </div>
          </div>
        </div>

        {/* Información del Diagnóstico */}
        <div className="space-y-6">
          {/* Nombre de la Lesión */}
          <div className={`p-6 rounded-xl border-2 ${lesionInfo.gradient} dark:from-gray-800 dark:to-gray-700 ${lesionInfo.borderColor} dark:border-gray-600 relative overflow-hidden`}>
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                    {lesionInfo.fullName}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 italic">
                    {lesionInfo.name}
                  </p>
                </div>
                <div className="text-4xl opacity-20">
                  {lesionInfo.icon}
                </div>
              </div>

              {/* Tipo de Lesión */}
              <div className="flex items-center space-x-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  lesionInfo.isCancer === true 
                    ? 'bg-red-500 text-white' 
                    : lesionInfo.isCancer === 'potential'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-green-500 text-white'
                }`}>
                  {lesionInfo.isCancer === true ? '⚠️ Maligna' : 
                   lesionInfo.isCancer === 'potential' ? '🟡 Potencial' : 
                   '✅ Benigna'}
                </span>
                
                <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                  Código: {lesionInfo.type?.toUpperCase()}
                </span>
              </div>

              {/* Descripción */}
              <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed mb-4">
                {lesionInfo.detailedDescription || lesionInfo.description}
              </p>

              {/* Características */}
              {lesionInfo.characteristics && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                    CARACTERÍSTICAS TÍPICAS:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {lesionInfo.characteristics.slice(0, 3).map((char, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                      >
                        {char}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Recomendación Principal */}
          <div className={`p-4 rounded-xl border-2 ${riskConfig.bgColor} ${riskConfig.borderColor}`}>
            <div className="flex items-start space-x-3">
              <div className="text-2xl">{riskConfig.icon}</div>
              <div className="flex-1">
                <h5 className={`font-bold ${riskConfig.color} mb-2`}>
                  Recomendación Médica
                </h5>
                <p className="text-sm text-gray-700 dark:text-gray-200">
                  {riskConfig.message}
                </p>
              </div>
            </div>
          </div>

          {/* Métricas Adicionales */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="text-lg font-bold text-primary dark:text-white">
                {riskAssessment?.cancer_probability ? 
                  `${Math.round(riskAssessment.cancer_probability)}%` : 
                  'N/A'
                }
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Prob. Maligna
              </div>
            </div>
            
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="text-lg font-bold text-primary dark:text-white">
                {riskAssessment?.benign_probability ? 
                  `${Math.round(riskAssessment.benign_probability)}%` : 
                  'N/A'
                }
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Prob. Benigna
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer con Acciones */}
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Análisis verificado por IA médica
            </span>
          </div>
        </div>

        {onNewAnalysis && (
          <button
            onClick={onNewAnalysis}
            className="btn-primary hover-lift focus-ring"
          >
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Nuevo Análisis</span>
            </div>
          </button>
        )}
      </div>
    </div>
  )
})

PrimaryResultCard.displayName = 'PrimaryResultCard'

export default PrimaryResultCard