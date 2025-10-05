import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.jsx'
import { useTheme } from '../../hooks/useTheme.jsx'
import { validateRequired } from '../../utils/validators'
import ThemeToggle from '../ui/ThemeToggle'
import AdaptiveLogo from '../ui/AdaptiveLogo'

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
  const { isDark, toggleTheme } = useTheme()

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
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-accent/20 to-secondary/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-secondary/20 to-accent/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-accent/10 to-secondary/10 rounded-full blur-3xl"></div>
      </div>

      {/* Toggle de tema */}
      <div className="absolute top-6 right-6 z-50">
        <div className="bg-white/20 backdrop-blur-md rounded-xl p-2 shadow-lg border border-white/30">
          <button
            onClick={toggleTheme}
            className="relative p-2 rounded-lg transition-all duration-300 hover:bg-white/20"
            aria-label={`Cambiar a tema ${isDark ? 'claro' : 'oscuro'}`}
            title={`Cambiar a tema ${isDark ? 'claro' : 'oscuro'}`}
          >
            {isDark ? (
              // Icono de sol para modo oscuro
              <svg 
                className="w-5 h-5 text-yellow-400 transition-all duration-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" 
                />
              </svg>
            ) : (
              // Icono de luna para modo claro
              <svg 
                className="w-5 h-5 text-blue-600 transition-all duration-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Contenedor principal */}
      <div className="relative z-10 min-h-screen flex">
        {/* Panel izquierdo - Información */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center pl-16 pr-8">
          <div className="max-w-md ml-auto">
            <div className="mb-8">
              <AdaptiveLogo className="h-20 w-auto mb-6" alt="OncoDerma" />
              <h1 className="text-4xl font-bold text-primary mb-4">
                Bienvenido a OncoDerma
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                Análisis de piel con inteligencia artificial para la detección temprana de anomalías.
              </p>
            </div>

            {/* Características destacadas */}
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-accent to-secondary rounded-full flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-primary">Análisis Rápido</h3>
                  <p className="text-sm text-gray-600">Resultados en menos de 30 segundos</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-secondary to-accent rounded-full flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-primary">100% Seguro</h3>
                  <p className="text-sm text-gray-600">Tus datos están protegidos</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-accent to-secondary rounded-full flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-primary">IA Avanzada</h3>
                  <p className="text-sm text-gray-600">95% de precisión en análisis</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Panel derecho - Formulario */}
        <div className="w-full lg:w-1/2 flex items-center justify-center pl-8 pr-16 py-12">
          <div className="w-full max-w-md mr-auto">
            {/* Logo móvil */}
            <div className="lg:hidden text-center mb-8">
              <AdaptiveLogo className="h-16 w-auto mx-auto mb-4" alt="OncoDerma" />
              <h2 className="text-2xl font-bold text-primary">Iniciar Sesión</h2>
            </div>

            {/* Card del formulario */}
            <div className="card">
              <div className="hidden lg:block mb-6">
                <h2 className="text-2xl font-bold text-primary mb-2">Iniciar Sesión</h2>
                <p className="text-gray-600">Accede a tu cuenta para continuar</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Campo Usuario */}
                <div className="space-y-2">
                  <label htmlFor="username" className="block text-sm font-medium text-primary">
                    Usuario
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className={`input-field pl-10 ${
                        errors.username 
                          ? 'border-red-600 focus:border-red-600 focus:ring-red-600/20' 
                          : ''
                      }`}
                      placeholder="Ingresa tu usuario"
                      disabled={loading}
                    />
                  </div>
                  {errors.username && (
                    <p className="text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      {errors.username}
                    </p>
                  )}
                </div>

                {/* Campo Contraseña */}
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-primary">
                    Contraseña
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`input-field pl-10 ${
                        errors.password 
                          ? 'border-red-600 focus:border-red-600 focus:ring-red-600/20' 
                          : ''
                      }`}
                      placeholder="Ingresa tu contraseña"
                      disabled={loading}
                    />
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Error general */}
                {generalError && (
                  <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm text-red-700 font-medium">{generalError}</p>
                    </div>
                  </div>
                )}

                {/* Botón de submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full bg-gradient-to-r from-accent to-secondary hover:from-accent/90 hover:to-secondary/90 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg ${
                    loading ? 'opacity-50 cursor-not-allowed transform-none' : ''
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      <span>Iniciando sesión...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <span>Iniciar Sesión</span>
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  )}
                </button>
              </form>



              {/* Disclaimer */}
              <div className="mt-6 text-center">
                <p className="text-xs text-gray-600 leading-relaxed">
                  Esta aplicación es una herramienta de apoyo y no reemplaza el diagnóstico médico profesional.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login