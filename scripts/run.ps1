# Script para ejecutar OncoDerma en Windows
param(
    [string]$Component = "both"  # "frontend", "backend", or "both"
)

Write-Host "🚀 Ejecutando OncoDerma..." -ForegroundColor Green

function Write-Log {
    param($Message, $Color = "Green")
    Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] $Message" -ForegroundColor $Color
}

function Start-Backend {
    Write-Log "Iniciando Backend en puerto 8000..." -Color Cyan
    Set-Location backend
    python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
}

function Start-Frontend {
    Write-Log "Iniciando Frontend en puerto 3000..." -Color Cyan
    Set-Location frontend
    npm run dev
}

function Start-Both {
    Write-Log "Iniciando ambos servicios..." -Color Cyan
    Write-Host ""
    Write-Host "INSTRUCCIONES:" -ForegroundColor Yellow
    Write-Host "1. Este script iniciará el BACKEND en esta ventana"
    Write-Host "2. Abre una NUEVA ventana de PowerShell"
    Write-Host "3. En la nueva ventana ejecuta: .\scripts\run.ps1 frontend"
    Write-Host ""
    Write-Host "Presiona ENTER para continuar con el backend..." -ForegroundColor Yellow
    Read-Host
    
    Start-Backend
}

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "frontend") -or -not (Test-Path "backend")) {
    Write-Host "ERROR: Ejecuta este script desde la raíz del proyecto OncoDerma" -ForegroundColor Red
    exit 1
}

switch ($Component.ToLower()) {
    "frontend" { Start-Frontend }
    "backend" { Start-Backend }
    "both" { Start-Both }
    default { 
        Write-Host "Uso: .\scripts\run.ps1 [frontend|backend|both]" -ForegroundColor Yellow
        Write-Host "Ejemplo: .\scripts\run.ps1 frontend"
        exit 1
    }
}