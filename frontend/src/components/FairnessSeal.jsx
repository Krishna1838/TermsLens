import React from 'react';

export default function FairnessSeal({ score, grade, riskLevel, readingTimeSavedMins, scope }) {
  // Determine color based on grade
  let color = '#DC2626'; // Red
  let label = 'Predatory / High Risk';

  if (grade === 'A') {
    color = '#059669'; // Green
    label = 'Consumer-Friendly / Safe';
  } else if (grade === 'B') {
    color = '#10B981';
    label = 'Acceptable / Minor Risks';
  } else if (grade === 'C') {
    color = '#D97706'; // Amber
    label = 'Caution / Questionable Terms';
  } else if (grade === 'D') {
    color = '#EA580C'; // Orange
    label = 'High Risk / Traps Found';
  } else {
    color = '#DC2626'; // Red
    label = 'Critical Risk / Hostile Terms';
  }

  // Calculate circumference: r = 54, 2 * pi * 54 ~= 339.29
  const circumference = 339.29;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="tl-card" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: '0.5rem'
      }}>
        <span style={{
          fontSize: '0.6875rem',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          fontWeight: 800,
          color: 'var(--text-soft)'
        }}>
          Consumer Fairness Seal
        </span>

        <span className="font-mono" style={{
          fontSize: '0.625rem',
          fontWeight: 700,
          padding: '0.15rem 0.45rem',
          borderRadius: '0.25rem',
          backgroundColor: 'var(--bg-subtle)',
          color: 'var(--text-muted)'
        }}>
          {scope === 'EXCERPT_SCAN' ? 'Scope: Excerpt' : 'Scope: Full Policy'}
        </span>
      </div>

      {/* Circular Gauge Graphic */}
      <div style={{ position: 'relative', margin: '0.75rem 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="128" height="128" style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx="64"
            cy="64"
            r="54"
            stroke="var(--border-color)"
            strokeWidth="10"
            fill="transparent"
          />
          <circle
            cx="64"
            cy="64"
            r="54"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            fill="transparent"
            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
          />
        </svg>

        <div style={{
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <span style={{ fontSize: '2.5rem', fontWeight: 900, color, lineHeight: 1 }}>
            {grade}
          </span>
          <span className="font-mono" style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
            {score} / 100
          </span>
        </div>
      </div>

      {/* Solid High-Contrast Badge */}
      <span style={{
        fontSize: '0.75rem',
        padding: '0.25rem 0.75rem',
        borderRadius: '9999px',
        backgroundColor: color,
        color: '#FFFFFF',
        fontWeight: 800,
        boxShadow: 'var(--shadow-sm)',
        marginTop: '0.25rem'
      }}>
        {label}
      </span>

      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-soft)', marginTop: '0.6rem' }}>
        Saved ~{readingTimeSavedMins} mins of reading time
      </span>
    </div>
  );
}
