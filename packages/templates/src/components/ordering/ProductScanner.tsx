import React from 'react';
import { Card } from '@amplify/ui';
import type { ComponentRenderer } from '../../registry';

const defaultRecentProducts = [
  { name: 'Glow Radiance Serum', brand: 'Luminara Beauty', price: '\u20B91,299', lastUsed: '3 days ago' },
  { name: 'HydraGlow Moisturizer', brand: 'Luminara Beauty', price: '\u20B9899', lastUsed: '2 weeks ago' },
];

export const ProductScanner: ComponentRenderer = ({ props, context }) => {
  const data = (context.data as Record<string, unknown>) || {};
  const product = (data.product as Record<string, unknown>) || { name: 'Glow Radiance Serum', brand: 'Luminara Beauty', price: '\u20B91,299', description: 'Lightweight, fast-absorbing serum with Vitamin C and Hyaluronic Acid for radiant, hydrated skin.', categories: ['Beauty', 'Skincare'], instagram: '@luminara.beauty' };
  const recentProducts = (props.recentProducts as typeof defaultRecentProducts) || defaultRecentProducts;
  const heading = (props.heading as string) || 'What product are you promoting?';

  return (
    <div>
      <h2 style={{ fontSize: 'var(--amp-text-lg)', fontWeight: 600, color: 'var(--amp-text)', lineHeight: 1.3 }}>{heading}</h2>

      {props.showRecent !== false && (
        <div style={{ margin: 'var(--amp-sp-4) 0' }}>
          <p style={{ fontSize: 'var(--amp-text-sm)', color: 'var(--amp-text-muted)', marginBottom: 'var(--amp-sp-2)' }}>Your recent products</p>
          <div style={{ display: 'flex', gap: 'var(--amp-sp-3)' }}>
            {recentProducts.map((p, i) => (
              <Card key={i} variant="interactive" padding="sm" className="clickable" style={{ display: 'flex', gap: 'var(--amp-sp-3)', alignItems: 'center', flex: 1, cursor: 'pointer' }}>
                <div style={{ width: 40, height: 40, borderRadius: 'var(--amp-radius-md)', background: 'linear-gradient(135deg, var(--amp-violet-100), var(--amp-violet-300))', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 'var(--amp-text-sm)', fontWeight: 600 }}>{p.name}</div>
                  <div style={{ fontSize: 'var(--amp-text-xs)', color: 'var(--amp-text-muted)' }}>{p.brand} {'\u00B7'} {p.lastUsed}</div>
                </div>
              </Card>
            ))}
          </div>
          <p style={{ fontSize: 'var(--amp-text-xs)', color: 'var(--amp-text-muted)', marginTop: 'var(--amp-sp-2)', textAlign: 'center' }}>{'\u2014'} or add a new product {'\u2014'}</p>
        </div>
      )}

      <div style={{ position: 'relative', marginTop: 'var(--amp-sp-3)' }}>
        <input className="amp-input" id="productUrl" placeholder="Paste your product URL here" style={{ paddingRight: 90, height: 52, fontSize: 'var(--amp-text-md)' }} />
        <button
          style={{
            position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)',
            padding: 'var(--amp-sp-2) var(--amp-sp-4)', background: 'var(--amp-accent)',
            color: '#fff', border: 'none', borderRadius: 'var(--amp-radius-md)',
            fontSize: 'var(--amp-text-sm)', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--amp-font)',
          }}
        >
          Scan {'\u2197'}
        </button>
      </div>

      <div id="productArea" style={{ display: 'none' }} />
      <div id="intelligenceScrape" style={{ display: 'none', marginTop: 'var(--amp-sp-4)', textAlign: 'center', padding: 'var(--amp-sp-8)' }}>
        <div style={{ fontSize: 'var(--amp-text-md)', fontWeight: 600, color: 'var(--amp-text)', marginBottom: 'var(--amp-sp-4)' }} id="scrapeStep">Analyzing your product...</div>
        <div style={{ width: 200, height: 4, background: 'var(--amp-stone-200)', borderRadius: 'var(--amp-radius-full)', margin: '0 auto' }}>
          <div id="scrapeBar" style={{ width: '0%', height: '100%', background: 'var(--amp-accent)', borderRadius: 'var(--amp-radius-full)', transition: 'width .5s' }} />
        </div>
      </div>

      {/* Product card template for JS to inject */}
      <template id="productCardTemplate">
        <div className="amp-card" style={{ padding: 'var(--amp-sp-6)', marginTop: 'var(--amp-sp-4)', display: 'flex', gap: 'var(--amp-sp-5)', alignItems: 'flex-start' }}>
          <div style={{ width: 100, height: 100, borderRadius: 'var(--amp-radius-lg)', background: 'linear-gradient(135deg, var(--amp-violet-100), var(--amp-violet-300))', flexShrink: 0 }} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--amp-sp-2)' }}>
            <div style={{ display: 'flex', gap: 'var(--amp-sp-3)' }}>
              <div style={{ flex: 2 }}>
                <label style={{ fontSize: 'var(--amp-text-xs)', color: 'var(--amp-text-muted)' }}>Product Name</label>
                <input className="amp-input" defaultValue={product.name as string} style={{ marginTop: 2 }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 'var(--amp-text-xs)', color: 'var(--amp-text-muted)' }}>Price</label>
                <input className="amp-input" defaultValue={product.price as string} style={{ marginTop: 2 }} />
              </div>
            </div>
            <div>
              <label style={{ fontSize: 'var(--amp-text-xs)', color: 'var(--amp-text-muted)' }}>Brand</label>
              <input className="amp-input" defaultValue={product.brand as string} style={{ marginTop: 2 }} />
            </div>
            <div>
              <label style={{ fontSize: 'var(--amp-text-xs)', color: 'var(--amp-text-muted)' }}>Description</label>
              <textarea className="amp-input" rows={2} defaultValue={product.description as string} style={{ marginTop: 2 }} />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--amp-sp-2)', marginTop: 'var(--amp-sp-1)' }}>
              {((product.categories as string[]) || ['Beauty', 'Skincare']).map((c, ci) => (
                <span key={ci} className="amp-chip active">{c}</span>
              ))}
              <span className="amp-chip">Health</span>
              <span className="amp-chip">Lifestyle</span>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--amp-sp-2)', fontSize: 'var(--amp-text-sm)', color: 'var(--amp-text-secondary)', cursor: 'pointer', marginTop: 'var(--amp-sp-1)' }}>
              <input type="checkbox" defaultChecked id="shippingToggle" /> Requires shipping
            </label>
          </div>
        </div>
      </template>
    </div>
  );
};
