# Documento de Requisitos - OncoDerma

## Introducción

OncoDerma es una aplicación web y móvil que utiliza inteligencia artificial para analizar imágenes de la piel y entregar un porcentaje estimado de probabilidad de cáncer. La aplicación no reemplaza el diagnóstico médico, sino que sirve como apoyo para pacientes y especialistas. El sistema incluye autenticación básica, interfaz responsiva, procesamiento de imágenes con IA, y comunicación segura.

## Requisitos

### Requisito 1 - Autenticación de Usuario

**Historia de Usuario:** Como usuario del sistema, quiero poder acceder a la aplicación mediante credenciales de prueba, para poder utilizar las funcionalidades de análisis de imágenes.

#### Criterios de Aceptación

1. CUANDO el usuario accede a la aplicación ENTONCES el sistema DEBERÁ mostrar una pantalla de login como interfaz inicial
2. CUANDO el usuario ingresa las credenciales "admin" y "1234" ENTONCES el sistema DEBERÁ validar localmente y permitir el acceso
3. CUANDO las credenciales son incorrectas ENTONCES el sistema DEBERÁ mostrar un mensaje de error apropiado
4. SI el usuario está autenticado ENTONCES el sistema DEBERÁ redirigir a la página principal

### Requisito 2 - Navegación y Estructura de la Aplicación

**Historia de Usuario:** Como usuario autenticado, quiero navegar entre las diferentes secciones de la aplicación de manera intuitiva, para acceder a toda la funcionalidad disponible.

#### Criterios de Aceptación

1. CUANDO el usuario está autenticado ENTONCES el sistema DEBERÁ mostrar una barra de navegación con las secciones: Home, Analizar, Contacto
2. CUANDO el usuario hace clic en "Home" ENTONCES el sistema DEBERÁ mostrar las secciones: Qué es OncoDerma, Cómo funciona, Ventajas para médicos, Seguridad y privacidad, Resultados confiables, Testimonios, Legal, Contacto
3. CUANDO el usuario hace clic en "Analizar" ENTONCES el sistema DEBERÁ mostrar el formulario de subida de imágenes
4. CUANDO el usuario hace clic en "Contacto" ENTONCES el sistema DEBERÁ mostrar información de contacto con WhatsApp 8888888

### Requisito 3 - Análisis de Imágenes con IA

**Historia de Usuario:** Como usuario, quiero subir imágenes de piel para obtener un análisis automatizado con porcentaje de probabilidad de cáncer, para tener una referencia inicial antes de consultar a un especialista.

#### Criterios de Aceptación

1. CUANDO el usuario está en la sección "Analizar" ENTONCES el sistema DEBERÁ mostrar un formulario para subir imágenes
2. CUANDO el usuario sube una imagen válida ENTONCES el sistema DEBERÁ procesarla usando el modelo de IA en el backend
3. CUANDO el procesamiento se completa ENTONCES el sistema DEBERÁ mostrar el resultado como porcentaje en una barra circular
4. CUANDO se muestra el resultado ENTONCES el sistema DEBERÁ incluir el tiempo estimado de procesamiento
5. CUANDO se procesa una imagen ENTONCES el sistema DEBERÁ eliminarla temporalmente después del análisis por seguridad

### Requisito 4 - Interfaz Responsiva y Diseño Visual

**Historia de Usuario:** Como usuario en diferentes dispositivos, quiero que la aplicación se vea y funcione correctamente en web y móvil, para poder usarla desde cualquier plataforma.

#### Criterios de Aceptación

1. CUANDO el usuario accede desde cualquier dispositivo ENTONCES el sistema DEBERÁ mostrar una interfaz responsiva que se adapte al tamaño de pantalla
2. CUANDO se muestra cualquier interfaz ENTONCES el sistema DEBERÁ usar la paleta de colores oficial: #0F172A, #1E3A8A, #06B6D4, #E2E8F0, #FFFFFF
3. CUANDO se muestra el logo ENTONCES el sistema DEBERÁ usar el archivo OncoDerma-Logo.png ubicado en /img
4. CUANDO se muestra cualquier texto ENTONCES el sistema DEBERÁ presentarlo en español con lenguaje simple y comprensible
5. CUANDO se muestra el resultado del análisis ENTONCES el sistema DEBERÁ usar una barra circular (progress bar) con el porcentaje en el centro

### Requisito 5 - Rendimiento y Compatibilidad

**Historia de Usuario:** Como usuario, quiero que la aplicación cargue rápidamente y funcione en diferentes navegadores y dispositivos, para tener una experiencia fluida.

#### Criterios de Aceptación

1. CUANDO el usuario carga cualquier página ENTONCES el sistema DEBERÁ completar la carga en menos de 3 segundos
2. CUANDO se procesa una imagen ENTONCES el sistema DEBERÁ entregar el resultado en tiempo razonable
3. CUANDO el usuario accede desde navegadores modernos (Chrome, Firefox, Edge, Safari) ENTONCES el sistema DEBERÁ funcionar correctamente
4. CUANDO el usuario accede desde dispositivos iOS o Android ENTONCES el sistema DEBERÁ ser completamente funcional

### Requisito 6 - Seguridad y Privacidad

**Historia de Usuario:** Como usuario preocupado por la privacidad, quiero que mis imágenes médicas sean procesadas de forma segura sin almacenamiento permanente, para proteger mi información sensible.

#### Criterios de Aceptación

1. CUANDO se establece comunicación con el servidor ENTONCES el sistema DEBERÁ usar protocolo HTTPS
2. CUANDO se procesa una imagen ENTONCES el sistema DEBERÁ procesarla temporalmente sin almacenamiento permanente
3. CUANDO se completa el análisis ENTONCES el sistema DEBERÁ eliminar la imagen del servidor
4. CUANDO se muestra cualquier resultado ENTONCES el sistema DEBERÁ incluir disclaimers sobre que no reemplaza el diagnóstico médico

### Requisito 7 - Información de Contacto y Soporte

**Historia de Usuario:** Como usuario que necesita soporte o más información, quiero poder contactar fácilmente al equipo de OncoDerma, para resolver dudas o obtener asistencia.

#### Criterios de Aceptación

1. CUANDO el usuario accede a la sección de contacto ENTONCES el sistema DEBERÁ mostrar el número de WhatsApp 8888888
2. CUANDO el usuario hace clic en el contacto de WhatsApp ENTONCES el sistema DEBERÁ abrir la aplicación de WhatsApp o web.whatsapp.com
3. CUANDO se muestra información de contacto ENTONCES el sistema DEBERÁ incluir información legal y disclaimers apropiados