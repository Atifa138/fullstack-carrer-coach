/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: {
          DEFAULT: '#141228',
          soft: '#3d3a5c',
          muted: '#6b6880',
          light: '#9896a8',
        },
        violet: {
          DEFAULT: '#6c47ff',
          soft: '#8b6dff',
          muted: '#a992ff',
          subtle: '#ede8ff',
          faint: '#f4f1ff',
        },
        pink: {
          DEFAULT: '#f72585',
          soft: '#ff5aa5',
          faint: '#fff0f7',
        },
        cyan: {
          DEFAULT: '#4cc9f0',
          soft: '#74d7f5',
          faint: '#f0fbff',
        },
        emerald: {
          DEFAULT: '#2eca7f',
          soft: '#54d896',
          faint: '#f0fdf6',
        },
        amber: {
          DEFAULT: '#ff9f1c',
          soft: '#ffb84d',
          faint: '#fff8ed',
        },
        coral: {
          DEFAULT: '#ff6b5e',
          soft: '#ff8a7f',
          faint: '#fff1f0',
        },
        sand: {
          DEFAULT: '#f6f4ef',
          dark: '#ede9e0',
        },
        success: {
          DEFAULT: '#16a34a',
          light: '#22c55e',
          faint: '#f0fdf4',
        },
        dark: {
          DEFAULT: '#0d0b1e',
          soft: '#16132f',
          card: '#1e1a3a',
          border: 'rgba(255,255,255,0.07)',
        },
      },
      boxShadow: {
        card: '0 1px 3px rgba(20,18,40,0.06), 0 4px 16px rgba(20,18,40,0.04)',
        'card-hover': '0 4px 12px rgba(20,18,40,0.1), 0 20px 40px rgba(20,18,40,0.07)',
        violet: '0 4px 20px rgba(108,71,255,0.35)',
        'violet-lg': '0 8px 32px rgba(108,71,255,0.45)',
        pink: '0 4px 20px rgba(247,37,133,0.35)',
        cyan: '0 4px 20px rgba(76,201,240,0.35)',
        emerald: '0 4px 20px rgba(46,202,127,0.35)',
        amber: '0 4px 20px rgba(255,159,28,0.35)',
        glow: '0 0 30px rgba(108,71,255,0.25), 0 0 60px rgba(247,37,133,0.15)',
      },
    },
  },
  plugins: [],
}
