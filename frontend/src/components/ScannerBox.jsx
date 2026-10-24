import React, { useState } from 'react';
import { Search, Globe, FileText, Loader2 } from 'lucide-react';

export default function ScannerBox({
  text,
  setText,
  url,
  setUrl,
  onScan,
  isScanning
}) {
  const [activeTab, setActiveTab] = useState('text'); // 'text' | 'url'

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;

  return (
    <div className="tl-card" style={{ marginBottom: '2.5rem' }}>
      {/* Console Header / Tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '0.75rem',
        marginBottom: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => setActiveTab('text')}
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: '0.5rem',
              fontSize: '0.75rem',
              fontWeight: 800,
              cursor: 'pointer',
              border: 'none',
              backgroundColor: activeTab === 'text' ? 'var(--accent-primary)' : 'transparent',
              color: activeTab === 'text' ? 'var(--accent-primary-text)' : 'var(--text-muted)'
            }}
          >
            Direct Paste
          </button>
          <button
            onClick={() => setActiveTab('url')}
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: '0.5rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: 'none',
              backgroundColor: activeTab === 'url' ? 'var(--accent-primary)' : 'transparent',
              color: activeTab === 'url' ? 'var(--accent-primary-text)' : 'var(--text-muted)'
            }}
          >
            Web URL
          </button>
        </div>

        {activeTab === 'text' && (
          <div className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-soft)', fontWeight: 600 }}>
            Words: {wordCount} &bull; Chars: {charCount}
          </div>
        )}
      </div>

      {/* Input area */}
      {activeTab === 'text' ? (
        <textarea
          rows={5}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste terms of service, privacy policy, or checkout fine-print here..."
          className="font-mono"
          style={{
            width: '100%',
            backgroundColor: 'var(--bg-input)',
            color: 'var(--text-main)',
            border: '1px solid var(--border-color)',
            borderRadius: '0.75rem',
            padding: '1rem',
            fontSize: '0.875rem',
            lineHeight: 1.6,
            resize: 'vertical',
            outline: 'none'
          }}
        />
      ) : (
        <div style={{ padding: '0.5rem 0' }}>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/terms"
            className="font-mono"
            style={{
              width: '100%',
              backgroundColor: 'var(--bg-input)',
              color: 'var(--text-main)',
              border: '1px solid var(--border-color)',
              borderRadius: '0.75rem',
              padding: '0.875rem 1rem',
              fontSize: '0.875rem',
              outline: 'none'
            }}
          />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-soft)', display: 'block', marginTop: '0.5rem' }}>
            TermsLens will fetch and extract the legal text automatically via Jsoup parser.
          </span>
        </div>
      )}

      {/* Action Footer */}
      <div style={{
        marginTop: '1rem',
        paddingTop: '0.875rem',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
          <span style={{ width: '0.5rem', height: '0.5rem', borderRadius: '9999px', backgroundColor: '#10B981' }}></span>
          <span>Deterministic Java Heuristics &bull; Zero Data Retention</span>
        </div>

        <button
          onClick={() => onScan(activeTab)}
          disabled={isScanning || (activeTab === 'text' && !text.trim()) || (activeTab === 'url' && !url.trim())}
          className="tl-btn-primary"
        >
          {isScanning ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Auditing Clauses...</span>
            </>
          ) : (
            <>
              <Search size={16} />
              <span>Run Legal Audit</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
