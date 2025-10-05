import { useState, useRef } from 'react'
import { validateImageFile, formatFileSize } from '../../utils/validators'
import { ERROR_MESSAGES } from '../../utils/constants'
import { useImageOptimization } from '../../hooks/useImageOptimization'

const FileUpload = ({ onFileSelect, disabled = false, className = '', autoOptimize = true }) => {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [error, setError] = useState('')
  const [optimizing, setOptimizing] = useState(false)
  const [optimizationInfo, setOptimizationInfo] = useState(null)
  const fileInputRef = useRef(null)
  const { optimizeImage, getImageMetadata } = useImageOptimization()

  // Manejar selección de archivo
  const handleFileSelect = async (file) => {
    setError('')
    setOptimizing(false)
    setOptimizationInfo(null)
    
    // Validar archivo
    const validation = validateImageFile(file)
    if (!validation.isValid) {
      const errorMessage = ERROR_MESSAGES[validation.error] || validation.error
      setError(errorMessage)
      return
    }

    let finalFile = file
    let optimizationResult = null

    // Optimizar imagen si está habilitado
    if (autoOptimize && file.size > 500 * 1024) { // Solo optimizar si es > 500KB
      try {
        setOptimizing(true)
        optimizationResult = await optimizeImage(file)
        
        if (optimizationResult.optimized) {
          finalFile = optimizationResult.file
          setOptimizationInfo(optimizationResult)
        }
      } catch (error) {
        console.warn('Error optimizando imagen:', error)
        // Continuar con archivo original si falla la optimización
      } finally {
        setOptimizing(false)
      }
    }

    // Crear preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewUrl(e.target.result)
    }
    reader.readAsDataURL(finalFile)

    setSelectedFile(finalFile)
    
    // Notificar al componente padre
    if (onFileSelect) {
      onFileSelect(finalFile)
    }
  }

  // Manejar drag events
  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  // Manejar drop
  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (disabled) return

    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFileSelect(files[0])
    }
  }

  // Manejar click en input
  const handleInputChange = (e) => {
    const files = e.target.files
    if (files && files[0]) {
      handleFileSelect(files[0])
    }
  }

  // Abrir selector de archivos
  const openFileSelector = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  // Limpiar selección
  const clearSelection = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setError('')
    setOptimizing(false)
    setOptimizationInfo(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    if (onFileSelect) {
      onFileSelect(null)
    }
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Área de drag & drop */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200
          ${dragActive 
            ? 'border-accent bg-accent/10' 
            : selectedFile 
              ? 'border-green-400 bg-green-50' 
              : 'border-gray-300 hover:border-secondary'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${error ? 'border-red-400 bg-red-50' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileSelector}
      >
        {/* Input oculto */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png"
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled}
        />

        {/* Contenido del área de upload */}
        {optimizing ? (
          // Vista de optimización
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div className="text-center">
              <p className="text-accent font-medium">Optimizando imagen...</p>
              <p className="text-sm text-gray-600 mt-1">
                Comprimiendo para mejor rendimiento
              </p>
            </div>
          </div>
        ) : selectedFile ? (
          // Vista con archivo seleccionado
          <div className="space-y-4">
            {previewUrl && (
              <div className="flex justify-center">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-32 max-w-full object-contain rounded-lg shadow-sm"
                />
              </div>
            )}
            <div>
              <p className="text-green-700 font-medium">✓ Archivo seleccionado</p>
              <p className="text-sm text-gray-600 mt-1">
                {selectedFile.name} ({formatFileSize(selectedFile.size)})
              </p>
              {optimizationInfo && optimizationInfo.optimized && (
                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-xs">
                  <p className="text-green-700">
                    ✨ Imagen optimizada: {optimizationInfo.compressionRatio}% reducción
                  </p>
                  <p className="text-green-600">
                    {formatFileSize(optimizationInfo.originalSize)} → {formatFileSize(optimizationInfo.compressedSize)}
                  </p>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                clearSelection()
              }}
              className="text-sm text-red-600 hover:text-red-800 transition-colors duration-200"
              disabled={disabled}
            >
              Cambiar imagen
            </button>
          </div>
        ) : (
          // Vista inicial
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
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
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
            </div>
            <div>
              <p className="text-lg font-medium text-primary mb-2">
                {dragActive ? 'Suelta la imagen aquí' : 'Sube una imagen de piel'}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Arrastra y suelta una imagen o haz clic para seleccionar
              </p>
              <div className="text-xs text-gray-500 space-y-1">
                <p>Formatos soportados: JPG, PNG</p>
                <p>Tamaño máximo: 10MB</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Consejos para mejores resultados */}
      {!selectedFile && !error && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="text-sm font-medium text-blue-800 mb-2">
            💡 Consejos para mejores resultados:
          </h4>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Usa buena iluminación natural</li>
            <li>• Mantén la cámara estable y enfocada</li>
            <li>• Incluye la lesión completa en la imagen</li>
            <li>• Evita sombras o reflejos</li>
            <li>• Toma la foto desde una distancia apropiada</li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default FileUpload