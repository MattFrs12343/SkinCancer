# Vercel Serverless Function para OncoDerma Backend
import sys
import os

# Agregar el directorio backend al path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

from backend.app.main import app

# Exportar la aplicación para Vercel
handler = app