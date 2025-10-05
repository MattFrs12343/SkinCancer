#!/bin/bash

# Script de setup inicial para OncoDerma
set -e

echo "🔧 Configurando entorno de desarrollo para OncoDerma..."

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

# Verificar Node.js
if ! command -v node &> /dev/null; then
    warn "Node.js no está instalado. Por favor instala Node.js 18+ desde https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    warn "Node.js versión 18+ requerida. Versión actual: $(node --version)"
    exit 1
fi

log "✅ Node.js $(node --version) detectado"

# Verificar Python
if ! command -v python3 &> /dev/null; then
    warn "Python 3 no está instalado. Por favor instala Python 3.11+ desde https://python.org/"
    exit 1
fi

PYTHON_VERSION=$(python3 --version | cut -d' ' -f2 | cut -d'.' -f1-2)
log "✅ Python $PYTHON_VERSION detectado"

# Setup Frontend
log "Configurando frontend..."
cd frontend

if [ ! -f "package.json" ]; then
    warn "package.json no encontrado en frontend/"
    exit 1
fi

log "Instalando dependencias del frontend..."
npm install

log "Verificando build del frontend..."
npm run build

cd ..

# Setup Backend
log "Configurando backend..."
cd backend

if [ ! -f "requirements.txt" ]; then
    warn "requirements.txt no encontrado en backend/"
    exit 1
fi

# Crear virtual environment si no existe
if [ ! -d "venv" ]; then
    log "Creando virtual environment..."
    python3 -m venv venv
fi

log "Activando virtual environment..."
source venv/bin/activate

log "Instalando dependencias del backend..."
pip install --upgrade pip
pip install -r requirements.txt

cd ..

# Crear directorios necesarios
log "Creando directorios necesarios..."
mkdir -p tmp/oncoderma_uploads
mkdir -p logs

# Copiar archivos de configuración si no existen
if [ ! -f ".env" ]; then
    log "Creando archivo .env desde .env.example..."
    cp .env.example .env
fi

if [ ! -f "frontend/.env.development" ]; then
    log "Creando frontend/.env.development..."
    cat > frontend/.env.development << EOF
VITE_API_BASE_URL=http://localhost:8000
VITE_ENVIRONMENT=development
VITE_APP_NAME=OncoDerma (Dev)
VITE_APP_VERSION=1.0.0-dev
VITE_ENABLE_DEBUG=true
EOF
fi

if [ ! -f "backend/.env.development" ]; then
    log "Creando backend/.env.development..."
    cat > backend/.env.development << EOF
DEBUG=true
API_HOST=0.0.0.0
API_PORT=8000
CORS_ORIGINS=["http://localhost:3000","http://127.0.0.1:3000"]
SECRET_KEY=dev-secret-key
ALLOWED_HOSTS=["*"]
MAX_FILE_SIZE=10485760
UPLOAD_DIR=/tmp/oncoderma_uploads
EOF
fi

# Hacer scripts ejecutables
chmod +x scripts/*.sh

log "🎉 Setup completado!"
echo ""
log "Para ejecutar la aplicación:"
echo "1. Backend: cd backend && source venv/bin/activate && uvicorn app.main:app --reload"
echo "2. Frontend: cd frontend && npm run dev"
echo ""
log "URLs de desarrollo:"
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:8000"
echo "API Docs: http://localhost:8000/docs"
echo ""
log "Credenciales de prueba:"
echo "Usuario: admin"
echo "Contraseña: 1234"