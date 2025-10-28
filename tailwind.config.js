/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brandBlue: '#004aad',
        brandOrange: '#ff6b35',
      },
      boxShadow: {
        soft: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)'
      },
      fontFamily: {
        inter: ['Inter', 'system-ui', 'Arial', 'sans-serif'],
        poppins: ['Poppins', 'system-ui', 'Arial', 'sans-serif']
      }
    },
  },
  plugins: [],
}
