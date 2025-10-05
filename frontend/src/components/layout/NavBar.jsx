import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.jsx'

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const { user, logout } = useAuth()

  const navigation = [
    { name: 'Home', href: '/', current: location.pathname === '/' },
    { name: 'Analizar', href: '/analizar', current: location.pathname === '/analizar' },
    { name: 'Contacto', href: '/contacto', current: location.pathname === '/contacto' },
  ]

  const handleLogout = () => {
    logout()
    setIsMenuOpen(false)
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo y marca */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center" onClick={closeMenu}>
              <img
                src="/img/OncoDerma-Logo.png"
                alt="OncoDerma"
                className="h-16 w-auto"
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
            </Link>
          </div>

          {/* Navegación desktop */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  item.current
                    ? 'bg-secondary text-white'
                    : 'text-primary hover:text-secondary hover:bg-gray-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Usuario y logout */}
            <div className="flex items-center space-x-4 ml-6 pl-6 border-l border-gray-200">
              <span className="text-sm text-gray-600">
                Hola, <span className="font-medium text-primary">{user?.username}</span>
              </span>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-red-600 transition-colors duration-200"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>

          {/* Botón menú móvil */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-primary hover:text-secondary hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-secondary transition-colors duration-200"
              aria-expanded="false"
            >
              <span className="sr-only">Abrir menú principal</span>
              {/* Icono hamburguesa */}
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Icono X */}
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 border-t border-gray-200">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={closeMenu}
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                item.current
                  ? 'bg-secondary text-white'
                  : 'text-primary hover:text-secondary hover:bg-white'
              }`}
            >
              {item.name}
            </Link>
          ))}
          
          {/* Usuario y logout móvil */}
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="px-3 py-2">
              <div className="text-sm text-gray-600 mb-2">
                Hola, <span className="font-medium text-primary">{user?.username}</span>
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left text-sm text-red-600 hover:text-red-800 transition-colors duration-200"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default NavBar