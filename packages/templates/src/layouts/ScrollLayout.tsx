import React from 'react';
import { Button } from '@one-impression/ui';
import type { TemplateConfig } from '../render';
import { renderComponent } from '../registry';

interface LayoutProps {
  config: TemplateConfig;
  context: Record<string, unknown>;
}

function getCSS(): string {
  return `
/* Scroll Layout */
.amp-progress-line{position:fixed;left:40px;top:80px;bottom:80px;width:3px;background:var(--amp-stone-200);border-radius:var(--amp-radius-full);z-index:50}
.amp-progress-fill{width:100%;background:var(--amp-accent);border-radius:var(--amp-radius-full);transition:height .6s;position:absolute;top:0}
.amp-progress-dot{width:12px;height:12px;border-radius:var(--amp-radius-full);background:var(--amp-stone-200);position:absolute;left:-4.5px;transition:all .3s}
.amp-progress-dot.active{background:var(--amp-accent);box-shadow:0 0 0 4px rgba(124,58,237,.15)}
.amp-progress-dot.done{background:var(--amp-green-600)}
.amp-section{margin-bottom:var(--amp-sp-12);opacity:0;transform:translateY(40px);transition:all .5s ease-out;pointer-events:none}
.amp-section.visible{opacity:1;transform:translateY(0);pointer-events:auto}
.amp-section-num{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:var(--amp-radius-full);background:var(--amp-accent);color:#fff;font-size:12px;font-weight:700;margin-bottom:var(--amp-sp-3)}
.amp-section-num.final{background:var(--amp-green-600)}
.amp-fab{position:fixed;bottom:32px;right:32px;width:56px;height:56px;border-radius:var(--amp-radius-full);background:var(--amp-accent);color:#fff;border:none;cursor:pointer;box-shadow:0 4px 12px rgba(124,58,237,.3);font-size:20px;display:flex;align-items:center;justify-content:center;z-index:90;transition:all .2s}
.amp-fab:hover{transform:scale(1.1)}
.amp-drawer-bg{position:fixed;inset:0;background:rgba(28,25,23,.3);z-index:150;display:none;backdrop-filter:blur(2px)}
.amp-drawer-bg.show{display:block}
.amp-drawer{position:fixed;top:0;right:0;width:380px;height:100%;background:var(--amp-surface);z-index:160;transform:translateX(100%);transition:transform .3s ease-out;overflow-y:auto;box-shadow:-4px 0 24px rgba(0,0,0,.08)}
.amp-drawer-bg.show .amp-drawer{transform:translateX(0)}
@media(max-width:768px){
  .amp-progress-line{display:none}
  .amp-drawer{width:100%;border-radius:var(--amp-radius-xl) var(--amp-radius-xl) 0 0;top:auto;bottom:0;height:80vh;transform:translateY(100%)}
  .amp-drawer-bg.show .amp-drawer{transform:translateY(0)}
}
`;
}

