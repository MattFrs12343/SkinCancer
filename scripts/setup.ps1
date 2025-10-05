# Script de setup para Windows PowerShell
param(
    [switch]$SkipInstall
)

Write-Host "🔧 Configurando OncoDerma en Windows..." -ForegroundColor Green

# Función para logging con colores
function Write-Log {
    param($Message, $Color = "Green")
    Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] $Message" -ForegroundColor $Color
}

function Write-Warning {
    param($Message)
    Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] WARNING: $Message" -ForegroundColor Yellow
}

function Write-Error {
    param($Message)
    Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] ERROR: $Message" -ForegroundColor Red
    exit 1
}

# Verificar Node.js
try {
    $nodeVersion = node --version
    Write-Log "✅ Node.js $nodeVersion detectado"
} catch {
    Write-Error "Node.js no está instalado. Descárgalo desde https://nodejs.org/"
}

# Verificar npm
try {
    $npmVersion = npm --version
    Write-Log "✅ npm $npmVersion detectado"
} catch {
    Write-Error "npm no está disponible. Reinstala Node.js desde https://nodejs.org/"
}

# Verificar Python
try {
    $pythonVersion = python --version
    Write-Log "✅ Python $pythonVersion detectado"
} catch {
    Write-Error "Python no está instalado. Descárgalo desde https://python.org/"
}

# Verificar pip
try {
    $pipVersion = pip --version
    Write-Log "✅ pip detectado"
} catch {
    Write-Error "pip no está disponible. Reinstala Python desde https://python.org/"
}

if (-not $SkipInstall) {
    # Setup Frontend
    Write-Log "Configurando frontend..."
    Set-Location frontend
    
    if (-not (Test-Path "package.json")) {
        Write-Error "package.json no encontrado en frontend/"
    }
    
    Write-Log "Instalando dependencias del frontend..."
    npm install
    
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Error instalando dependencias del frontend"
    }
    
    Write-Log "Verificando build del frontend..."
    npm run build
    
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Error en build del frontend"
    }
    
    Set-Location ..
    
    # Setup Backend
    Write-Log "Configurando backend..."
    Set-Location backend
    
    if (-not (Test-Path "requirements.txt")) {
        Write-Error "requirements.txt no encontrado en backend/"
    }
    
    Write-Log "Actualizando pip..."
    python -m pip install --upgrade pip
    
    Write-Log "Instalando dependencias del backend..."
    pip install -r requirements.txt
    
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Error instalando dependencias del backend"
    }
    
    Set-Location ..
}

# Crear directorios necesarios
Write-Log "Creando directorios necesarios..."
if (-not (Test-Path "tmp")) {
    New-Item -ItemType Directory -Path "tmp" -Force | Out-Null
}
if (-not (Test-Path "tmp/oncoderma_uploads")) {
    New-Item -ItemType Directory -Path "tmp/oncoderma_uploads" -Force | Out-Null
}
if (-not (Test-Path "logs")) {
    New-Item -ItemType Directory -Path "logs" -Force | Out-Null
}

# Crear archivos de configuración si no existen
if (-not (Test-Path ".env")) {
    Write-Log "Creando archivo .env desde .env.example..."
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
    }
}

Write-Log "🎉 Setup completado!" -Color Green
Write-Host ""
Write-Log "Para ejecutar la aplicación:" -Color Cyan
Write-Host "1. Backend (Terminal 1):"
Write-Host "   cd backend"
Write-Host "   python -m uvicorn app.main:app --reload"
Write-Host ""
Write-Host "2. Frontend (Terminal 2):"
Write-Host "   cd frontend"
Write-Host "   npm run dev"
Write-Host ""
Write-Log "URLs de desarrollo:" -Color Cyan
Write-Host "Frontend: http://localhost:3000"
Write-Host "Backend API: http://localhost:8000"
Write-Host "API Docs: http://localhost:8000/docs"
Write-Host ""
Write-Log "Credenciales de prueba:" -Color Cyan
Write-Host "Usuario: admin"
Write-Host "Contraseña: 1234"