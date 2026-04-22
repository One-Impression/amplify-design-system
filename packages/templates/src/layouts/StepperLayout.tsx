import React from 'react';
import { Button } from '@amplify/ui';
import type { TemplateConfig } from '../render';
import { renderComponent } from '../registry';

interface LayoutProps {
  config: TemplateConfig;
  context: Record<string, unknown>;
}

function getCSS(): string {
  return `
/* Stepper Layout */
.amp-stepper{max-width:560px;margin:var(--amp-sp-6) auto 0;padding:0 var(--amp-sp-6);display:flex;align-items:center;justify-content:center}
.amp-step{display:flex;align-items:center;gap:var(--amp-sp-2);cursor:pointer}
.amp-step-circle{width:32px;height:32px;border-radius:var(--amp-radius-full);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;border:2px solid var(--amp-stone-300);color:var(--amp-stone-400);background:var(--amp-surface);transition:all var(--amp-transition);flex-shrink:0}
.amp-step.active .amp-step-circle{border-color:var(--amp-accent);background:var(--amp-accent);color:#fff}
.amp-step.done .amp-step-circle{border-color:var(--amp-green-600);background:var(--amp-green-600);color:#fff}
.amp-step-label{font-size:var(--amp-text-sm);color:var(--amp-stone-400);font-weight:500;white-space:nowrap;transition:color var(--amp-transition)}
.amp-step.active .amp-step-label{color:var(--amp-violet-700);font-weight:600}
.amp-step.done .amp-step-label{color:var(--amp-green-600)}
.amp-step-line{width:48px;height:2px;background:var(--amp-stone-200);margin:0 var(--amp-sp-1);flex-shrink:0;overflow:hidden;position:relative}
.amp-step-line-fill{height:100%;background:var(--amp-green-600);width:0;transition:width .4s;position:absolute;left:0;top:0}
.amp-screen{display:none;animation:fadeSlideIn .35s ease-out}
.amp-screen.active{display:block}
@media(max-width:768px){.amp-step-label{display:none}.amp-step.active .amp-step-label{display:inline}}
`;
}

const StepperLayout: React.FC<LayoutProps> & { getCSS: () => string } = ({ config, context }) => {
  const { screens, data } = config;
  const brandName = (data?.brand as Record<string, unknown>)?.name as string || 'Brand Co.';
  const brandInitials = brandName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const returning = data?.returning as boolean;

  return (
    <>
      {/* Topbar */}
      <div className="amp-topbar">
        <div className="amp-topbar-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--amp-sp-4)' }}>
            <div className="amp-logo">amplify</div>
            <div style={{ width: 1, height: 22, background: 'var(--amp-border)' }} />
            <div style={{ fontSize: 'var(--amp-text-md)', fontWeight: 600, color: 'var(--amp-stone-700)' }}>New Campaign</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--amp-sp-3)' }}>
            <span style={{ fontSize: 'var(--amp-text-sm)', color: 'var(--amp-text-secondary)', fontWeight: 500 }}>{brandName}</span>
            <div className="amp-avatar">{brandInitials}</div>
          </div>
        </div>
      </div>

      {/* Stepper */}
      <div className="amp-stepper">
        {screens.map((screen, i) => (
          <React.Fragment key={i}>
            {i > 0 && (
              <div className="amp-step-line"><div className="amp-step-line-fill" /></div>
            )}
            <div className={`amp-step${i === 0 ? ' active' : ''}`}>
              <div className="amp-step-circle">{i + 1}</div>
              <span className="amp-step-label">{screen.label}</span>
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Screens */}
      <div className="amp-container">
        {screens.map((screen, i) => (
          <div key={i} className={`amp-screen${i === 0 ? ' active' : ''}`} id={`screen${i + 1}`}>
            {/* Repeat banner on first screen */}
            {i === 0 && returning && renderComponent('repeat-banner', { lastProduct: (data?.product as Record<string, unknown>)?.name, completion: '92%' }, context)}

            {/* Components */}
            {(screen.components || []).map((comp, ci) => (
              <React.Fragment key={ci}>
                {renderComponent(comp.component, comp.props || {}, context)}
              </React.Fragment>
            ))}

            {/* Navigation */}
            <div className="amp-nav-buttons">
              {i > 0 ? (
                <Button variant="ghost">{'\u2190'} Back</Button>
              ) : (
                <div />
              )}
              {i < screens.length - 1 && (
                <Button variant="primary" size="lg" id={`nextBtn${i + 1}`}>Continue {'\u2192'}</Button>
              )}
            </div>
          </div>
        ))}

        {/* Success modal */}
        {renderComponent('success-modal', {}, context)}
      </div>
    </>
  );
};

StepperLayout.getCSS = getCSS;
export { StepperLayout };
