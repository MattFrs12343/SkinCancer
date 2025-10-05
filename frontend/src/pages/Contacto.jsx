import ContactInfo from '../components/common/ContactInfo'

const Contacto = () => {
  const whatsappNumber = '67708839'
  const whatsappUrl = `https://wa.me/${whatsappNumber}`

  const supportTopics = [
    {
      title: 'Soporte Técnico',
      description: 'Problemas con la aplicación, errores de carga, o dificultades técnicas',
      icon: '🔧',
      urgency: 'Respuesta en 2-4 horas'
    },
    {
      title: 'Consultas sobre Resultados',
      description: 'Preguntas sobre interpretación de resultados o funcionamiento del análisis',
      icon: '📊',
      urgency: 'Respuesta en 1-2 horas'
    },
    {
      title: 'Información General',
      description: 'Preguntas sobre la aplicación, características o términos de uso',
      icon: 'ℹ️',
      urgency: 'Respuesta en 4-8 horas'
    },
    {
      title: 'Reportar Problemas',
      description: 'Reportar errores, bugs o sugerir mejoras para la aplicación',
      icon: '🐛',
      urgency: 'Respuesta en 24 horas'
    }
  ]



  return (
    <div className="py-8 space-y-12">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">
          Contacto y Soporte
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Estamos aquí para ayudarte. Contáctanos para soporte técnico, consultas sobre resultados, 
          o cualquier pregunta sobre OncoDerma.
        </p>
      </div>

      {/* Contacto principal */}
      <div className="card bg-gradient-to-r from-green-50 to-blue-50 border border-green-200">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">📱</span>
          </div>
          <h2 className="text-3xl font-semibold text-primary mb-4">
            WhatsApp: {whatsappNumber}
          </h2>
          <p className="text-gray-700 mb-6 max-w-md mx-auto">
            Nuestro canal principal de soporte. Disponible 24/7 para asistencia inmediata.
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-3 bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-8 rounded-lg transition-colors duration-200 text-lg"
          >
            <span className="text-2xl">💬</span>
            <span>Abrir WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Tipos de soporte */}
      <div className="card">
        <h2 className="text-3xl font-semibold text-primary mb-8 text-center">
          ¿En qué podemos ayudarte?
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {supportTopics.map((topic, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-lg border border-gray-200 hover:border-secondary transition-colors duration-200">
              <div className="flex items-start space-x-4">
                <div className="text-3xl">{topic.icon}</div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-primary mb-2">
                    {topic.title}
                  </h3>
                  <p className="text-gray-700 mb-3">
                    {topic.description}
                  </p>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-sm text-green-600 font-medium">
                      {topic.urgency}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary inline-flex items-center space-x-2"
          >
            <span>📞</span>
            <span>Contactar Soporte</span>
          </a>
        </div>
      </div>



      {/* Información adicional */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Horarios y disponibilidad */}
        <div className="card">
          <h3 className="text-2xl font-semibold text-primary mb-6">
            📅 Horarios de Atención
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="font-medium text-gray-700">WhatsApp</span>
              <span className="text-green-600 font-semibold">24/7</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="font-medium text-gray-700">Soporte Técnico</span>
              <span className="text-secondary">Lun-Dom 8:00-22:00</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="font-medium text-gray-700">Consultas Médicas</span>
              <span className="text-secondary">Lun-Vie 9:00-18:00</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="font-medium text-gray-700">Respuesta Promedio</span>
              <span className="text-accent font-semibold">&lt; 2 horas</span>
            </div>
          </div>
        </div>

        {/* Información de emergencia */}
        <div className="card bg-red-50 border border-red-200">
          <h3 className="text-2xl font-semibold text-red-800 mb-6">
            🚨 Emergencias Médicas
          </h3>
          <div className="space-y-4 text-red-700">
            <p className="font-medium">
              Si tienes una emergencia médica, NO uses esta aplicación.
            </p>
            <div className="bg-red-100 p-4 rounded-lg">
              <p className="font-semibold mb-2">Contacta inmediatamente:</p>
              <ul className="space-y-1 text-sm">
                <li>• Servicios de emergencia: 911</li>
                <li>• Tu médico de cabecera</li>
                <li>• Sala de emergencias más cercana</li>
                <li>• Dermatólogo de urgencias</li>
              </ul>
            </div>
            <p className="text-sm">
              Esta aplicación es solo para consultas no urgentes y soporte técnico.
            </p>
          </div>
        </div>
      </div>



      {/* Información de contacto alternativa */}
      <div className="card bg-gray-50">
        <h3 className="text-2xl font-semibold text-primary mb-6 text-center">
          Otros Canales de Contacto
        </h3>
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">📧</span>
            </div>
            <h4 className="font-semibold text-primary mb-2">Email</h4>
            <p className="text-sm text-gray-600">
              soporte@oncoderma.com<br />
              <span className="text-xs">(Respuesta en 24-48h)</span>
            </p>
          </div>
          <div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">🌐</span>
            </div>
            <h4 className="font-semibold text-primary mb-2">Web</h4>
            <p className="text-sm text-gray-600">
              www.oncoderma.com<br />
              <span className="text-xs">(Documentación y recursos)</span>
            </p>
          </div>
          <div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">📱</span>
            </div>
            <h4 className="font-semibold text-primary mb-2">WhatsApp</h4>
            <p className="text-sm text-gray-600">
              {whatsappNumber}<br />
              <span className="text-xs text-green-600">(Recomendado - 24/7)</span>
            </p>
          </div>
        </div>
      </div>

      {/* Call to action final */}
      <div className="text-center">
        <div className="card bg-gradient-to-r from-secondary to-primary text-white">
          <h3 className="text-2xl font-semibold mb-4">
            ¿Necesitas ayuda ahora?
          </h3>
          <p className="mb-6 opacity-90">
            Nuestro equipo de soporte está listo para ayudarte con cualquier consulta sobre OncoDerma.
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-secondary hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors duration-200 inline-flex items-center space-x-2"
          >
            <span>💬</span>
            <span>Iniciar Conversación</span>
          </a>
        </div>
      </div>
    </div>
  )
}

export default Contacto