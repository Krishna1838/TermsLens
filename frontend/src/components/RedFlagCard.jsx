import React from 'react';

export default function RedFlagCard({ flag }) {
  const isCritical = flag.severity === 'CRITICAL';
  const badgeClass = isCritical ? 'badge-critical' : flag.severity === 'HIGH' ? 'badge-high' : 'badge-moderate';

  return (
    <div className="tl-card" style={{ marginBottom: '1rem', padding: '1.25rem' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.5rem',
        marginBottom: '0.85rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className={badgeClass}>
            {flag.severity}
          </span>
          <span style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--text-main)' }}>
            {flag.title}
          </span>
        </div>

        <span className="font-mono" style={{
          fontSize: '0.75rem',
          fontWeight: 700,
          padding: '0.2rem 0.65rem',
          borderRadius: '9999px',
          backgroundColor: 'var(--badge-tag)',
          color: 'var(--badge-tag-text)',
          border: '1px solid var(--border-color)'
        }}>
          {flag.darkPatternTag}
        </span>
      </div>

      {/* Contract Excerpt Callout (Document style, NO underlines) */}
      <div style={{
        borderRadius: '0.5rem',
        padding: '0.875rem 1rem',
        border: '1px solid var(--border-color)',
        borderLeft: '4px solid #DC2626',
        backgroundColor: 'var(--quote-bg)',
        color: 'var(--text-main)',
        fontSize: '0.8125rem',
        marginBottom: '0.85rem'
      }}>
        <div style={{
          fontSize: '0.625rem',
          textTransform: 'uppercase',
          fontWeight: 800,
          color: 'var(--text-soft)',
          marginBottom: '0.25rem',
          letterSpacing: '0.05em'
        }}>
          Exact Contract Excerpt
        </div>
        <span className="font-mono" style={{ fontWeight: 600, color: 'var(--text-main)', lineHeight: 1.5 }}>
          "{flag.originalQuote}"
        </span>
      </div>

      {/* Plain English "The Catch" & "Your Move" (Clean 2-column grid) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '0.75rem',
        fontSize: '0.8125rem',
        borderRadius: '0.5rem',
        padding: '0.875rem',
        backgroundColor: 'var(--bg-subtle)',
        border: '1px solid var(--border-color)'
      }}>
        <div>
          <span style={{ color: '#DC2626', fontWeight: 900, display: 'block', marginBottom: '0.25rem' }}>
            💬 The Catch (Plain English):
          </span>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.5, fontWeight: 500 }}>
            {flag.plainEnglish}
          </p>
        </div>

        <div>
          <span style={{ color: '#047857', fontWeight: 900, display: 'block', marginBottom: '0.25rem' }}>
            💡 Your Protective Move:
          </span>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.5, fontWeight: 500 }}>
            {flag.recommendation}
          </p>
        </div>
      </div>
    </div>
  );
}
