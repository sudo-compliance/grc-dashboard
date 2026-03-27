/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: ['class', '[class~="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Geist', 'system-ui', 'sans-serif'],
      },
      colors: {
        /* ── Core surfaces ── */
        base:     'var(--bg-base)',
        surface:  'var(--bg-surface)',
        elevated: 'var(--bg-elevated)',
        input:    'var(--bg-input)',

        /* ── Text ── */
        primary:   'var(--text-primary)',
        secondary: 'var(--text-secondary)',
        muted:     'var(--text-muted)',

        /* ── Coral accent ── */
        coral: {
          DEFAULT: 'var(--accent)',
          hover:   'var(--accent-hover)',
          dim:     'var(--accent-dim)',
          border:  'var(--accent-border)',
          light:   'var(--accent-light)',
        },

        /* ── Keep legacy 'accent' alias ── */
        accent: {
          DEFAULT: 'var(--accent)',
          dim:     'var(--accent-dim)',
          border:  'var(--accent-border)',
        },

        /* ── Semantic ── */
        ok:     { DEFAULT: 'var(--ok)',     dim: 'var(--ok-dim)' },
        warn:   { DEFAULT: 'var(--warn)',   dim: 'var(--warn-dim)' },
        danger: { DEFAULT: 'var(--danger)', dim: 'var(--danger-dim)' },
        info:   { DEFAULT: 'var(--info)',   dim: 'var(--info-dim)' },

        /* ── Framework ── */
        'iso-col':  'var(--iso-color)',
        'nist-col': 'var(--nist-color)',
        'pci-col':  'var(--pci-color)',
      },
      borderColor: {
        subtle:  'var(--border-subtle)',
        default: 'var(--border-default)',
        strong:  'var(--border-strong)',
        accent:  'var(--accent-border)',
      },
      borderRadius: {
        card: '16px',
        btn:  '8px',
      },
      boxShadow: {
        card:    'var(--card-shadow)',
        'card-md':'var(--card-shadow-md)',
        'card-lg':'var(--card-shadow-lg)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in':    'fadeIn 0.2s ease-out',
        'slide-in':   'slideIn 0.2s ease-out',
        'page-enter': 'pageEnter 0.18s ease-out',
      },
      keyframes: {
        fadeIn:    { '0%': { opacity: '0' },                                  '100%': { opacity: '1' } },
        slideIn:   { '0%': { opacity: '0', transform: 'translateY(8px)' },    '100%': { opacity: '1', transform: 'translateY(0)' } },
        pageEnter: { '0%': { opacity: '0', transform: 'translateY(8px)' },    '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}
