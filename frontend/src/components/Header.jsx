import React from 'react';
import { ShieldCheck, Moon, Sun, ExternalLink } from 'lucide-react';

export default function Header({ isDark, onToggleTheme }) {
  return (
    <header style={{
      borderBottom: '1px solid var(--border-color)',
      backgroundColor: 'var(--bg-card)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '0.875rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '2.25rem',
            height: '2.25rem',
            borderRadius: '0.625rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 900,
            fontSize: '1rem',
            color: '#FFFFFF',
            backgroundColor: '#0F172A',
            boxShadow: 'var(--shadow-sm)'
          }}>
            TL
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontWeight: 900, fontSize: '1.125rem', letterSpacing: '-0.02em' }}>TermsLens</span>
              <span className="font-mono" style={{
                fontSize: '0.6875rem',
                fontWeight: 700,
                padding: '0.15rem 0.5rem',
                borderRadius: '9999px',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                color: '#059669',
                border: '1px solid rgba(16, 185, 129, 0.25)'
              }}>
                Engine Active &bull; &lt;50ms
              </span>
            </div>
          </div>
        </div>

        {/* Right Actions: Theme Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={onToggleTheme}
            style={{
              padding: '0.45rem 0.75rem',
              borderRadius: '0.5rem',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-main)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.75rem',
              fontWeight: 700
            }}
            title="Toggle Light / Dark Mode"
          >
            {isDark ? <Sun size={14} /> : <Moon size={14} />}
            <span>{isDark ? 'Light' : 'Dark'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
