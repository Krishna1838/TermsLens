import React from 'react';

export default function SamplePills({ presets, onSelectPreset, selectedPresetId }) {
  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      marginTop: '1.25rem',
      marginBottom: '1.5rem'
    }}>
      <span style={{
        fontSize: '0.75rem',
        fontWeight: 800,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        color: 'var(--text-soft)',
        marginRight: '0.25rem'
      }}>
        Try 1-Click Samples:
      </span>

      {presets.map((preset) => {
        const isSelected = selectedPresetId === preset.id;
        const isClean = preset.id === 'clean';
        return (
          <button
            key={preset.id}
            onClick={() => onSelectPreset(preset)}
            className="tl-pill"
            style={{
              borderColor: isSelected ? 'var(--text-main)' : 'var(--border-color)',
              backgroundColor: isSelected ? 'var(--bg-subtle)' : 'var(--bg-card)',
              color: isClean ? '#047857' : 'var(--text-main)',
              transform: isSelected ? 'scale(1.02)' : 'none'
            }}
          >
            {preset.title}
          </button>
        );
      })}
    </div>
  );
}
