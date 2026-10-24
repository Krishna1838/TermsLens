import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import SamplePills from './components/SamplePills';
import ScannerBox from './components/ScannerBox';
import FairnessSeal from './components/FairnessSeal';
import PillarMeter from './components/PillarMeter';
import RedFlagCard from './components/RedFlagCard';
import ActionChecklist from './components/ActionChecklist';
import OptOutModal from './components/OptOutModal';
import { analyzePolicy, fetchPresets, localPresets } from './services/api';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [presets, setPresets] = useState(localPresets);
  const [selectedPresetId, setSelectedPresetId] = useState('streaming');
  const [inputText, setInputText] = useState(localPresets[0].content);
  const [inputUrl, setInputUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState(null);
  const [auditResult, setAuditResult] = useState(null);
  const [isOptOutOpen, setIsOptOutOpen] = useState(false);

  // Load presets & run default scan on mount
  useEffect(() => {
    async function loadInitial() {
      const serverPresets = await fetchPresets();
      if (serverPresets && serverPresets.length > 0) {
        setPresets(serverPresets);
      }
      // Run initial audit on default streaming sample
      triggerScan(localPresets[0].content, '');
    }
    loadInitial();
  }, []);

  const handleToggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      if (next) {
        document.body.classList.add('theme-dark');
      } else {
        document.body.classList.remove('theme-dark');
      }
      return next;
    });
  };

  const handleSelectPreset = (preset) => {
    setSelectedPresetId(preset.id);
    setInputText(preset.content);
    setScanError(null);
    triggerScan(preset.content, '', preset.id);
  };

  const triggerScan = async (textToScan, urlToScan, presetId) => {
    setIsScanning(true);
    setScanError(null);
    try {
      const result = await analyzePolicy({
        text: textToScan,
        url: urlToScan,
        presetId
      });
      setAuditResult(result);
    } catch (err) {
      console.error('Scan error:', err);
      setScanError(err.message || 'Failed to scan terms. Please verify the URL or try Direct Paste.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleManualScan = (activeTab) => {
    if (activeTab === 'url') {
      triggerScan('', inputUrl);
    } else {
      triggerScan(inputText, '');
    }
  };

  return (
    <div>
      <Header isDark={isDark} onToggleTheme={handleToggleTheme} />

      <main className="app-container">
        <Hero />

        <SamplePills
          presets={presets}
          onSelectPreset={handleSelectPreset}
          selectedPresetId={selectedPresetId}
        />

        <ScannerBox
          text={inputText}
          setText={(val) => {
            setInputText(val);
            setSelectedPresetId(null);
          }}
          url={inputUrl}
          setUrl={setInputUrl}
          onScan={handleManualScan}
          isScanning={isScanning}
        />

        {/* Scan Error Notice */}
        {scanError && (
          <div style={{
            marginTop: '-1.5rem',
            marginBottom: '2rem',
            padding: '1rem 1.25rem',
            borderRadius: '0.75rem',
            backgroundColor: 'var(--danger-bg)',
            border: '1px solid var(--danger-border)',
            color: 'var(--danger-text)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '0.875rem',
            fontWeight: 600
          }}>
            <span>⚠️ {scanError}</span>
          </div>
        )}

        {/* Audit Results View */}
        {auditResult && (
          <div style={{ marginTop: '2rem' }}>
            {/* Top Scorecard Row: Fairness Seal (1 col) + 3-Pillar Breakdown (2 cols) */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.25rem',
              marginBottom: '2rem'
            }}>
              <FairnessSeal
                score={auditResult.score}
                grade={auditResult.grade}
                riskLevel={auditResult.riskLevel}
                readingTimeSavedMins={auditResult.readingTimeSavedMins}
                scope={auditResult.scope}
              />

              <div style={{ gridColumn: 'span 1' }}>
                <PillarMeter
                  pillars={auditResult.pillars || []}
                  onOpenOptOut={() => setIsOptOutOpen(true)}
                  hasOptOutTemplates={auditResult.optOutTemplates && auditResult.optOutTemplates.length > 0}
                />
              </div>
            </div>

            {/* Red Flag Clauses Section */}
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem'
              }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 900, color: 'var(--text-main)' }}>
                  Detected Red Flags &amp; Dark Patterns ({auditResult.redFlags?.length || 0})
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-soft)', fontWeight: 600 }}>
                  Side-by-side Legalese vs. Plain English
                </span>
              </div>

              {auditResult.redFlags && auditResult.redFlags.length > 0 ? (
                auditResult.redFlags.map((flag) => (
                  <RedFlagCard key={flag.id} flag={flag} />
                ))
              ) : (
                <div className="tl-card" style={{ textAlign: 'center', padding: '2rem' }}>
                  <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>🎉</div>
                  <h4 style={{ fontWeight: 800, color: '#059669', marginBottom: '0.25rem' }}>
                    Zero Predatory Traps Found!
                  </h4>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                    This agreement appears fair and complies with consumer protection standards.
                  </p>
                </div>
              )}
            </div>

            {/* Checklist */}
            <ActionChecklist
              checklist={auditResult.actionChecklist}
              score={auditResult.score}
            />
          </div>
        )}
      </main>

      {/* Opt-Out Email Generator Modal */}
      {isOptOutOpen && (
        <OptOutModal
          templates={auditResult?.optOutTemplates || []}
          onClose={() => setIsOptOutOpen(false)}
        />
      )}
    </div>
  );
}
