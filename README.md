# OncoDerma - Análisis de Piel con IA

OncoDerma es una aplicación web y móvil que utiliza inteligencia artificial para analizar imágenes de la piel y entregar un porcentaje estimado de probabilidad de cáncer. La aplicación no reemplaza el diagnóstico médico, sino que sirve como apoyo para pacientes y especialistas.

## 🚀 Características

- **Análisis con IA**: Procesamiento de imágenes de piel con modelo de inteligencia artificial
- **Interfaz Responsiva**: Diseño moderno que funciona en web y móvil
- **Seguridad**: Procesamiento temporal sin almacenamiento de imágenes
- **Fácil de Usar**: Interfaz intuitiva en español
- **Resultados Visuales**: Barra circular con porcentaje de probabilidad

## 🛠️ Stack Tecnológico

### Frontend
- **React.js** - Framework de interfaz de usuario
- **Vite** - Herramienta de build y desarrollo
- **Tailwind CSS** - Framework de estilos
- **React Router** - Navegación SPA

### Backend
- **FastAPI** - Framework web de Python
- **Python 3.11** - Lenguaje de programación
- **Pillow** - Procesamiento de imágenes
- **Uvicorn** - Servidor ASGI

## 📁 Estructura del Proyecto

```
oncoderma/
├── frontend/                 # Aplicación React
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   ├── pages/          # Páginas de la aplicación
│   │   ├── services/       # Servicios API
│   │   ├── hooks/          # Custom hooks
│   │   └── utils/          # Utilidades
│   └── package.json
├── backend/                 # API FastAPI
│   ├── app/
│   │   ├── api/           # Endpoints de la API
│   │   ├── core/          # Configuración
│   │   └── schemas/       # Modelos Pydantic
│   └── requirements.txt
├── img/                    # Imágenes y assets
└── docs/                   # Documentación
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- Python 3.11+
- npm o yarn

### Frontend

```bash
cd frontend
npm install
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

La API estará disponible en `http://localhost:8000`

## 🔐 Credenciales de Prueba

Para acceder a la aplicación, usa las siguientes credenciales:

- **Usuario**: `admin`
- **Contraseña**: `1234`

> ⚠️ **Nota**: Estas son credenciales de demostración únicamente.

## 🎨 Paleta de Colores

- **Primary**: `#0F172A` - Azul muy oscuro
- **Secondary**: `#1E3A8A` - Azul médico clásico  
- **Accent**: `#06B6D4` - Cian claro para acentos
- **Background**: `#E2E8F0` - Gris muy claro de fondo
- **White**: `#FFFFFF` - Blanco puro

## 📱 Uso de la Aplicación

1. **Login**: Ingresa con las credenciales de prueba
2. **Navegación**: Usa el menú para acceder a Home, Analizar, Contacto
3. **Análisis**: Sube una imagen de piel en la sección "Analizar"
4. **Resultados**: Visualiza el porcentaje de probabilidad en la barra circular
5. **Contacto**: Accede al soporte vía WhatsApp

## 🔒 Seguridad y Privacidad

- Las imágenes se procesan temporalmente y se eliminan inmediatamente
- Comunicación cifrada con HTTPS
- No se almacenan datos personales ni imágenes
- Validación estricta de tipos y tamaños de archivo

## ⚠️ Disclaimer Médico

**IMPORTANTE**: Esta aplicación es únicamente una herramienta de apoyo y NO reemplaza el diagnóstico médico profesional. Siempre consulta con un dermatólogo o especialista para evaluación y diagnóstico definitivo.

## 🤝 Contribución

Este es un proyecto de demostración. Para contribuir:

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es solo para fines educativos y de demostración.

## 📞 Contacto

- **WhatsApp**: 8888888
- **Soporte**: Disponible a través de la aplicación

---

**Desarrollado con ❤️ para mejorar la detección temprana de cáncer de piel**