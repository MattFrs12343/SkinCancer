import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { ThemeProvider } from './hooks/useTheme.jsx'
import LoadingSpinner from './components/ui/LoadingSpinner'

// Lazy loading de componentes para code splitting
const Layout = lazy(() => import('./components/layout/Layout'))
const Home = lazy(() => import('./pages/Home'))
const Analizar = lazy(() => import('./pages/Analizar'))
const FAQ = lazy(() => import('./pages/FAQ'))
const Contacto = lazy(() => import('./pages/Contacto'))

function App() {
  return (
    <ThemeProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="min-h-screen bg-background transition-colors duration-300">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="analizar" element={<Analizar />} />
                <Route path="faq" element={<FAQ />} />
                <Route path="contacto" element={<Contacto />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App