/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: '#8B5CF6',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#D946EF',
          foreground: '#FFFFFF',
        },
        obsidian: {
          DEFAULT: '#05030A',
          surface: '#0D0818',
          card: '#120B24',
        },
        aurora: {
          primary: '#8B5CF6',
          secondary: '#D946EF',
          indigo: '#6366F1',
          cyan: '#06B6D4',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'aurora-glow': {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1) translate3d(0, 0, 0)' },
          '50%': { opacity: '0.8', transform: 'scale(1.1) translate3d(20px, -20px, 0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(139, 92, 246, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(217, 70, 239, 0.6)' },
        },
      },
      animation: {
        'aurora-glow': 'aurora-glow 10s ease-in-out infinite',
        float: 'float 5s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

