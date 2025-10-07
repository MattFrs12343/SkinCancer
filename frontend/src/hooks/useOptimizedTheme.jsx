import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme debe ser usado dentro de un ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  // Obtener tema inicial del localStorage o usar 'light' por defecto
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('oncoderma-theme')
      if (savedTheme) {
        return savedTheme
      }
      // Detectar preferencia del sistema
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'light'
  })

  const isTransitioning = useRef(false)
  const transitionTimeoutRef = useRef(null)

  // Función optimizada para aplicar tema
  const applyTheme = useCallback((newTheme) => {
    const root = document.documentElement
    
    // Deshabilitar transiciones temporalmente para cambio instantáneo
    if (!isTransitioning.current) {
      isTransitioning.current = true
      
      // Agregar clase que deshabilita transiciones
      root.classList.add('theme-transitioning')
      
      // Aplicar el nuevo tema inmediatamente
      root.setAttribute('data-theme', newTheme)
      
      // Actualizar meta theme-color para móviles
      const metaThemeColor = document.querySelector('meta[name="theme-color"]')
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', newTheme === 'dark' ? '#0c1220' : '#f1f5f9')
      }
      
      // Forzar un reflow para aplicar los cambios inmediatamente
      root.offsetHeight
      
      // Re-habilitar transiciones después de un frame
      requestAnimationFrame(() => {
        root.classList.remove('theme-transitioning')
        isTransitioning.current = false
      })
    }
    
    // Guardar en localStorage
    localStorage.setItem('oncoderma-theme', newTheme)
  }, [])

  // Aplicar tema al documento con optimización
  useEffect(() => {
    applyTheme(theme)
  }, [theme, applyTheme])

  // Escuchar cambios en la preferencia del sistema
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = (e) => {
      // Solo cambiar automáticamente si no hay preferencia guardada
      const savedTheme = localStorage.getItem('oncoderma-theme')
      if (!savedTheme) {
        setTheme(e.matches ? 'dark' : 'light')
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Toggle optimizado con debounce para evitar cambios rápidos
  const toggleTheme = useCallback(() => {
    if (isTransitioning.current) return // Evitar cambios durante transición
    
    // Limpiar timeout anterior si existe
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current)
    }
    
    // Debounce para evitar clicks rápidos
    transitionTimeoutRef.current = setTimeout(() => {
      setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light')
    }, 50)
  }, [])

  const setLightTheme = useCallback(() => {
    if (theme !== 'light') {
      setTheme('light')
    }
  }, [theme])
  
  const setDarkTheme = useCallback(() => {
    if (theme !== 'dark') {
      setTheme('dark')
    }
  }, [theme])

  // Cleanup
  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current)
      }
    }
  }, [])

  const value = {
    theme,
    toggleTheme,
    setLightTheme,
    setDarkTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
    isTransitioning: isTransitioning.current
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}