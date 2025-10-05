/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // Colores usando variables CSS para soporte de temas
        primary: 'var(--primary)',
        secondary: 'var(--secondary)', 
        accent: 'var(--accent)',
        background: 'var(--background)',
        white: 'var(--white)',
        'gray-50': 'var(--gray-50)',
        'gray-600': 'var(--gray-600)',
        'red-600': 'var(--red-600)',
        'green-600': 'var(--green-600)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}