import React from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';

export default function PillarMeter({ pillars, onOpenOptOut, hasOptOutTemplates }) {
  const getPillarColor = (risk) => {
    switch (risk) {
      case 'CRITICAL': return '#DC2626';
      case 'HIGH': return '#DC2626';
      case 'MODERATE': return '#D97706';
      default: return '#059669';
    }
  };

  const totalFlags = pillars.reduce((sum, p) => sum + p.flagCount, 0);

  return (
    <div className="tl-card" style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      <div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.25rem'
        }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>
            3-Pillar Compliance Breakdown
          </h3>
          <span className="font-mono" style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: totalFlags > 0 ? '#DC2626' : '#059669',
            backgroundColor: totalFlags > 0 ? 'rgba(220, 38, 38, 0.08)' : 'rgba(5, 150, 105, 0.08)',
            padding: '0.2rem 0.5rem',
            borderRadius: '0.375rem',
            border: `1px solid ${totalFlags > 0 ? 'rgba(220, 38, 38, 0.2)' : 'rgba(5, 150, 105, 0.2)'}`
          }}>
            {totalFlags > 0 ? `${totalFlags} Traps Detected` : 'All Pillars Clean'}
          </span>
        </div>

        {/* The 3 Pillars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          {pillars.map((pillar) => {
            const color = getPillarColor(pillar.riskLevel);
            const icon = pillar.category === 'WALLET' ? '💳' : pillar.category === 'PRIVACY' ? '🔒' : '⚖️';

            return (
              <div key={pillar.category}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  marginBottom: '0.375rem'
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span>{icon}</span>
                    <strong style={{ color: 'var(--text-main)' }}>{pillar.name}</strong>
                    <span style={{ color: 'var(--text-soft)', fontWeight: 500, fontSize: '0.75rem' }}>
                      ({pillar.flagCount} flags)
                    </span>
                  </span>

                  <span className="font-mono" style={{ color, fontWeight: 800 }}>
                    {pillar.riskLevel} ({pillar.score}%)
                  </span>
                </div>

                {/* Meter Bar */}
                <div style={{
                  width: '100%',
                  height: '0.5rem',
                  borderRadius: '9999px',
                  backgroundColor: 'var(--bg-subtle)',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${pillar.score}%`,
                    height: '100%',
                    backgroundColor: color,
                    borderRadius: '9999px',
                    transition: 'width 0.8s ease'
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Footer */}
      <div style={{
        marginTop: '1.25rem',
        paddingTop: '0.875rem',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.75rem'
      }}>
        <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>
          {hasOptOutTemplates ? 'Need to preserve your court rights?' : 'Compliance recommendations:'}
        </span>

        {hasOptOutTemplates ? (
          <button
            onClick={onOpenOptOut}
            className="tl-btn-primary"
            style={{ padding: '0.45rem 0.85rem', fontSize: '0.75rem' }}
          >
            <Mail size={14} />
            <span>Generate Opt-Out Email</span>
          </button>
        ) : (
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#059669', fontWeight: 700 }}>
            <CheckCircle2 size={14} />
            <span>Standard Fair Terms</span>
          </span>
        )}
      </div>
    </div>
  );
}
