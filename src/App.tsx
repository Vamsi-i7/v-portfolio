/**
 * V Portfolio — App Root
 *
 * This is the root component. At this stage (Wave 1 / Milestone 1.1.1) it
 * renders a minimal scaffold page to verify the design system is working.
 *
 * Future waves will replace this with:
 *  - React Router (Wave 2/3)
 *  - QueryClientProvider (Wave 1.2)
 *  - Auth context (Wave 1.3)
 *  - Public site routes (Wave 3)
 *  - Admin routes with auth guard (Wave 2)
 */
function App() {
  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-4)',
        padding: 'var(--space-6)',
      }}
    >
      {/* Scaffold verification block — will be removed in Wave 2 */}
      <div className="card-elevated" style={{ maxWidth: '480px', width: '100%' }}>
        <div className="section-label" style={{ marginBottom: 'var(--space-2)' }}>
          Wave 1 · Milestone 1.1.1
        </div>
        <h1
          style={{
            fontSize: 'var(--text-section)',
            fontWeight: 800,
            letterSpacing: 'var(--letter-spacing-tight)',
            marginBottom: 'var(--space-3)',
          }}
        >
          <span className="gradient-text">Design System</span>{' '}
          Ready
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-small)' }}>
          Vite + React + TypeScript scaffold is active. Design tokens, self-hosted
          fonts, and Tailwind are configured. Supabase setup is next (Phase 1.2).
        </p>

        {/* Token verification swatches */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 'var(--space-2)',
            marginTop: 'var(--space-4)',
          }}
        >
          {[
            { label: 'bg-base',    color: 'var(--bg-base)' },
            { label: 'bg-surface', color: 'var(--bg-surface)' },
            { label: 'accent',     color: 'var(--accent-blue)' },
            { label: 'border',     color: 'var(--bg-border)' },
          ].map(({ label, color }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '100%',
                  aspectRatio: '1',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: color,
                  border: '1px solid var(--bg-border)',
                  marginBottom: '4px',
                }}
              />
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Font verification */}
        <div
          style={{
            marginTop: 'var(--space-3)',
            padding: 'var(--space-3)',
            background: 'var(--bg-base)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--bg-border)',
          }}
        >
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, marginBottom: '4px' }}>
            Inter 800 — Display Font
          </p>
          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)', marginBottom: '4px' }}>
            Inter 400 — Body Font
          </p>
          <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-blue)' }}>
            JetBrains Mono — Code Font
          </p>
        </div>

        {/* Pulse dot demo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginTop: 'var(--space-3)' }}>
          <div className="pulse-dot" />
          <span style={{ fontSize: 'var(--text-small)', color: 'var(--text-secondary)' }}>
            Animation tokens active
          </span>
        </div>
      </div>
    </div>
  )
}

export default App
