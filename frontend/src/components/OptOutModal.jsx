import React, { useState } from 'react';
import { X, Copy, Check, ShieldAlert } from 'lucide-react';

export default function OptOutModal({ templates, onClose }) {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  if (!templates || templates.length === 0) return null;

  const current = templates[activeTab] || templates[0];

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '1rem',
          marginBottom: '1.25rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldAlert size={20} color="#DC2626" />
              <h2 style={{ fontSize: '1.125rem', fontWeight: 900, color: 'var(--text-main)' }}>
                Consumer Rights Countermeasure
              </h2>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Pre-filled statutory notice to preserve your court rights or halt data brokerage.
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-soft)',
              padding: '0.25rem'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab selector if multiple templates */}
        {templates.length > 1 && (
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            {templates.map((t, idx) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(idx)}
                className="tl-pill"
                style={{
                  backgroundColor: activeTab === idx ? 'var(--accent-primary)' : 'var(--bg-subtle)',
                  color: activeTab === idx ? 'var(--accent-primary-text)' : 'var(--text-main)',
                  borderColor: activeTab === idx ? 'var(--accent-primary)' : 'var(--border-color)'
                }}
              >
                {t.title}
              </button>
            ))}
          </div>
        )}

        {/* Subject line field */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-soft)', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>
            Email Subject Line
          </label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              readOnly
              value={current.subject}
              className="font-mono"
              style={{
                flex: 1,
                padding: '0.625rem 0.75rem',
                borderRadius: '0.5rem',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-main)',
                fontSize: '0.8125rem',
                outline: 'none'
              }}
            />
            <button
              onClick={() => handleCopy(current.subject, 'subj')}
              className="tl-pill"
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              {copiedIndex === 'subj' ? <Check size={14} color="#059669" /> : <Copy size={14} />}
              <span>{copiedIndex === 'subj' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Email Body */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-soft)', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>
            Formal Legal Body
          </label>
          <textarea
            rows={8}
            readOnly
            value={current.body}
            className="font-mono"
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-main)',
              fontSize: '0.8125rem',
              lineHeight: 1.5,
              outline: 'none',
              resize: 'none'
            }}
          />
        </div>

        {/* Instructions banner */}
        <div style={{
          padding: '0.75rem 1rem',
          borderRadius: '0.5rem',
          backgroundColor: 'rgba(220, 38, 38, 0.06)',
          border: '1px solid rgba(220, 38, 38, 0.2)',
          fontSize: '0.8125rem',
          color: 'var(--text-muted)',
          marginBottom: '1.25rem'
        }}>
          <strong style={{ color: '#DC2626' }}>Instruction: </strong>
          {current.instructions}
        </div>

        {/* Footer buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button onClick={onClose} className="tl-pill" style={{ padding: '0.625rem 1.25rem' }}>
            Close
          </button>
          <button
            onClick={() => handleCopy(current.subject + '\n\n' + current.body, 'all')}
            className="tl-btn-primary"
          >
            {copiedIndex === 'all' ? <Check size={16} /> : <Copy size={16} />}
            <span>{copiedIndex === 'all' ? 'Copied Full Email!' : 'Copy Entire Template'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
