import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react()
  ],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  build: {
    // Optimizaciones de build mejoradas
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info'],
        passes: 2,
      },
      mangle: {
        safari10: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Optimización avanzada de chunks más granular
          if (id.includes('node_modules')) {
            // React core - chunk crítico
            if (id.includes('react/') || id.includes('react-dom/')) {
              return 'react-core'
            }
            // React Router - chunk de navegación
            if (id.includes('react-router')) {
              return 'react-router'
            }
            // Tailwind y CSS - chunk de estilos
            if (id.includes('tailwindcss') || id.includes('postcss')) {
              return 'styles-vendor'
            }
            // Otras librerías - chunk general
            return 'vendor'
          }
          
          // Separar por funcionalidad específica
          if (id.includes('/pages/')) {
            // Separar páginas grandes individualmente
            if (id.includes('Analizar')) return 'page-analizar'
            if (id.includes('Home')) return 'page-home'
            return 'pages-other'
          }
          
          // Componentes UI críticos vs no críticos
          if (id.includes('/components/ui/')) {
            if (id.includes('LoadingSpinner') || id.includes('Button')) {
              return 'ui-critical'
            }
            return 'ui-components'
          }
          
          // Utilidades y hooks
          if (id.includes('/utils/') || id.includes('/hooks/')) {
            return 'utils-hooks'
          }
        },
        // Optimizar nombres de archivos
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    // Configuración de assets optimizada
    assetsDir: 'assets',
    sourcemap: false,
    chunkSizeWarningLimit: 800,
    // Optimización de CSS
    cssCodeSplit: true,
    // Compresión mejorada
    reportCompressedSize: false,
  },
  // Optimizaciones adicionales
  esbuild: {
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
    legalComments: 'none',
  },
  // Optimización de dependencias
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    exclude: ['@vite/client', '@vite/env'],
  },
  // Configuración de preview
  preview: {
    port: 4173,
    host: true,
  },
  // Configuración de CSS optimizada
  css: {
    devSourcemap: false,
    postcss: {
      plugins: [
        // Optimización adicional de CSS
        require('autoprefixer'),
      ]
    }
  },
  
  // Configuración de caché para desarrollo
  cacheDir: 'node_modules/.vite',
  
  // Configuración experimental para mejor performance
  experimental: {
    renderBuiltUrl(filename, { hostType }) {
      if (hostType === 'js') {
        return { js: `/${filename}` }
      } else {
        return { relative: true }
      }
    }
  },
})