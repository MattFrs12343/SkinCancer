import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
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
    // Optimizaciones de build
    target: 'es2015',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar vendor chunks para mejor caching
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
        },
      },
    },
    // Configuración de assets
    assetsDir: 'assets',
    sourcemap: false, // Desactivar sourcemaps en producción
    chunkSizeWarningLimit: 1000,
  },
  // Optimizaciones adicionales
  esbuild: {
    drop: ['console', 'debugger'],
  },
  // Configuración de preview
  preview: {
    port: 4173,
    host: true,
  },
})