#!/bin/bash

# Script de verificación de seguridad para OncoDerma
# Verifica configuraciones de seguridad antes del deployment

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
    echo -e "${BLUE}[SECURITY CHECK]${NC} $1"
}

error() {
    echo -e "${RED}[SECURITY ERROR]${NC} $1"
}

success() {
    echo -e "${GREEN}[SECURITY OK]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[SECURITY WARNING]${NC} $1"
}

ISSUES_FOUND=0

# Función para reportar problema
report_issue() {
    error "$1"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
}

log "Iniciando verificación de seguridad..."

# Verificar configuración del frontend
check_frontend_security() {
    log "Verificando seguridad del frontend..."
    
    cd frontend
    
    # Verificar variables de entorno
    if [ -f ".env.production" ]; then
        # Verificar que no hay secrets en .env.production
        if grep -q "password\|secret\|key" .env.production; then
            warning "Posibles secrets encontrados en .env.production"
        fi
        success "Archivo .env.production encontrado"
    else
        report_issue "Archivo .env.production no encontrado"
    fi
    
    # Verificar configuración de Vite
    if [ -f "vite.config.js" ]; then
        # Verificar que sourcemaps están desactivados en producción
        if grep -q "sourcemap.*false" vite.config.js; then
            success "Sourcemaps desactivados en producción"
        else
            warning "Sourcemaps podrían estar habilitados en producción"
        fi
    fi
    
    # Verificar headers de seguridad en configuración de deployment
    if [ -f "vercel.json" ]; then
        if grep -q "X-Content-Type-Options\|X-Frame-Options\|X-XSS-Protection" vercel.json; then
            success "Headers de seguridad configurados en Vercel"
        else
            report_issue "Headers de seguridad faltantes en vercel.json"
        fi
    fi
    
    if [ -f "netlify.toml" ]; then
        if grep -q "X-Content-Type-Options\|X-Frame-Options\|X-XSS-Protection" netlify.toml; then
            success "Headers de seguridad configurados en Netlify"
        else
            report_issue "Headers de seguridad faltantes en netlify.toml"
        fi
    fi
    
    cd ..
}

# Verificar configuración del backend
check_backend_security() {
    log "Verificando seguridad del backend..."
    
    cd backend
    
    # Verificar variables de entorno
    if [ -f ".env.production" ]; then
        # Verificar que SECRET_KEY no es el valor por defecto
        if grep -q "your-production-secret-key-here-change-this" .env.production; then
            report_issue "SECRET_KEY usa valor por defecto en .env.production"
        else
            success "SECRET_KEY configurado en .env.production"
        fi
        
        # Verificar que DEBUG está desactivado
        if grep -q "DEBUG=false" .env.production; then
            success "DEBUG desactivado en producción"
        else
            report_issue "DEBUG no está desactivado en .env.production"
        fi
    else
        report_issue "Archivo .env.production no encontrado"
    fi
    
    # Verificar Dockerfile
    if [ -f "Dockerfile" ]; then
        # Verificar que no se ejecuta como root
        if grep -q "USER appuser" Dockerfile; then
            success "Dockerfile configurado para ejecutar como usuario no-root"
        else
            report_issue "Dockerfile ejecuta como root"
        fi
        
        # Verificar health check
        if grep -q "HEALTHCHECK" Dockerfile; then
            success "Health check configurado en Dockerfile"
        else
            warning "Health check no configurado en Dockerfile"
        fi
    fi
    
    # Verificar dependencias de seguridad
    if [ -f "requirements.txt" ]; then
        # Verificar que python-magic está incluido para validación de archivos
        if grep -q "python-magic" requirements.txt; then
            success "python-magic incluido para validación de archivos"
        else
            warning "python-magic no encontrado en requirements.txt"
        fi
    fi
    
    # Verificar configuración de seguridad en el código
    if [ -f "app/core/security.py" ]; then
        success "Módulo de seguridad encontrado"
        
        # Verificar que rate limiting está implementado
        if grep -q "rate_limit" app/core/security.py; then
            success "Rate limiting implementado"
        else
            warning "Rate limiting no encontrado"
        fi
    else
        report_issue "Módulo de seguridad no encontrado"
    fi
    
    cd ..
}

# Verificar archivos sensibles
check_sensitive_files() {
    log "Verificando archivos sensibles..."
    
    # Verificar .gitignore
    if [ -f ".gitignore" ]; then
        if grep -q "\.env" .gitignore && grep -q "\.log" .gitignore; then
            success ".gitignore configurado correctamente"
        else
            report_issue ".gitignore no protege archivos sensibles"
        fi
    else
        report_issue "Archivo .gitignore no encontrado"
    fi
    
    # Verificar que no hay archivos .env en el repositorio
    if find . -name ".env" -not -path "./node_modules/*" | grep -q ".env"; then
        report_issue "Archivos .env encontrados en el repositorio"
    else
        success "No se encontraron archivos .env en el repositorio"
    fi
    
    # Verificar que no hay logs en el repositorio
    if find . -name "*.log" -not -path "./node_modules/*" | grep -q ".log"; then
        warning "Archivos de log encontrados en el repositorio"
    else
        success "No se encontraron archivos de log en el repositorio"
    fi
}

# Verificar configuración HTTPS
check_https_config() {
    log "Verificando configuración HTTPS..."
    
    # Verificar configuración de CORS
    if grep -r "https://" backend/app/core/config.py 2>/dev/null; then
        success "URLs HTTPS configuradas en CORS"
    else
        warning "Verificar configuración HTTPS en CORS"
    fi
    
    # Verificar headers de seguridad
    if grep -r "Strict-Transport-Security" backend/ 2>/dev/null; then
        success "HSTS configurado"
    else
        warning "HSTS no configurado"
    fi
}

# Ejecutar todas las verificaciones
main() {
    check_frontend_security
    check_backend_security
    check_sensitive_files
    check_https_config
    
    log "Verificación de seguridad completada"
    
    if [ $ISSUES_FOUND -eq 0 ]; then
        success "✅ No se encontraron problemas críticos de seguridad"
        echo ""
        echo "La aplicación está lista para deployment desde el punto de vista de seguridad."
    else
        error "❌ Se encontraron $ISSUES_FOUND problemas de seguridad"
        echo ""
        echo "Por favor, corrige los problemas antes del deployment a producción."
        exit 1
    fi
}

# Ejecutar verificación
main