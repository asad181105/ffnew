/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'gta': ['Black Mango', 'sans-serif'],
      },
      colors: {
        primary: {
          black: '#000000',
          yellow: '#fbbd31',
          white: '#FFFFFF',
        },
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #fbbd31, 0 0 10px #fbbd31, 0 0 15px #fbbd31' },
          '100%': { boxShadow: '0 0 10px #fbbd31, 0 0 20px #fbbd31, 0 0 30px #fbbd31' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
}
