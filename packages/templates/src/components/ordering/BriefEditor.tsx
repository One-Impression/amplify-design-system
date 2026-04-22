import React from 'react';
import type { ComponentRenderer } from '../../registry';

export const BriefEditor: ComponentRenderer = ({ props }) => {
  const concepts = (props.concepts as string[]) || ['Problem \u2192 Solution', 'Trend Story', 'Tutorial', 'Review', 'Behind-the-Scenes', 'Unboxing', 'Demo', 'Day in Life'];
  const defaultSelected = (props.selectedConcepts as number[]) || [0, 1];
  const talkingPoints = (props.talkingPoints as string[]) || ['Lightweight, non-greasy formula', 'Visible results in 7 days'];
  const avoidItems = (props.avoidItems as string[]) || ["Don't compare to competitor brands"];
  const audiences = (props.audiences as string[]) || ['Women 25-35', 'Skincare enthusiasts', 'Instagram-active'];

  return (
    <div>
      <h2 style={{ fontSize: 'var(--amp-text-lg)', fontWeight: 600, color: 'var(--amp-text)', lineHeight: 1.3 }}>Content Brief</h2>
      <p style={{ fontSize: 'var(--amp-text-xs)', color: 'var(--amp-text-muted)', marginBottom: 'var(--amp-sp-4)' }}>Auto-configured based on your goal and product. Customize as needed.</p>

      {/* Script Concepts */}
      <div style={{ marginBottom: 'var(--amp-sp-5)' }}>
        <h3 style={{ fontSize: 'var(--amp-text-md)', fontWeight: 600, color: 'var(--amp-text)' }}>Script Concepts</h3>
        <p style={{ fontSize: 'var(--amp-text-xs)', color: 'var(--amp-stone-400)', margin: 'var(--amp-sp-1) 0 var(--amp-sp-2)' }}>
          Click to toggle {'\u2014'} we'll use these to generate your scripts
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--amp-sp-2)' }}>
          {concepts.map((c, i) => (
            <span key={i} className={`amp-chip${defaultSelected.includes(i) ? ' active' : ''}`}>{c}</span>
          ))}
        </div>
      </div>

      {/* Target Audience */}
      <div style={{ marginBottom: 'var(--amp-sp-5)' }}>
        <h3 style={{ fontSize: 'var(--amp-text-md)', fontWeight: 600, color: 'var(--amp-text)' }}>Target Audience</h3>
        <p style={{ fontSize: 'var(--amp-text-xs)', color: 'var(--amp-stone-400)', margin: 'var(--amp-sp-1) 0 var(--amp-sp-2)' }}>
          Auto-suggested from your product {'\u2014'} edit as needed
        </p>
        <div id="audienceTags" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--amp-sp-2)' }}>
          {audiences.map((a, i) => (
            <span key={i} className="amp-chip active">{a} {'\u00D7'}</span>
          ))}
        </div>
        <input className="amp-input" placeholder="Add audience segment + Enter" style={{ marginTop: 'var(--amp-sp-2)' }} />
      </div>

      {/* Key Talking Points */}
      <div style={{ marginBottom: 'var(--amp-sp-5)' }}>
        <h3 style={{ fontSize: 'var(--amp-text-md)', fontWeight: 600, color: 'var(--amp-text)' }}>Key Talking Points</h3>
        <div id="talkingPoints">
          {talkingPoints.map((t, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--amp-sp-2)', marginBottom: 'var(--amp-sp-1)' }}>
              <span style={{ flex: 1, fontSize: 'var(--amp-text-sm)', color: 'var(--amp-text-secondary)', background: 'var(--amp-stone-50)', padding: 'var(--amp-sp-2) var(--amp-sp-3)', borderRadius: 'var(--amp-radius-md)' }}>{t}</span>
              <button style={{ background: 'none', border: 'none', color: 'var(--amp-stone-400)', cursor: 'pointer', fontSize: 16 }}>{'\u00D7'}</button>
            </div>
          ))}
        </div>
        <input className="amp-input" placeholder="Add a talking point + Enter" style={{ marginTop: 'var(--amp-sp-1)' }} />
      </div>

      {/* Things to Avoid */}
      <div style={{ marginBottom: 'var(--amp-sp-5)' }}>
        <h3 style={{ fontSize: 'var(--amp-text-md)', fontWeight: 600, color: 'var(--amp-text)' }}>Things to Avoid</h3>
        <div id="avoidList">
          {avoidItems.map((a, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--amp-sp-2)', marginBottom: 'var(--amp-sp-1)' }}>
              <span style={{ flex: 1, fontSize: 'var(--amp-text-sm)', color: 'var(--amp-text-secondary)', background: 'var(--amp-stone-50)', padding: 'var(--amp-sp-2) var(--amp-sp-3)', borderRadius: 'var(--amp-radius-md)' }}>{a}</span>
              <button style={{ background: 'none', border: 'none', color: 'var(--amp-stone-400)', cursor: 'pointer', fontSize: 16 }}>{'\u00D7'}</button>
            </div>
          ))}
        </div>
        <input className="amp-input" placeholder="Add item + Enter" style={{ marginTop: 'var(--amp-sp-1)' }} />
      </div>

      {/* Video Length */}
      <div>
        <h3 style={{ fontSize: 'var(--amp-text-md)', fontWeight: 600, color: 'var(--amp-text)' }}>Video Length</h3>
        <div style={{ display: 'flex', gap: 'var(--amp-sp-1)', marginTop: 'var(--amp-sp-2)' }}>
          {['15s', '24s', '30s', '45s', '60s'].map((len) => (
            <button key={len} className={`amp-chip${len === '24s' ? ' active' : ''}`}>{len}</button>
          ))}
        </div>
        <p style={{ fontSize: 'var(--amp-text-xs)', color: 'var(--amp-stone-400)', marginTop: 'var(--amp-sp-1)' }}>24s is optimal for Instagram Reels and YouTube Shorts</p>
      </div>
    </div>
  );
};
