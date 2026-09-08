/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        heritage: {
          ivory: '#FAF7F0',
          sand: '#F4EBD9',
          terracotta: '#C85A32',
          'terracotta-dark': '#A33C17',
          'terracotta-light': '#E27B55',
          gold: '#D4AF37',
          'gold-light': '#F5E6A3',
          'gold-dark': '#9A7B1C',
          brown: '#4A2E18',
          'brown-dark': '#2B1708',
          'brown-light': '#6D4424',
          green: '#1F4E38',
          'green-light': '#2F7253',
          charcoal: '#1A1817',
          clay: '#B86F52',
          spice: '#E06D3B',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        display: ['"Cinzel"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        '3d-sm': '0 4px 6px -1px rgba(74, 46, 24, 0.08), 0 2px 4px -2px rgba(74, 46, 24, 0.06), 0 10px 15px -3px rgba(200, 90, 50, 0.05)',
        '3d': '0 10px 25px -5px rgba(74, 46, 24, 0.12), 0 8px 10px -6px rgba(74, 46, 24, 0.08), 0 20px 25px -5px rgba(200, 90, 50, 0.08)',
        '3d-lg': '0 20px 35px -10px rgba(74, 46, 24, 0.2), 0 10px 20px -5px rgba(212, 175, 55, 0.15)',
        'glow-gold': '0 0 25px rgba(212, 175, 55, 0.35)',
        'glow-terracotta': '0 0 25px rgba(200, 90, 50, 0.35)',
      },
      animation: {
        'scan-laser': 'laser 2.2s ease-in-out infinite alternate',
        'float-slow': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 3s infinite',
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
      },
      keyframes: {
        laser: {
          '0%': { top: '0%', opacity: '0.8' },
          '100%': { top: '96%', opacity: '0.95' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(1deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.03)' },
        },
      },
    },
  },
  plugins: [],
}
