/** @type {import('tailwindcss').Config} */
export default {
  // Enable dark mode via class strategy (dark-only for V1 per PRD)
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // ─── Color Tokens (PRD §5.2) ───────────────────────────────────────────
      colors: {
        // shadcn/ui standard tokens
        background:         'var(--background)',
        foreground:         'var(--foreground)',
        card: {
          DEFAULT:          'var(--card)',
          foreground:       'var(--card-foreground)',
        },
        popover: {
          DEFAULT:          'var(--popover)',
          foreground:       'var(--popover-foreground)',
        },
        primary: {
          DEFAULT:          'var(--primary)',
          foreground:       'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT:          'var(--secondary)',
          foreground:       'var(--secondary-foreground)',
        },
        muted: {
          DEFAULT:          'var(--muted)',
          foreground:       'var(--muted-foreground)',
        },
        accent: {
          DEFAULT:          'var(--accent)',
          foreground:       'var(--accent-foreground)',
        },
        destructive: {
          DEFAULT:          'var(--destructive)',
          foreground:       'var(--destructive-foreground)',
        },
        border:             'var(--border)',
        input:              'var(--input)',
        ring:               'var(--ring)',

        // Custom design tokens
        'bg-base':          'var(--bg-base)',
        'bg-surface':       'var(--bg-surface)',
        'bg-elevated':      'var(--bg-elevated)',
        'bg-border':        'var(--bg-border)',
        'text-primary':     'var(--text-primary)',
        'text-secondary':   'var(--text-secondary)',
        'text-muted':       'var(--text-muted)',
        'accent-blue':      'var(--accent-blue)',
        'accent-blue-dark': 'var(--accent-blue-dark)',
        'accent-glow':      'var(--accent-glow)',
      },

      // ─── Typography (PRD §5.3) ─────────────────────────────────────────────
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
        body:    ['Inter', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'Fira Code', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        // Hero headline — clamp(48px, 7vw, 80px) handled inline for fluid sizing
        'hero':         ['clamp(3rem, 7vw, 5rem)', { lineHeight: '1.15', fontWeight: '800', letterSpacing: '-0.03em' }],
        // Section headings — clamp(32px, 5vw, 56px)
        'section':      ['clamp(2rem, 5vw, 3.5rem)', { lineHeight: '1.15', fontWeight: '700', letterSpacing: '-0.02em' }],
        // Card titles
        'card-title':   ['clamp(1.25rem, 2vw, 1.5rem)', { lineHeight: '1.35', fontWeight: '600' }],
        // Body copy
        'body':         ['clamp(1rem, 1.5vw, 1.125rem)', { lineHeight: '1.65', fontWeight: '400' }],
        // Small labels, tags, metadata
        'small':        ['0.875rem', { lineHeight: '1.5', fontWeight: '400', letterSpacing: '0.01em' }],
        // Monospace stats, code
        'mono':         ['0.875rem', { lineHeight: '1.6', fontWeight: '500' }],
      },
      lineHeight: {
        tight: '1.15',
        body:  '1.65',
      },
      letterSpacing: {
        tight: '-0.03em',
        wide:  '0.08em',
      },

      // ─── Spacing (8-point grid, PRD §5.4) ─────────────────────────────────
      spacing: {
        '1':  '4px',
        '2':  '8px',
        '3':  '16px',
        '4':  '24px',
        '5':  '32px',
        '6':  '48px',
        '7':  '64px',
        '8':  '96px',
        '9':  '128px',
        '10': '192px',
      },

      // ─── Border Radius (PRD §5.6) ──────────────────────────────────────────
      borderRadius: {
        'sm':   '6px',
        'md':   '12px',
        'lg':   '20px',
        'full': '9999px',
        // shadcn/ui uses --radius CSS variable; we keep that working too
        DEFAULT: 'var(--radius)',
      },

      // ─── Max Width ─────────────────────────────────────────────────────────
      maxWidth: {
        content:  '1200px',
        hero:     '900px',
        subcopy:  '560px',
      },

      // ─── Box Shadows (PRD §5.6) ────────────────────────────────────────────
      boxShadow: {
        'card':     '0 1px 2px rgba(0,0,0,0.5), 0 4px 16px rgba(0,0,0,0.3)',
        'card-hover': '0 1px 2px rgba(0,0,0,0.5), 0 8px 32px rgba(0,0,0,0.4)',
        'glow-blue': '0 0 0 1px rgba(59,130,246,0.3), 0 4px 24px rgba(59,130,246,0.15)',
      },

      // ─── Animation (PRD §5.5) ──────────────────────────────────────────────
      transitionTimingFunction: {
        'ease-out-custom': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      transitionDuration: {
        '200': '200ms',
        '300': '300ms',
        '500': '500ms',
        '600': '600ms',
      },
      keyframes: {
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%':      { opacity: '0.5', transform: 'scale(0.8)' },
        },
        'scroll-chevron': {
          '0%, 100%': { transform: 'translateY(0)', opacity: '1' },
          '50%':      { transform: 'translateY(6px)', opacity: '0.6' },
        },
      },
      animation: {
        'fade-up':        'fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
        'pulse-dot':      'pulse-dot 2s ease-in-out infinite',
        'scroll-chevron': 'scroll-chevron 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