const ScrollLayout: React.FC<LayoutProps> & { getCSS: () => string } = ({ config, context }) => {
  const { screens, data } = config;
  const returning = data?.returning as boolean;
  const dotSpacing = screens.length > 1 ? 85 / (screens.length - 1) : 0;

  return (
    <>
      {/* Topbar */}
      <div className="amp-topbar">
        <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="amp-logo">amplify</div>
          <div style={{ padding: 'var(--amp-sp-1) var(--amp-sp-3)', borderRadius: 'var(--amp-radius-full)', background: 'var(--amp-accent-light)', color: 'var(--amp-accent)', fontSize: 'var(--amp-text-sm)', fontWeight: 600 }}>New Campaign</div>
        </div>
      </div>

      {/* Progress line */}
      <div className="amp-progress-line" id="progressLine">
        <div className="amp-progress-fill" id="progressFill" style={{ height: '0%' }} />
        {screens.map((_, i) => (
          <div key={i} className={`amp-progress-dot${i === 0 ? ' active' : ''}`} style={{ top: `${i * dotSpacing}%` }} id={`dot${i + 1}`} />
        ))}
      </div>

      {/* Content */}
      <div className="amp-container-narrow">
        {/* Repeat banner */}
        {returning && renderComponent('repeat-banner', { lastProduct: (data?.product as Record<string, unknown>)?.name, completion: '92%' }, context)}

        {/* Sections */}
        {screens.map((screen, i) => {
          const isLast = i === screens.length - 1;
          return (
            <div key={i} className={`amp-section${i === 0 ? ' visible' : ''}`} id={`sec${i + 1}`}>
              <div className={`amp-section-num${isLast ? ' final' : ''}`}>{i + 1}</div>

              {(screen.components || []).map((comp, ci) => (
                <React.Fragment key={ci}>
                  {renderComponent(comp.component, comp.props || {}, context)}
                </React.Fragment>
              ))}

              {!isLast && (
                <div style={{ textAlign: 'center', marginTop: 'var(--amp-sp-6)' }}>
                  <Button variant="primary" size="lg">Continue {'\u2192'}</Button>
                </div>
              )}
            </div>
          );
        })}

        {/* Success modal */}
        {renderComponent('success-modal', {}, context)}
      </div>

      {/* FAB + Drawer */}
      <button className="amp-fab">{'\u2699\uFE0F'}</button>
      <div className="amp-drawer-bg" id="drawerBg">
        <div className="amp-drawer">
          <div style={{ padding: 'var(--amp-sp-5) var(--amp-sp-6)', borderBottom: '1px solid var(--amp-stone-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: 'var(--amp-surface)', zIndex: 1 }}>
            <h2 style={{ fontSize: 'var(--amp-text-lg)', fontWeight: 600, color: 'var(--amp-text)' }}>Fine-tune your campaign</h2>
            <button style={{ width: 32, height: 32, border: 'none', background: 'var(--amp-stone-100)', borderRadius: 'var(--amp-radius-md)', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{'\u00D7'}</button>
          </div>
          <div style={{ padding: 'var(--amp-sp-6)' }}>
            {/* Creator Preferences */}
            <div style={{ marginBottom: 'var(--amp-sp-6)' }}>
              <h3 style={{ fontSize: 'var(--amp-text-md)', fontWeight: 600, color: 'var(--amp-text)' }}>Creator Preferences</h3>
              <div style={{ marginTop: 'var(--amp-sp-2)' }}>
                <div style={{ fontSize: 'var(--amp-text-xs)', color: 'var(--amp-text-muted)', marginBottom: 'var(--amp-sp-1)' }}>Size</div>
                <div style={{ display: 'flex', gap: 'var(--amp-sp-1)', flexWrap: 'wrap' }}>
                  <span className="amp-chip active">Flexi</span>
                  <span className="amp-chip">Micro</span>
                  <span className="amp-chip">Mid</span>
                  <span className="amp-chip">Large</span>
                </div>
              </div>
              <div style={{ marginTop: 'var(--amp-sp-3)' }}>
                <div style={{ fontSize: 'var(--amp-text-xs)', color: 'var(--amp-text-muted)', marginBottom: 'var(--amp-sp-1)' }}>Gender</div>
                <div style={{ display: 'flex', gap: 'var(--amp-sp-1)' }}>
                  <span className="amp-chip active">All</span>
                  <span className="amp-chip">Male</span>
                  <span className="amp-chip">Female</span>
                </div>
              </div>
              <div style={{ marginTop: 'var(--amp-sp-3)' }}>
                <div style={{ fontSize: 'var(--amp-text-xs)', color: 'var(--amp-text-muted)', marginBottom: 'var(--amp-sp-1)' }}>Language</div>
                <div style={{ display: 'flex', gap: 'var(--amp-sp-1)', flexWrap: 'wrap' }}>
                  <span className="amp-chip active">Hindi</span>
                  <span className="amp-chip active">English</span>
                  <span className="amp-chip">Tamil</span>
                  <span className="amp-chip">Telugu</span>
                </div>
              </div>
            </div>

            {/* Content Settings */}
            <div style={{ marginBottom: 'var(--amp-sp-6)' }}>
              <h3 style={{ fontSize: 'var(--amp-text-md)', fontWeight: 600, color: 'var(--amp-text)' }}>Content Settings</h3>
              <div style={{ marginTop: 'var(--amp-sp-2)' }}>
                <div style={{ fontSize: 'var(--amp-text-xs)', color: 'var(--amp-text-muted)', marginBottom: 'var(--amp-sp-1)' }}>Video Length</div>
                <div style={{ display: 'flex', gap: 'var(--amp-sp-1)' }}>
                  <span className="amp-chip">15s</span>
                  <span className="amp-chip active">24s</span>
                  <span className="amp-chip">30s</span>
                  <span className="amp-chip">45s</span>
                  <span className="amp-chip">60s</span>
                </div>
              </div>
              <div style={{ marginTop: 'var(--amp-sp-3)' }}>
                <div style={{ fontSize: 'var(--amp-text-xs)', color: 'var(--amp-text-muted)', marginBottom: 'var(--amp-sp-1)' }}>Quality</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--amp-sp-2)' }}>
                  <div className="amp-card selected" style={{ padding: 'var(--amp-sp-3) var(--amp-sp-4)', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <strong style={{ fontSize: 'var(--amp-text-sm)' }}>Flexi (Recommended)</strong>
                      <span style={{ fontSize: 'var(--amp-text-xs)', color: 'var(--amp-green-600)', fontWeight: 600 }}>Default</span>
                    </div>
                  </div>
                  <div className="amp-card" style={{ padding: 'var(--amp-sp-3) var(--amp-sp-4)', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <strong style={{ fontSize: 'var(--amp-text-sm)' }}>{'\u2605\u2605\u2605\u2605\u2605'} Premium</strong>
                      <span style={{ fontSize: 'var(--amp-text-xs)', color: 'var(--amp-violet-700)', fontWeight: 600 }}>+{'\u20B9'}5,800</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Button variant="primary" className="amp-btn-full">Apply Changes</Button>
          </div>
        </div>
      </div>
    </>
  );
};

ScrollLayout.getCSS = getCSS;
export { ScrollLayout };
