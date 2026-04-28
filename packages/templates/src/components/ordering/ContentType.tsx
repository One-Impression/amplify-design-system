import React from 'react';
import { Card, Badge, Button } from '@amplify-ai/ui';
import type { ComponentRenderer } from '../../registry';

export const ContentType: ComponentRenderer = ({ props }) => {
  const heading = (props.heading as string) || 'How should we create your content?';
  const subheading = (props.subheading as string) || 'AI is our recommended default \u2014 trained on 50,000+ campaigns';

  return (
    <div>
      <h2 style={{ fontSize: 'var(--amp-text-lg)', fontWeight: 600, color: 'var(--amp-text)', lineHeight: 1.3 }}>{heading}</h2>
      <p style={{ fontSize: 'var(--amp-text-base)', color: 'var(--amp-text-muted)', marginTop: 'var(--amp-sp-1)' }}>{subheading}</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--amp-sp-5)', marginTop: 'var(--amp-sp-5)' }}>
        {/* AI Card */}
        <Card variant="interactive" padding="lg" className="clickable selected" id="cardAi" style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', top: 'var(--amp-sp-4)', right: 'var(--amp-sp-4)' }}>
            <Badge variant="positive">Recommended</Badge>
          </div>
          <h3 style={{ fontSize: 'var(--amp-text-md)', fontWeight: 600, color: 'var(--amp-text)' }}>{'\u26A1'} AI-Generated Video</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 'var(--amp-sp-4) 0' }}>
            {['Ready in 24 hours', 'Unlimited revisions included', 'Trained on 50,000+ campaigns', 'Multiple variations from one brief'].map((item, i) => (
              <li key={i} style={{ display: 'flex', gap: 'var(--amp-sp-2)', fontSize: 'var(--amp-text-sm)', color: 'var(--amp-text-secondary)', padding: 'var(--amp-sp-1) 0' }}>
                <span style={{ color: 'var(--amp-green-600)', fontWeight: 700, flexShrink: 0 }}>{'\u2713'}</span>{item}
              </li>
            ))}
          </ul>
          <div style={{ background: 'var(--amp-stone-50)', borderRadius: 10, padding: 'var(--amp-sp-3)', marginBottom: 'var(--amp-sp-4)' }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--amp-stone-400)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 'var(--amp-sp-1)' }}>Best for</div>
            <p style={{ fontSize: 'var(--amp-text-sm)', color: 'var(--amp-text-secondary)' }}>Performance marketing, A/B testing, fast creative iteration</p>
          </div>
          <div style={{ fontSize: 'var(--amp-text-md)', fontWeight: 700, color: 'var(--amp-violet-700)', marginBottom: 'var(--amp-sp-4)' }}>From {'\u20B9'}2,000/video</div>
          <Button variant="primary" className="amp-btn-full" id="btnAi">Selected {'\u2713'}</Button>
        </Card>

        {/* Human Card */}
        <Card variant="interactive" padding="lg" className="clickable" id="cardHuman" style={{ position: 'relative' }}>
          <h3 style={{ fontSize: 'var(--amp-text-md)', fontWeight: 600, color: 'var(--amp-text)' }}>{'\u2605'} Human Creator Content</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 'var(--amp-sp-4) 0' }}>
            {['Authentic & relatable content', 'Real audience reach & engagement', "Posted on creator's own profile", 'Genuine brand endorsement'].map((item, i) => (
              <li key={i} style={{ display: 'flex', gap: 'var(--amp-sp-2)', fontSize: 'var(--amp-text-sm)', color: 'var(--amp-text-secondary)', padding: 'var(--amp-sp-1) 0' }}>
                <span style={{ color: 'var(--amp-green-600)', fontWeight: 700, flexShrink: 0 }}>{'\u2713'}</span>{item}
              </li>
            ))}
          </ul>
          <div style={{ background: 'var(--amp-stone-50)', borderRadius: 10, padding: 'var(--amp-sp-3)', marginBottom: 'var(--amp-sp-4)' }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--amp-stone-400)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 'var(--amp-sp-1)' }}>Best for</div>
            <p style={{ fontSize: 'var(--amp-text-sm)', color: 'var(--amp-text-secondary)' }}>Brand trust, organic social proof, community building</p>
          </div>
          <div style={{ fontSize: 'var(--amp-text-md)', fontWeight: 700, color: 'var(--amp-violet-700)', marginBottom: 'var(--amp-sp-4)' }}>From {'\u20B9'}5,000/creator</div>
          <Button variant="outline" className="amp-btn-full" id="btnHuman">Select Human Creator</Button>
        </Card>
      </div>

      {/* Human options (hidden by default) */}
      <div id="humanOptions" style={{ display: 'none', marginTop: 'var(--amp-sp-5)' }}>
        <h3 style={{ fontSize: 'var(--amp-text-md)', fontWeight: 600, color: 'var(--amp-text)' }}>Creator preferences</h3>
        <p style={{ fontSize: 'var(--amp-text-xs)', color: 'var(--amp-text-muted)', marginBottom: 'var(--amp-sp-3)' }}>Defaults to Flexi (we pick the best mix). Customize below if needed.</p>
        <details style={{ marginTop: 'var(--amp-sp-2)' }}>
          <summary style={{ cursor: 'pointer', fontSize: 'var(--amp-text-sm)', fontWeight: 600, color: 'var(--amp-accent)' }}>Customize creator preferences {'\u25B8'}</summary>
          <div style={{ marginTop: 'var(--amp-sp-3)', display: 'flex', flexDirection: 'column', gap: 'var(--amp-sp-3)' }}>
            <div>
              <label style={{ fontSize: 'var(--amp-text-xs)', color: 'var(--amp-text-muted)' }}>Size</label>
              <div style={{ display: 'flex', gap: 'var(--amp-sp-2)', marginTop: 'var(--amp-sp-1)' }}>
                <span className="amp-chip active">Flexi (Recommended)</span>
                <span className="amp-chip">Micro 5K-50K</span>
                <span className="amp-chip">Mid 50K-100K</span>
                <span className="amp-chip">Large 100K+</span>
              </div>
            </div>
            <div>
              <label style={{ fontSize: 'var(--amp-text-xs)', color: 'var(--amp-text-muted)' }}>Gender</label>
              <div style={{ display: 'flex', gap: 'var(--amp-sp-2)', marginTop: 'var(--amp-sp-1)' }}>
                <span className="amp-chip active">All</span>
                <span className="amp-chip">Male</span>
                <span className="amp-chip">Female</span>
              </div>
            </div>
            <div>
              <label style={{ fontSize: 'var(--amp-text-xs)', color: 'var(--amp-text-muted)' }}>Language</label>
              <div style={{ display: 'flex', gap: 'var(--amp-sp-2)', marginTop: 'var(--amp-sp-1)' }}>
                <span className="amp-chip active">Hindi</span>
                <span className="amp-chip active">English</span>
                <span className="amp-chip">Tamil</span>
                <span className="amp-chip">Telugu</span>
              </div>
            </div>
          </div>
        </details>
      </div>
    </div>
  );
};
