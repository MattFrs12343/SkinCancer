import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="py-8 space-y-16">
      {/* Hero Section */}
      <section className="text-center py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Bienvenido a OncoDerma
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Análisis de imágenes de piel con inteligencia artificial para apoyo en la detección temprana
          </p>
          

          
          <Link
            to="/analizar"
            className="inline-block bg-secondary hover:bg-primary text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 text-lg"
          >
            Comenzar Análisis
          </Link>
        </div>
      </section>

      {/* Qué es OncoDerma */}
      <section className="card">
        <h2 className="text-3xl font-semibold text-primary mb-6 text-center">
          ¿Qué es OncoDerma?
        </h2>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-gray-700 mb-4 leading-relaxed">
              OncoDerma es una aplicación innovadora que utiliza inteligencia artificial para analizar imágenes de la piel 
              y proporcionar una estimación del riesgo de cáncer de piel.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Nuestra tecnología está diseñada para ser una herramienta de apoyo que ayude tanto a pacientes como a 
              profesionales de la salud en la detección temprana de posibles anomalías en la piel.
            </p>
            <div className="bg-accent/10 p-6 rounded-lg mt-6">
              <h3 className="text-xl font-semibold text-secondary mb-4">Características principales:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-accent rounded-full mr-3"></span>
                  Análisis rápido con IA avanzada
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-accent rounded-full mr-3"></span>
                  Interfaz fácil de usar
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-accent rounded-full mr-3"></span>
                  Resultados visuales claros
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-accent rounded-full mr-3"></span>
                  Privacidad garantizada
                </li>
              </ul>
            </div>
          </div>
          <div className="flex justify-center">
            <img 
              src="/img/medical-analysis.svg" 
              alt="Análisis médico con IA" 
              className="w-full max-w-md h-auto"
            />
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="card">
        <h2 className="text-3xl font-semibold text-primary mb-8 text-center">
          ¿Cómo funciona?
        </h2>
        

        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transform hover:scale-105 transition-transform duration-200">
              <span className="text-4xl">📸</span>
            </div>
            <h3 className="text-xl font-semibold text-primary mb-3">Sube tu imagen</h3>
            <p className="text-gray-600">
              Toma una foto clara de la zona de piel que quieres analizar o sube una imagen existente.
            </p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transform hover:scale-105 transition-transform duration-200">
              <span className="text-4xl">🤖</span>
            </div>
            <h3 className="text-xl font-semibold text-primary mb-3">Análisis con IA</h3>
            <p className="text-gray-600">
              Nuestro modelo de inteligencia artificial procesa la imagen y analiza las características de la piel.
            </p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transform hover:scale-105 transition-transform duration-200">
              <span className="text-4xl">📊</span>
            </div>
            <h3 className="text-xl font-semibold text-primary mb-3">Obtén resultados</h3>
            <p className="text-gray-600">
              Recibe un porcentaje de probabilidad y recomendaciones para consultar con un especialista.
            </p>
          </div>
        </div>
      </section>

      {/* Ventajas para médicos */}
      <section className="card bg-gradient-to-r from-secondary/5 to-accent/5">
        <h2 className="text-3xl font-semibold text-primary mb-8 text-center">
          Ventajas para Médicos
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-primary mb-2">Herramienta de apoyo diagnóstico</h3>
                <p className="text-gray-600">Complementa el criterio médico con análisis basado en IA</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-primary mb-2">Detección temprana</h3>
                <p className="text-gray-600">Ayuda a identificar casos que requieren atención prioritaria</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-primary mb-2">Eficiencia en consultas</h3>
                <p className="text-gray-600">Optimiza el tiempo de evaluación inicial</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-primary mb-2">Documentación visual</h3>
                <p className="text-gray-600">Facilita el seguimiento y comparación de lesiones</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seguridad y privacidad */}
      <section className="card">
        <h2 className="text-3xl font-semibold text-primary mb-8 text-center">
          Seguridad y Privacidad
        </h2>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-xl font-semibold text-secondary mb-4">Tu privacidad es nuestra prioridad</h3>
            <ul className="space-y-3 text-gray-700 mb-6">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Las imágenes se procesan temporalmente y se eliminan inmediatamente
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                No almacenamos ninguna información personal ni médica
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Comunicación cifrada con protocolo HTTPS
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Cumplimiento con estándares de seguridad médica
              </li>
            </ul>
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-800 mb-3">🔒 Proceso seguro:</h4>
              <ol className="space-y-2 text-green-700 text-sm">
                <li>1. Imagen se sube de forma cifrada</li>
                <li>2. Se procesa en servidor seguro</li>
                <li>3. Se genera el análisis</li>
                <li>4. Imagen se elimina automáticamente</li>
                <li>5. Solo recibes el resultado</li>
              </ol>
            </div>
          </div>
          <div className="flex justify-center">
            <img 
              src="/img/security-privacy.svg" 
              alt="Seguridad y privacidad de datos" 
              className="w-full max-w-md h-auto"
            />
          </div>
        </div>
      </section>

      {/* Resultados confiables */}
      <section className="card bg-gradient-to-r from-accent/5 to-secondary/5">
        <h2 className="text-3xl font-semibold text-primary mb-8 text-center">
          Resultados Confiables
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8 items-center mb-8">
          <div>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Nuestro modelo de inteligencia artificial ha sido entrenado con miles de imágenes dermatológicas 
              para proporcionar análisis precisos y confiables.
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-secondary mb-1">95%</div>
                <p className="text-xs text-gray-600">Precisión</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-secondary mb-1">&lt;30s</div>
                <p className="text-xs text-gray-600">Análisis</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-secondary mb-1">24/7</div>
                <p className="text-xs text-gray-600">Disponible</p>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <img 
              src="/img/ai-technology.svg" 
              alt="Tecnología de IA avanzada" 
              className="w-full max-w-md h-auto"
            />
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="card">
        <h2 className="text-3xl font-semibold text-primary mb-8 text-center">
          Testimonios
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <p className="text-gray-700 mb-6 italic text-lg leading-relaxed">
              "OncoDerma me ayudó a detectar una lesión sospechosa que no había notado. 
              Gracias a la recomendación, consulté con mi dermatólogo a tiempo."
            </p>
            <div className="flex items-center">
              <img 
                src="/img/avatar-maria-gonzalez.svg" 
                alt="María González" 
                className="w-14 h-14 rounded-full mr-4 border-2 border-accent/20"
              />
              <div>
                <p className="font-semibold text-primary text-lg">María González</p>
                <p className="text-sm text-gray-600">Paciente</p>
                <div className="flex mt-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-sm">⭐</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <p className="text-gray-700 mb-6 italic text-lg leading-relaxed">
              "Como dermatólogo, encuentro que OncoDerma es una excelente herramienta de apoyo 
              para el screening inicial de mis pacientes."
            </p>
            <div className="flex items-center">
              <img 
                src="/img/avatar-dr-carlos-ruiz.svg" 
                alt="Dr. Carlos Ruiz" 
                className="w-14 h-14 rounded-full mr-4 border-2 border-secondary/20"
              />
              <div>
                <p className="font-semibold text-primary text-lg">Dr. Carlos Ruiz</p>
                <p className="text-sm text-gray-600">Dermatólogo Certificado</p>
                <div className="flex mt-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-sm">⭐</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Legal */}
      <section className="card">
        <h2 className="text-3xl font-semibold text-primary mb-6 text-center">
          Información Legal y Responsabilidades
        </h2>
        <div className="space-y-6">

          
          {/* Términos adicionales */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-gray-400 rounded-full mr-3 mt-2"></span>
                Esta aplicación es solo para fines educativos y de demostración
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-gray-400 rounded-full mr-3 mt-2"></span>
                No debe utilizarse como único criterio para decisiones médicas
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-gray-400 rounded-full mr-3 mt-2"></span>
                Los desarrolladores no se hacen responsables por decisiones médicas basadas en esta aplicación
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-gray-400 rounded-full mr-3 mt-2"></span>
                El uso de esta aplicación implica la aceptación de estos términos
              </li>
            </ul>
          </div>
          

        </div>
      </section>


    </div>
  )
}

export default Home