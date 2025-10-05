import { useState } from 'react'

const FAQ = () => {
  const [openQuestion, setOpenQuestion] = useState(null)

  const faqItems = [
    {
      id: 1,
      question: '¿Qué tipos de imágenes puedo subir?',
      answer: 'Puedes subir imágenes en formato JPG o PNG, con un tamaño máximo de 10MB. Recomendamos imágenes claras, bien iluminadas y enfocadas en la lesión de piel.'
    },
    {
      id: 2,
      question: '¿Qué tan preciso es el análisis?',
      answer: 'Nuestro modelo de IA tiene una precisión del 95% en condiciones de laboratorio. Sin embargo, este es solo una herramienta de apoyo y NO reemplaza el diagnóstico médico profesional.'
    },
    {
      id: 3,
      question: '¿Se almacenan mis imágenes?',
      answer: 'No. Las imágenes se procesan temporalmente y se eliminan inmediatamente después del análisis. No almacenamos ninguna información personal ni médica.'
    },
    {
      id: 4,
      question: '¿Puedo usar esto para diagnosticar cáncer?',
      answer: 'NO. Esta aplicación es únicamente una herramienta de apoyo. Siempre debes consultar con un dermatólogo o médico especialista para cualquier diagnóstico médico.'
    },
    {
      id: 5,
      question: '¿Cuánto tiempo toma el análisis?',
      answer: 'El análisis típicamente toma entre 2-8 segundos, dependiendo del tamaño y calidad de la imagen.'
    },
    {
      id: 6,
      question: '¿Funciona en dispositivos móviles?',
      answer: 'Sí, la aplicación está optimizada para funcionar en navegadores móviles modernos (iOS Safari, Android Chrome, etc.).'
    }
  ]

  const toggleQuestion = (questionId) => {
    setOpenQuestion(openQuestion === questionId ? null : questionId)
  }

  return (
    <div className="py-8 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">
          Preguntas Frecuentes
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Encuentra respuestas a las preguntas más comunes sobre OncoDerma y su funcionamiento
        </p>
      </div>

      {/* FAQ Items */}
      <div className="max-w-4xl mx-auto">
        <div className="space-y-4">
          {faqItems.map((item) => (
            <div 
              key={item.id} 
              className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <button
                onClick={() => toggleQuestion(item.id)}
                className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-opacity-50 rounded-lg"
              >
                <h3 className="text-lg font-semibold text-primary pr-4">
                  ❓ {item.question}
                </h3>
                <div className={`transform transition-transform duration-200 ${
                  openQuestion === item.id ? 'rotate-180' : ''
                }`}>
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              
              {openQuestion === item.id && (
                <div className="px-6 pb-4">
                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-gray-700 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>



      {/* Quick Tips */}
      <div className="max-w-4xl mx-auto">
        <div className="card">
          <h2 className="text-2xl font-semibold text-primary mb-6 text-center">
            💡 Consejos para mejores resultados
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-primary mb-1">Buena iluminación</h3>
                  <p className="text-gray-600 text-sm">Usa luz natural o una lámpara brillante para capturar la imagen</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-primary mb-1">Imagen enfocada</h3>
                  <p className="text-gray-600 text-sm">Asegúrate de que la lesión esté nítida y bien definida</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-primary mb-1">Distancia adecuada</h3>
                  <p className="text-gray-600 text-sm">Mantén una distancia que permita ver claramente la lesión</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-red-600 text-sm">✗</span>
                </div>
                <div>
                  <h3 className="font-semibold text-primary mb-1">Evita sombras</h3>
                  <p className="text-gray-600 text-sm">Las sombras pueden afectar la precisión del análisis</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-red-600 text-sm">✗</span>
                </div>
                <div>
                  <h3 className="font-semibold text-primary mb-1">No uses flash</h3>
                  <p className="text-gray-600 text-sm">El flash puede crear reflejos y alterar los colores</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-red-600 text-sm">✗</span>
                </div>
                <div>
                  <h3 className="font-semibold text-primary mb-1">Imágenes borrosas</h3>
                  <p className="text-gray-600 text-sm">Las imágenes desenfocadas reducen la precisión del análisis</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FAQ