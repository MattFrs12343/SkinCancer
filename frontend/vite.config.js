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
          // Optimización avanzada de chunks
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor'
            }
            if (id.includes('react-router')) {
              return 'router'
            }
            return 'vendor'
          }
          // Separar componentes grandes
          if (id.includes('/pages/')) {
            return 'pages'
          }
          if (id.includes('/components/')) {
            return 'components'
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
  // Configuración de CSS
  css: {
    devSourcemap: false,
  },
})