import React from 'react';
import { ShieldAlert } from 'lucide-react';

export default function Hero() {
  return (
    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '0.25rem 0.75rem',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: 800,
        marginBottom: '0.75rem',
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        color: 'var(--text-muted)'
      }}>
        <span style={{ width: '0.5rem', height: '0.5rem', borderRadius: '9999px', backgroundColor: '#DC2626' }}></span>
        <span>Consumer Compliance &amp; Dark-Pattern Scanner</span>
      </div>

      <h1 style={{
        fontSize: '2.25rem',
        fontWeight: 900,
        letterSpacing: '-0.03em',
        lineHeight: 1.15,
        marginBottom: '0.75rem',
        color: 'var(--text-main)'
      }}>
        Audit the fine print <span style={{ color: '#DC2626' }}>before you click agree.</span>
      </h1>

      <p style={{
        fontSize: '0.9375rem',
        maxWidth: '560px',
        margin: '0 auto',
        color: 'var(--text-muted)',
        fontWeight: 500,
        lineHeight: 1.5
      }}>
        Paste checkout clauses or privacy policies below. TermsLens flags financial traps, privacy leaks, and legal waivers in &lt;50ms.
      </p>
    </div>
  );
}
