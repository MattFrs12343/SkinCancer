import { useState, useEffect } from 'react'

const CircularProgressBar = ({ 
  percentage = 0, 
  size = 160, 
  strokeWidth = 12, 
  animated = true,
  showPercentage = true,
  color = 'secondary',
  className = ''
}) => {
  const [displayPercentage, setDisplayPercentage] = useState(0)
  
  // Animación del porcentaje
  useEffect(() => {
    if (animated) {
      let start = 0
      const end = percentage
      const duration = 2000 // 2 segundos
      const increment = end / (duration / 16) // 60fps
      
      const timer = setInterval(() => {
        start += increment
        if (start >= end) {
          setDisplayPercentage(end)
          clearInterval(timer)
        } else {
          setDisplayPercentage(Math.floor(start))
        }
      }, 16)
      
      return () => clearInterval(timer)
    } else {
      setDisplayPercentage(percentage)
    }
  }, [percentage, animated])

  // Configuración del círculo
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (displayPercentage / 100) * circumference

  // Colores según el porcentaje
  const getColor = () => {
    if (color !== 'dynamic') {
      const colors = {
        primary: '#0F172A',
        secondary: '#1E3A8A', 
        accent: '#06B6D4',
        green: '#10B981',
        yellow: '#F59E0B',
        red: '#EF4444'
      }
      return colors[color] || colors.secondary
    }

    // Color dinámico basado en el porcentaje
    if (displayPercentage <= 30) return '#10B981' // Verde - Bajo riesgo
    if (displayPercentage <= 60) return '#F59E0B' // Amarillo - Riesgo moderado
    return '#EF4444' // Rojo - Alto riesgo
  }

  // Mensaje según el porcentaje
  const getRiskMessage = () => {
    if (displayPercentage <= 30) return { text: 'Riesgo Bajo', color: 'text-green-600' }
    if (displayPercentage <= 60) return { text: 'Riesgo Moderado', color: 'text-yellow-600' }
    return { text: 'Riesgo Alto', color: 'text-red-600' }
  }

  const riskMessage = getRiskMessage()
  const strokeColor = getColor()

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Círculo de progreso */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          {/* Círculo de fondo */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          
          {/* Círculo de progreso */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={animated ? "transition-all duration-1000 ease-out" : ""}
            style={{
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
            }}
          />
        </svg>
        
        {/* Contenido central */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {showPercentage && (
            <>
              <span 
                className="text-4xl font-bold"
                style={{ color: strokeColor }}
              >
                {displayPercentage}%
              </span>
              <span className={`text-sm font-medium mt-1 ${riskMessage.color}`}>
                {riskMessage.text}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// Componente de progreso lineal para estados de carga
const LinearProgressBar = ({ 
  percentage = 0, 
  animated = true, 
  color = 'secondary',
  height = 8,
  className = ''
}) => {
  const [displayPercentage, setDisplayPercentage] = useState(0)

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setDisplayPercentage(percentage)
      }, 100)
      return () => clearTimeout(timer)
    } else {
      setDisplayPercentage(percentage)
    }
  }, [percentage, animated])

  const colors = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    accent: 'bg-accent',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500'
  }

  return (
    <div className={`w-full ${className}`}>
      <div 
        className="bg-gray-200 rounded-full overflow-hidden"
        style={{ height }}
      >
        <div
          className={`h-full ${colors[color] || colors.secondary} transition-all duration-1000 ease-out`}
          style={{ width: `${displayPercentage}%` }}
        />
      </div>
    </div>
  )
}

// Componente de progreso indeterminado para carga
const LoadingProgressBar = ({ 
  color = 'secondary', 
  size = 'md',
  className = '' 
}) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12', 
    lg: 'w-16 h-16'
  }

  const colors = {
    primary: 'border-primary',
    secondary: 'border-secondary',
    accent: 'border-accent'
  }

  return (
    <div className={`flex justify-center ${className}`}>
      <div 
        className={`
          ${sizes[size]} 
          border-4 
          ${colors[color] || colors.secondary}
          border-t-transparent 
          rounded-full 
          animate-spin
        `}
      />
    </div>
  )
}

export default CircularProgressBar
export { LinearProgressBar, LoadingProgressBar }