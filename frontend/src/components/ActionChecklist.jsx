import React from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';

export default function ActionChecklist({ checklist, score }) {
  if (!checklist || checklist.length === 0) return null;

  const isSafe = score >= 85;

  return (
    <div className="tl-card" style={{ marginTop: '1.5rem', padding: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
        {isSafe ? (
          <CheckCircle size={18} color="#059669" />
        ) : (
          <AlertTriangle size={18} color="#D97706" />
        )}
        <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--text-main)' }}>
          Before You Click "I Agree" Checklist
        </h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {checklist.map((item, index) => (
          <div
            key={index}
            style={{
              fontSize: '0.8125rem',
              color: 'var(--text-muted)',
              lineHeight: 1.5,
              fontWeight: 500,
              padding: '0.4rem 0.6rem',
              borderRadius: '0.375rem',
              backgroundColor: 'var(--bg-subtle)'
            }}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
