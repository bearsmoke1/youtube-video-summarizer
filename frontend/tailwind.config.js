/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        sans: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"Space Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        ink: '#151312',
        paper: '#F7F3E9',
        brut: {
          lime: '#C7F94F',
          coral: '#FF7A59',
          sky: '#79C7FF',
          pink: '#FF8FE0',
          yellow: '#FFD84D',
        },
      },
      boxShadow: {
        hard: '5px 5px 0 0 #151312',
        'hard-lg': '8px 8px 0 0 #151312',
        'hard-sm': '3px 3px 0 0 #151312',
      },
      keyframes: {
        shimmer: { '100%': { transform: 'translateX(300%)' } },
      },
      animation: {
        shimmer: 'shimmer 1.4s infinite',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
