import { memo, useState, useEffect } from 'react'
import { SKIN_LESION_TYPES } from '../../utils/constants'

const DetailedAnalysisResults = memo(({ analysisResult }) => {
  const [animatedPercentages, setAnimatedPercentages] = useState({})
  const [selectedLesion, setSelectedLesion] = useState(null)
  const [showComparison, setShowComparison] = useState(false)
  const { detailed_analysis } = analysisResult.result || analysisResult

  if (!detailed_analysis) {
    return null
  }

  const { lesion_probabilities, most_likely, risk_assessment } = detailed_analysis

  // Animación de porcentajes
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPercentages(lesion_probabilities)
    }, 300)
    return () => clearTimeout(timer)
  }, [lesion_probabilities])

  // Ordenar lesiones por probabilidad
  const sortedLesions = Object.entries(lesion_probabilities)
    .sort(([, a], [, b]) => b - a)
    .map(([code, probability]) => ({
      ...SKIN_LESION_TYPES[code],
      probability
    }))

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low': return 'text-green-600 bg-green-50 border-green-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getCancerIcon = (isCancer) => {
    if (isCancer === true) return '⚠️'
    if (isCancer === 'potential') return '🟡'
    return '✅'
  }

  return (
    <div className="space-y-6">
      {/* Controles de vista mejorados */}
      <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="flex space-x-2">
          <button
            onClick={() => setShowComparison(!showComparison)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
              showComparison 
                ? 'bg-blue-500 dark:bg-blue-600 text-white shadow-lg border-blue-600 dark:border-blue-500' 
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-600'
            }`}
          >
            {showComparison ? '📊 Vista Simple' : '🔬 Vista Comparativa'}
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
            Análisis basado en IA médica avanzada
          </span>
        </div>
      </div>

      {/* Resumen del riesgo mejorado */}
      <div className={`p-6 rounded-xl border-2 ${getRiskColor(risk_assessment.overall_risk)} relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="40" fill="currentColor" />
          </svg>
        </div>
        <div className="relative z-10">
          <h4 className="font-bold text-lg mb-4 flex items-center">
            <span className="mr-3 text-2xl">📊</span>
            Evaluación de Riesgo General
            <span className={`ml-3 px-3 py-1 rounded-full text-xs font-bold ${
              risk_assessment.overall_risk === 'high' ? 'bg-red-200 text-red-800' :
              risk_assessment.overall_risk === 'medium' ? 'bg-yellow-200 text-yellow-800' :
              'bg-green-200 text-green-800'
            }`}>
              {risk_assessment.overall_risk.toUpperCase()}
            </span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">
                {risk_assessment.overall_risk === 'high' ? '⚠️' : 
                 risk_assessment.overall_risk === 'medium' ? '🟡' : '✅'}
              </div>
              <p className="font-semibold text-sm">Riesgo General</p>
              <p className="text-lg font-bold capitalize">{risk_assessment.overall_risk}</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">🔴</div>
              <p className="font-semibold text-sm">Prob. Cáncer</p>
              <p className="text-lg font-bold">{Math.round(risk_assessment.cancer_probability)}%</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">🟢</div>
              <p className="font-semibold text-sm">Prob. Benigna</p>
              <p className="text-lg font-bold">{Math.round(risk_assessment.benign_probability)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Resultado más probable mejorado con modo oscuro */}
      <div className="relative">
        <div className={`bg-gradient-to-r ${SKIN_LESION_TYPES[most_likely.type]?.gradient} dark:from-gray-800 dark:to-gray-700 p-6 rounded-xl border-2 ${SKIN_LESION_TYPES[most_likely.type]?.borderColor} dark:border-gray-600 shadow-lg dark:shadow-gray-900/50`}>
          <h4 className="font-bold text-lg mb-4 flex items-center text-gray-800 dark:text-gray-100">
            <span className="mr-3 text-2xl">🎯</span>
            Diagnóstico Más Probable
            <div className="ml-auto flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                IA Confianza: {Math.round((analysisResult.confidence || 0.85) * 100)}%
              </span>
            </div>
          </h4>
          
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-6 border border-white/50 dark:border-gray-600/50 shadow-inner">
            <div className="flex items-start space-x-6">
              <div className="text-6xl animate-pulse">{SKIN_LESION_TYPES[most_likely.type]?.icon}</div>
              <div className="flex-1">
                <h5 className="font-bold text-2xl text-primary dark:text-white mb-2">
                  {SKIN_LESION_TYPES[most_likely.type]?.fullName}
                </h5>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 italic">
                  {SKIN_LESION_TYPES[most_likely.type]?.name}
                </p>
                
                <div className="flex items-center space-x-4 mb-4">
                  <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-md ${
                    SKIN_LESION_TYPES[most_likely.type]?.isCancer 
                      ? 'bg-red-500 text-white dark:bg-red-600'
                      : SKIN_LESION_TYPES[most_likely.type]?.isCancer === 'potential'
                      ? 'bg-yellow-500 text-white dark:bg-yellow-600'
                      : 'bg-green-500 text-white dark:bg-green-600'
                  }`}>
                    {getCancerIcon(SKIN_LESION_TYPES[most_likely.type]?.isCancer)} {SKIN_LESION_TYPES[most_likely.type]?.type}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-3xl font-bold text-primary dark:text-white">
                      {most_likely.probability}%
                    </span>
                    <div className="w-20 bg-gray-200 dark:bg-gray-600 rounded-full h-3 shadow-inner">
                      <div 
                        className={`h-3 rounded-full transition-all duration-1000 shadow-sm ${
                          SKIN_LESION_TYPES[most_likely.type]?.isCancer 
                            ? 'bg-gradient-to-r from-red-400 to-red-600'
                            : SKIN_LESION_TYPES[most_likely.type]?.isCancer === 'potential'
                            ? 'bg-gradient-to-r from-yellow-400 to-yellow-600'
                            : 'bg-gradient-to-r from-green-400 to-green-600'
                        }`}
                        style={{ width: `${animatedPercentages[most_likely.type] || 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-700 dark:text-gray-200 mb-3 leading-relaxed">
                  {SKIN_LESION_TYPES[most_likely.type]?.detailedDescription}
                </p>
                
                {/* Características */}
                <div className="mb-3">
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">CARACTERÍSTICAS TÍPICAS:</p>
                  <div className="flex flex-wrap gap-2">
                    {SKIN_LESION_TYPES[most_likely.type]?.characteristics?.map((char, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 text-xs rounded-full border border-blue-200 dark:border-blue-700">
                        {char}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Urgencia */}
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">URGENCIA:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    SKIN_LESION_TYPES[most_likely.type]?.urgency === 'urgent' 
                      ? 'bg-red-200 dark:bg-red-900/50 text-red-800 dark:text-red-200 border-red-300 dark:border-red-700' :
                    SKIN_LESION_TYPES[most_likely.type]?.urgency === 'priority' 
                      ? 'bg-yellow-200 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700' :
                    'bg-green-200 dark:bg-green-900/50 text-green-800 dark:text-green-200 border-green-300 dark:border-green-700'
                  }`}>
                    {SKIN_LESION_TYPES[most_likely.type]?.urgency?.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Análisis detallado por tipo mejorado */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/80 dark:to-gray-900/80 rounded-xl p-6 border border-gray-200 dark:border-gray-600 shadow-lg dark:shadow-gray-900/50">
        <div className="flex items-center justify-between mb-6">
          <h4 className="font-bold text-xl text-primary dark:text-white flex items-center">
            <span className="mr-3 text-2xl">🔬</span>
            Análisis Detallado por Tipo de Lesión
          </h4>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
              {sortedLesions.length} tipos analizados
            </span>
          </div>
        </div>
        
        <div className={`grid ${showComparison ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'} gap-4`}>
          {sortedLesions.map((lesion, index) => (
            <div 
              key={lesion.code} 
              className={`group relative bg-white dark:bg-gray-800 rounded-xl p-4 border-2 transition-all duration-300 cursor-pointer hover:shadow-lg ${
                index === 0 ? 'ring-2 ring-blue-300 dark:ring-blue-600 shadow-lg' : 'hover:border-blue-300 dark:hover:border-blue-600'
              } ${selectedLesion === lesion.code ? 'ring-2 ring-purple-300 dark:ring-purple-600' : ''}`}
              onClick={() => setSelectedLesion(selectedLesion === lesion.code ? null : lesion.code)}
            >
              {/* Badge de ranking */}
              {index < 3 && (
                <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                  index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-amber-600'
                }`}>
                  {index + 1}
                </div>
              )}
              
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="relative">
                    <span className="text-3xl group-hover:scale-110 transition-transform duration-200">
                      {lesion.icon}
                    </span>
                    {index === 0 && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h6 className="font-bold text-primary text-sm">
                        {lesion.fullName}
                      </h6>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        lesion.isCancer 
                          ? 'bg-red-500 text-white'
                          : lesion.isCancer === 'potential'
                          ? 'bg-yellow-500 text-white'
                          : 'bg-green-500 text-white'
                      }`}>
                        {getCancerIcon(lesion.isCancer)} {lesion.type}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {lesion.description}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {animatedPercentages[lesion.code] || 0}%
                  </div>
                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-3 relative overflow-hidden">
                    <div 
                      className={`h-3 rounded-full transition-all duration-1000 ease-out ${
                        lesion.isCancer 
                          ? 'bg-gradient-to-r from-red-400 to-red-600'
                          : lesion.isCancer === 'potential'
                          ? 'bg-gradient-to-r from-yellow-400 to-yellow-600'
                          : 'bg-gradient-to-r from-green-400 to-green-600'
                      }`}
                      style={{ width: `${animatedPercentages[lesion.code] || 0}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Información expandida */}
              {selectedLesion === lesion.code && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 animate-fadeIn">
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">DESCRIPCIÓN DETALLADA:</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{lesion.detailedDescription}</p>
                    </div>
                    
                    <div>
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">CARACTERÍSTICAS:</p>
                      <div className="flex flex-wrap gap-1">
                        {lesion.characteristics?.map((char, idx) => (
                          <span key={idx} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs rounded">
                            {char}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">RECOMENDACIONES:</p>
                      <ul className="text-xs text-gray-700 dark:text-gray-300 space-y-1">
                        {lesion.recommendations?.map((rec, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="mr-2">•</span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recomendaciones específicas mejoradas */}
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-2 border-amber-200 dark:border-amber-800 rounded-xl p-6">
        <h4 className="font-bold text-xl text-amber-800 dark:text-amber-200 mb-4 flex items-center">
          <span className="mr-3 text-2xl">💡</span>
          Recomendaciones Personalizadas
          <span className="ml-auto text-xs bg-amber-200 dark:bg-amber-800 px-2 py-1 rounded-full">
            Basado en IA médica
          </span>
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recomendaciones inmediatas */}
          <div className="space-y-4">
            <h5 className="font-semibold text-amber-800 dark:text-amber-200 flex items-center">
              <span className="mr-2">⚡</span>
              Acciones Inmediatas
            </h5>
            
            {risk_assessment.overall_risk === 'high' && (
              <div className="bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg p-3">
                <div className="flex items-start space-x-3">
                  <span className="text-red-600 text-xl">🚨</span>
                  <div>
                    <p className="font-bold text-red-800 dark:text-red-200">Consulta Urgente</p>
                    <p className="text-sm text-red-700 dark:text-red-300">Programa cita dermatológica en 24-48 horas</p>
                  </div>
                </div>
              </div>
            )}
            
            {risk_assessment.overall_risk === 'medium' && (
              <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded-lg p-3">
                <div className="flex items-start space-x-3">
                  <span className="text-yellow-600 text-xl">⏰</span>
                  <div>
                    <p className="font-bold text-yellow-800 dark:text-yellow-200">Seguimiento Prioritario</p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">Consulta dermatológica en 1-2 semanas</p>
                  </div>
                </div>
              </div>
            )}
            
            {risk_assessment.overall_risk === 'low' && (
              <div className="bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg p-3">
                <div className="flex items-start space-x-3">
                  <span className="text-green-600 text-xl">✅</span>
                  <div>
                    <p className="font-bold text-green-800 dark:text-green-200">Monitoreo Regular</p>
                    <p className="text-sm text-green-700 dark:text-green-300">Observación y chequeos de rutina</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Recomendaciones específicas del tipo más probable */}
            <div className="bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 rounded-lg p-3">
              <h6 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                Específico para {SKIN_LESION_TYPES[most_likely.type]?.fullName}:
              </h6>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                {SKIN_LESION_TYPES[most_likely.type]?.recommendations?.map((rec, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="mr-2 text-blue-500">•</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Cuidados generales */}
          <div className="space-y-4">
            <h5 className="font-semibold text-amber-800 dark:text-amber-200 flex items-center">
              <span className="mr-2">🛡️</span>
              Cuidados Generales
            </h5>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <span className="text-xl">📸</span>
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-200">Documentación Fotográfica</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Toma fotos mensuales para seguimiento</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <span className="text-xl">☀️</span>
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-200">Protección Solar</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">SPF 30+ diario, evita exposición 10-16h</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <span className="text-xl">🔍</span>
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-200">Autoexamen</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Revisa cambios en ABCDE mensualmente</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <span className="text-xl">📋</span>
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-200">Historial Médico</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Mantén registro de cambios y consultas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Disclaimer médico */}
        <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600">
          <div className="flex items-start space-x-3">
            <span className="text-gray-600 dark:text-gray-400 text-xl">⚕️</span>
            <div>
              <p className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Importante:</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Este análisis es una herramienta de apoyo diagnóstico. Siempre consulta con un dermatólogo 
                certificado para evaluación profesional y diagnóstico definitivo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

DetailedAnalysisResults.displayName = 'DetailedAnalysisResults'

// Agregar estilos CSS para animaciones
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out;
  }
`

// Inyectar estilos si no existen
if (typeof document !== 'undefined' && !document.getElementById('detailed-analysis-styles')) {
  const styleSheet = document.createElement('style')
  styleSheet.id = 'detailed-analysis-styles'
  styleSheet.textContent = styles
  document.head.appendChild(styleSheet)
}

export default DetailedAnalysisResults