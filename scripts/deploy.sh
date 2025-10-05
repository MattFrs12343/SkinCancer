#!/bin/bash

# Script de deployment para OncoDerma
set -e

echo "🚀 Iniciando deployment de OncoDerma..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para logging
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    exit 1
}

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ] && [ ! -f "frontend/package.json" ]; then
    error "No se encontró package.json. Ejecuta este script desde la raíz del proyecto."
fi

# Verificar argumentos
ENVIRONMENT=${1:-development}
PLATFORM=${2:-local}

log "Deployment para entorno: $ENVIRONMENT en plataforma: $PLATFORM"

# Limpiar builds anteriores
log "Limpiando builds anteriores..."
if [ -d "frontend/dist" ]; then
    rm -rf frontend/dist
fi

# Frontend deployment
case $PLATFORM in
    "vercel")
        log "Deploying frontend a Vercel..."
        cd frontend
        npm ci
        npm run build:prod
        npx vercel --prod
        cd ..
        ;;
    "netlify")
        log "Deploying frontend a Netlify..."
        cd frontend
        npm ci
        npm run build:prod
        npx netlify deploy --prod --dir=dist
        cd ..
        ;;
    "local")
        log "Build local del frontend..."
        cd frontend
        npm ci
        npm run build
        cd ..
        ;;
    *)
        warn "Plataforma desconocida: $PLATFORM. Haciendo build local."
        cd frontend
        npm ci
        npm run build
        cd ..
        ;;
esac

# Backend deployment
if [ "$PLATFORM" = "render" ]; then
    log "El backend se deployará automáticamente en Render via Git push"
elif [ "$PLATFORM" = "docker" ]; then
    log "Building Docker images..."
    
    # Build backend
    docker build -t oncoderma-backend ./backend
    
    # Build frontend
    docker build -t oncoderma-frontend ./frontend
    
    log "Docker images built successfully"
elif [ "$PLATFORM" = "local" ]; then
    log "Para ejecutar localmente:"
    echo "Backend: cd backend && uvicorn app.main:app --reload"
    echo "Frontend: cd frontend && npm run preview"
fi

# Verificar health checks si es deployment remoto
if [ "$PLATFORM" != "local" ] && [ "$PLATFORM" != "docker" ]; then
    log "Verificando health checks..."
    sleep 10
    
    # Verificar backend
    if curl -f -s https://oncoderma-api.onrender.com/health > /dev/null; then
        log "✅ Backend health check passed"
    else
        warn "❌ Backend health check failed"
    fi
    
    # Verificar frontend
    if curl -f -s https://oncoderma.vercel.app > /dev/null; then
        log "✅ Frontend health check passed"
    else
        warn "❌ Frontend health check failed"
    fi
fi

log "🎉 Deployment completado!"

# Mostrar URLs
case $PLATFORM in
    "vercel"|"netlify")
        echo ""
        log "URLs de la aplicación:"
        echo "Frontend: https://oncoderma.vercel.app"
        echo "Backend API: https://oncoderma-api.onrender.com"
        echo "API Docs: https://oncoderma-api.onrender.com/docs"
        ;;
    "local")
        echo ""
        log "URLs locales:"
        echo "Frontend: http://localhost:3000"
        echo "Backend API: http://localhost:8000"
        echo "API Docs: http://localhost:8000/docs"
        ;;
esac