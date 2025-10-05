import { Outlet } from 'react-router-dom'
import NavBar from './NavBar'
import SystemInfo from '../common/SystemInfo'
import PerformanceMetrics from '../common/PerformanceMetrics'

const Layout = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Barra de navegación */}
      <NavBar />
      
      {/* Contenido principal */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-background border-t border-gray-600/20 mt-auto transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Logo y descripción */}
            <div className="flex items-center space-x-3">
              <img
                src="/img/OncoDerma-Logo.png"
                alt="OncoDerma"
                className="h-9 w-auto"
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
              <span className="text-sm text-gray-600">
                Análisis de piel con inteligencia artificial
              </span>
            </div>
            
            {/* Disclaimer médico */}
            <div className="text-center md:text-right">
              <p className="text-xs text-gray-500 max-w-md">
                <strong>Importante:</strong> Esta aplicación es una herramienta de apoyo y no reemplaza el diagnóstico médico profesional. 
                Siempre consulta con un especialista.
              </p>
            </div>
          </div>
          
          {/* Copyright y herramientas de desarrollo */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-400">
                © 2024 OncoDerma. Desarrollado para fines educativos y de demostración.
              </p>
              <div className="flex space-x-4">
                <PerformanceMetrics />
                <SystemInfo />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout