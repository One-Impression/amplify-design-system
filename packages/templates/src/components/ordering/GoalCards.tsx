import React from 'react';
import { Card, CardContent } from '@amplify-ai/ui';
import type { ComponentRenderer } from '../../registry';

const defaultGoals = [
  { id: 'ads', icon: '\uD83C\uDFAC', title: 'Content for Ads', tagline: 'Scroll-stopping UGC for paid campaigns', bullets: ['Full content ownership & rights', 'Optimized for Meta, Google, YouTube', 'Multiple format variations'], price: 'From \u20B95,000/video', timeline: '7-10 days' },
  { id: 'influencer', icon: '\uD83D\uDCF1', title: 'Influencer Marketing', tagline: 'Creators post about you to their audience', bullets: ["Content on creator's own profile", 'Organic reach & engagement', 'Authentic social proof'], price: 'From \u20B98,000/creator', timeline: '10-14 days' },
  { id: 'launch', icon: '\uD83D\uDE80', title: 'Product Launch', tagline: 'Coordinated buzz from multiple creators', bullets: ['Multiple creators, same timeline', 'Build pre-launch excitement', 'Coordinated posting schedule'], price: 'From \u20B925,000/campaign', timeline: '5-7 days' },
];

export const GoalCards: ComponentRenderer = ({ props }) => {
  const goals = (props.goals as typeof defaultGoals) || defaultGoals;
  const heading = (props.heading as string) || 'What would you like to achieve?';
  const subheading = (props.subheading as string) || "Pick a goal \u2014 we'll configure the best campaign setup for you";

  return (
    <div>
      <h1 style={{ fontSize: 'var(--amp-text-xl)', fontWeight: 700, color: 'var(--amp-text)', lineHeight: 1.2 }}>
        {heading}
      </h1>
      <p style={{ fontSize: 'var(--amp-text-base)', color: 'var(--amp-text-muted)', marginTop: '4px' }}>
        {subheading}
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--amp-sp-5)', marginTop: 'var(--amp-sp-6)' }}>
        {goals.map((g, i) => (
          <Card
            key={g.id}
            variant="interactive"
            padding="lg"
            className={`goal-card clickable${i === 0 ? ' selected' : ''}`}
            data-goal={g.id}
            style={{ position: 'relative', cursor: 'pointer' }}
          >
            <div
              className="card-check"
              style={{
                position: 'absolute', top: 'var(--amp-sp-3)', right: 'var(--amp-sp-3)',
                width: 24, height: 24, borderRadius: 'var(--amp-radius-full)',
                background: 'var(--amp-accent)', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, opacity: i === 0 ? 1 : 0, transition: 'opacity 0.2s',
              }}
            >
              {'\u2713'}
            </div>
            <CardContent>
              <div style={{ fontSize: 36, marginBottom: 'var(--amp-sp-3)' }}>{g.icon}</div>
              <h3 style={{ fontSize: 'var(--amp-text-md)', fontWeight: 600, color: 'var(--amp-text)' }}>{g.title}</h3>
              <p style={{ fontSize: 'var(--amp-text-sm)', color: 'var(--amp-text-muted)', margin: 'var(--amp-sp-1) 0 var(--amp-sp-3)' }}>{g.tagline}</p>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: 'var(--amp-sp-4)' }}>
                {g.bullets.map((b, bi) => (
                  <li key={bi} style={{ fontSize: 'var(--amp-text-xs)', color: 'var(--amp-text-secondary)', padding: '2px 0 2px 18px', position: 'relative' }}>
                    <span style={{ color: 'var(--amp-violet-500)', position: 'absolute', left: 0, fontWeight: 700 }}>{'\u2022'}</span>
                    {b}
                  </li>
                ))}
              </ul>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 'var(--amp-sp-3)', borderTop: '1px solid var(--amp-stone-100)' }}>
                <span style={{ fontSize: 'var(--amp-text-sm)', fontWeight: 600, color: 'var(--amp-violet-700)' }}>{g.price}</span>
                <span style={{ fontSize: 11, color: 'var(--amp-stone-400)' }}>{g.timeline}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {props.showQuiz !== false && (
        <div style={{ textAlign: 'center', marginTop: 'var(--amp-sp-5)' }}>
          <a href="#" style={{ fontSize: 'var(--amp-text-sm)', color: 'var(--amp-text-muted)', textDecoration: 'none' }}>
            Not sure which to pick? Take a quick quiz {'\u2192'}
          </a>
        </div>
      )}
    </div>
  );
};
