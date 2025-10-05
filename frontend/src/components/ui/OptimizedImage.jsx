import { useState, useCallback, useMemo, memo } from 'react'

/**
 * Componente de imagen optimizado con lazy loading y compresión
 */
const OptimizedImage = memo(({ 
  src, 
  alt, 
  className = '', 
  width, 
  height, 
  quality = 80,
  loading = 'lazy',
  onLoad,
  onError,
  fallback = null,
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  // Generar srcSet para diferentes densidades de pantalla
  const srcSet = useMemo(() => {
    if (!src) return ''
    
    const baseSrc = src.split('.').slice(0, -1).join('.')
    const extension = src.split('.').pop()
    
    return [
      `${src} 1x`,
      `${baseSrc}@2x.${extension} 2x`,
      `${baseSrc}@3x.${extension} 3x`
    ].join(', ')
  }, [src])

  // Optimizar URL de imagen con parámetros de calidad
  const optimizedSrc = useMemo(() => {
    if (!src) return ''
    
    // Si es una URL externa, agregar parámetros de optimización
    if (src.startsWith('http')) {
      const url = new URL(src)
      url.searchParams.set('q', quality)
      if (width) url.searchParams.set('w', width)
      if (height) url.searchParams.set('h', height)
      return url.toString()
    }
    
    return src
  }, [src, quality, width, height])

  const handleLoad = useCallback((e) => {
    setIsLoaded(true)
    setHasError(false)
    onLoad?.(e)
  }, [onLoad])

  const handleError = useCallback((e) => {
    setHasError(true)
    setIsLoaded(false)
    onError?.(e)
  }, [onError])

  // Mostrar fallback si hay error
  if (hasError && fallback) {
    return fallback
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Placeholder mientras carga */}
      {!isLoaded && (
        <div 
          className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center"
          style={{ width, height }}
        >
          <svg 
            className="w-8 h-8 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
        </div>
      )}
      
      {/* Imagen optimizada */}
      <img
        src={optimizedSrc}
        srcSet={srcSet}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        {...props}
      />
    </div>
  )
})

OptimizedImage.displayName = 'OptimizedImage'

export default OptimizedImage

/**
 * Hook para optimización de imágenes
 */
export const useImageOptimization = () => {
  // Comprimir imagen antes de subirla
  const compressImage = useCallback((file, maxWidth = 1024, quality = 0.8) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      
      img.onload = () => {
        // Calcular nuevas dimensiones manteniendo aspect ratio
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height)
        canvas.width = img.width * ratio
        canvas.height = img.height * ratio
        
        // Dibujar imagen redimensionada
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        
        // Convertir a blob comprimido
        canvas.toBlob(resolve, 'image/jpeg', quality)
      }
      
      img.src = URL.createObjectURL(file)
    })
  }, [])

  // Generar thumbnail
  const generateThumbnail = useCallback((file, size = 150) => {
    return compressImage(file, size, 0.7)
  }, [compressImage])

  // Validar tipo de imagen
  const validateImageType = useCallback((file) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    return validTypes.includes(file.type)
  }, [])

  // Validar tamaño de imagen
  const validateImageSize = useCallback((file, maxSizeMB = 10) => {
    return file.size <= maxSizeMB * 1024 * 1024
  }, [])

  return {
    compressImage,
    generateThumbnail,
    validateImageType,
    validateImageSize
  }
}