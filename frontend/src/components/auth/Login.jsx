import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.jsx'
import { validateRequired } from '../../utils/validators'

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [generalError, setGeneralError] = useState('')

  const navigate = useNavigate()
  const location = useLocation()
  const { login, isAuthenticated } = useAuth()

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/'
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, location])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
    
    // Limpiar error general
    if (generalError) {
      setGeneralError('')
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Validar usuario
    const usernameValidation = validateRequired(formData.username, 'Usuario')
    if (!usernameValidation.isValid) {
      newErrors.username = usernameValidation.error
    }

    // Validar contraseña
    const passwordValidation = validateRequired(formData.password, 'Contraseña')
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.error
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    setGeneralError('')

    try {
      const result = await login(formData.username, formData.password)
      
      if (result.success) {
        // Redirigir a la página desde donde vino o al home
        const from = location.state?.from?.pathname || '/'
        navigate(from, { replace: true })
      } else {
        setGeneralError(result.message || 'Error de autenticación')
      }
    } catch (error) {
      setGeneralError('Error de conexión. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="card max-w-md w-full">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <img 
            src="/img/OncoDerma-Logo.png" 
            alt="OncoDerma Logo" 
            className="h-16 mx-auto mb-4"
            onError={(e) => {
              e.target.style.display = 'none'
            }}
          />
          <h1 className="text-2xl font-semibold text-primary mb-2">
            Bienvenido a OncoDerma
          </h1>
          <p className="text-gray-600 text-sm">
            Análisis de piel con inteligencia artificial
          </p>
        </div>

        {/* Formulario de login */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campo Usuario */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-primary mb-2">
              Usuario
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className={`input-field ${errors.username ? 'border-red-500 focus:ring-red-500' : ''}`}
              placeholder="Ingresa tu usuario"
              disabled={loading}
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">{errors.username}</p>
            )}
          </div>

          {/* Campo Contraseña */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-primary mb-2">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`input-field ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
              placeholder="Ingresa tu contraseña"
              disabled={loading}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          {/* Error general */}
          {generalError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600">{generalError}</p>
            </div>
          )}

          {/* Botón de submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full btn-primary ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Iniciando sesión...
              </div>
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </form>

        {/* Credenciales de prueba */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800 font-medium mb-2">Credenciales de prueba:</p>
          <p className="text-sm text-blue-700">
            <strong>Usuario:</strong> admin<br />
            <strong>Contraseña:</strong> 1234
          </p>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Esta aplicación es una herramienta de apoyo y no reemplaza el diagnóstico médico profesional.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login