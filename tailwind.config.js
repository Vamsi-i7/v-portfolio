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
        'accent-primary':   'var(--accent-primary)',
        'accent-primary-dark': 'var(--accent-primary-dark)',
        'accent-glow':      'var(--accent-glow)',
      },

      // ─── Typography (PRD §5.3) ─────────────────────────────────────────────
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
        body:    ['Inter', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        // Display
        'display':      ['clamp(3rem, 12vw, 7rem)', { lineHeight: '1', fontWeight: '800', letterSpacing: '-0.04em' }],
        // Hero headline
        'hero':         ['clamp(2rem, 8vw, 3.5rem)', { lineHeight: '1.05', fontWeight: '800', letterSpacing: '-0.03em' }],
        // Section headings
        'section':      ['clamp(2.5rem, 5vw, 3.5rem)', { lineHeight: '1.1', fontWeight: '700', letterSpacing: '-0.025em' }],
        // H2
        'h2':           ['clamp(1.5rem, 3vw, 2rem)', { lineHeight: '1.2', fontWeight: '600', letterSpacing: '-0.015em' }],
        // Card titles
        'card-title':   ['1.25rem', { lineHeight: '1.3', fontWeight: '600' }],
        // Body copy
        'body':         ['1rem', { lineHeight: '1.65', fontWeight: '400' }],
        // Small labels, tags, metadata
        'small':        ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
        // Caption
        'caption':      ['0.75rem', { lineHeight: '1.5', fontWeight: '500', letterSpacing: '0.02em' }],
        // Monospace stats, code
        'mono':         ['0.875rem', { lineHeight: '1.5', fontWeight: '500' }],
      },
      lineHeight: {
        tight: '1.1',
        body:  '1.65',
      },
      letterSpacing: {
        tightest: '-0.04em',
        tight: '-0.03em',
        wide:  '0.08em',
      },

      // ─── Spacing (8-point grid, PRD §5.4) ─────────────────────────────────
      spacing: {
        '1':  '4px',
        '2':  '8px',
        '3':  '12px',
        '4':  '16px',
        '5':  '24px',
        '6':  '32px',
        '7':  '48px',
        '8':  '64px',
        '9':  '96px',
        '10': '128px',
        '11': '160px',
      },

      // ─── Border Radius (PRD §5.6) ──────────────────────────────────────────
      borderRadius: {
        'sm':   '4px',
        'md':   '8px',
        'lg':   '16px',
        'full': '9999px',
        // shadcn/ui uses --radius CSS variable; we keep that working too
        DEFAULT: 'var(--radius)',
      },

      // ─── Max Width ─────────────────────────────────────────────────────────
      maxWidth: {
        content:  '1120px',
        hero:     '800px',
        subcopy:  '500px',
      },

      // ─── Box Shadows (PRD §5.6) ────────────────────────────────────────────
      boxShadow: {
        'card':     '0 1px 2px rgba(0,0,0,0.5), 0 4px 16px rgba(0,0,0,0.3)',
        'card-hover': '0 1px 2px rgba(0,0,0,0.5), 0 8px 32px rgba(0,0,0,0.4)',
        'glow-amber': '0 0 0 1px rgba(255,149,0,0.3), 0 4px 24px rgba(255,149,0,0.15)',
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
