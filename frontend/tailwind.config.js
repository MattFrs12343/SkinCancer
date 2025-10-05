/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0F172A',      // Azul muy oscuro
        secondary: '#1E3A8A',    // Azul médico
        accent: '#06B6D4',       // Cian claro
        background: '#E2E8F0',   // Gris claro
        white: '#FFFFFF',        // Blanco puro
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}