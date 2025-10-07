import { useState, useCallback, useMemo, useRef } from 'react'

/**
 * Hook optimizado para manejo de estado con memoización automática
 * Reduce re-renders innecesarios y optimiza el rendimiento
 */
export const useOptimizedState = (initialState) => {
  const [state, setState] = useState(initialState)
  const previousStateRef = useRef(initialState)

  // Setter optimizado que evita actualizaciones innecesarias
  const setOptimizedState = useCallback((newState) => {
    setState(prevState => {
      const nextState = typeof newState === 'function' ? newState(prevState) : newState
      
      // Comparación superficial para evitar re-renders innecesarios
      if (JSON.stringify(nextState) === JSON.stringify(previousStateRef.current)) {
        return prevState
      }
      
      previousStateRef.current = nextState
      return nextState
    })
  }, [])

  // Resetear al estado inicial
  const resetState = useCallback(() => {
    setOptimizedState(initialState)
  }, [initialState, setOptimizedState])

  // Actualizar parcialmente el estado (para objetos)
  const updateState = useCallback((updates) => {
    setOptimizedState(prevState => ({
      ...prevState,
      ...updates
    }))
  }, [setOptimizedState])

  return [state, setOptimizedState, { resetState, updateState }]
}

/**
 * Hook para debounce optimizado
 */
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value)
  const timeoutRef = useRef()

  useMemo(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * Hook para throttle optimizado
 */
export const useThrottle = (callback, delay) => {
  const lastRun = useRef(Date.now())

  return useCallback((...args) => {
    if (Date.now() - lastRun.current >= delay) {
      callback(...args)
      lastRun.current = Date.now()
    }
  }, [callback, delay])
}

/**
 * Hook para memoización de cálculos costosos
 */
export const useExpensiveCalculation = (calculation, dependencies) => {
  return useMemo(() => {
    console.log('Ejecutando cálculo costoso...')
    return calculation()
  }, dependencies)
}