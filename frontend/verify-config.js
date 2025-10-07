/**
 * Script de verificación de configuración
 */

import { defineConfig } from 'vite'

console.log('✅ Vite config can be imported successfully')

// Verificar que las dependencias críticas estén disponibles
const criticalDeps = [
  'react',
  'react-dom', 
  'react-router-dom',
  'tailwindcss',
  'autoprefixer'
]

console.log('🔍 Checking critical dependencies...')

criticalDeps.forEach(dep => {
  try {
    const pkg = await import(`${dep}/package.json`, { assert: { type: 'json' } })
    console.log(`✅ ${dep}: ${pkg.default.version}`)
  } catch (error) {
    console.log(`❌ ${dep}: Not found or error`)
  }
})

console.log('🚀 Configuration verification complete')