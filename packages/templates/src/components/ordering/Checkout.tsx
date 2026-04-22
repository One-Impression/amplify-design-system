import React from 'react';
import { Card, Button } from '@amplify/ui';
import type { ComponentRenderer } from '../../registry';

export const Checkout: ComponentRenderer = ({ props, context }) => {
  const data = (context.data as Record<string, unknown>) || {};
  const wallet = (data.wallet as number) || 12400;
  const total = (props.total as number) || 30000;
  const gst = Math.round(total * 0.18);
  const grandTotal = total + gst;
  const due = Math.max(0, grandTotal - wallet);

  const fmt = (n: number) => '\u20B9' + n.toLocaleString('en-IN');

  return (
    <div className="amp-two-col">
      {/* Left: Summary */}
      <div>
        <Card variant="default" padding="lg">
          {/* Goal & Product */}
          <div style={{ padding: 'var(--amp-sp-4) 0', borderBottom: '1px solid var(--amp-stone-100)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--amp-sp-3)' }}>
              <h3 style={{ fontSize: 'var(--amp-text-md)', fontWeight: 600, color: 'var(--amp-text)' }}>Goal & Product</h3>
              <span style={{ fontSize: 'var(--amp-text-xs)', color: 'var(--amp-accent)', cursor: 'pointer' }}>Edit</span>
            </div>
            <div style={{ display: 'flex', gap: 'var(--amp-sp-3)', alignItems: 'center' }}>
              <div style={{ width: 48, height: 48, borderRadius: 'var(--amp-radius-md)', background: 'linear-gradient(135deg, var(--amp-violet-100), var(--amp-violet-300))', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 'var(--amp-text-base)', fontWeight: 600 }}>Glow Radiance Serum</div>
                <div style={{ fontSize: 'var(--amp-text-xs)', color: 'var(--amp-text-muted)' }}>Luminara Beauty {'\u00B7'} {'\u20B9'}1,299 {'\u00B7'} {'\uD83C\uDFAC'} Content for Ads</div>
              </div>
            </div>
          </div>

          {/* Content & Budget */}
          <div style={{ padding: 'var(--amp-sp-4) 0', borderBottom: '1px solid var(--amp-stone-100)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--amp-sp-2)' }}>
              <h3 style={{ fontSize: 'var(--amp-text-md)', fontWeight: 600, color: 'var(--amp-text)' }}>Content & Budget</h3>
              <span style={{ fontSize: 'var(--amp-text-xs)', color: 'var(--amp-accent)', cursor: 'pointer' }}>Edit</span>
            </div>
            <div className="amp-price-row"><span>Type</span><span style={{ color: 'var(--amp-text)', fontWeight: 500 }}>AI Video {'\u2014'} Growth Package</span></div>
            <div className="amp-price-row"><span>Videos</span><span style={{ color: 'var(--amp-text)', fontWeight: 500 }}>15 videos {'\u00B7'} 24s {'\u00B7'} 9:16 vertical</span></div>
          </div>

          {/* Brief & Scripts */}
          <div style={{ padding: 'var(--amp-sp-4) 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--amp-sp-2)' }}>
              <h3 style={{ fontSize: 'var(--amp-text-md)', fontWeight: 600, color: 'var(--amp-text)' }}>Brief & Scripts</h3>
              <span style={{ fontSize: 'var(--amp-text-xs)', color: 'var(--amp-accent)', cursor: 'pointer' }}>Edit</span>
            </div>
            <div className="amp-price-row"><span>Concepts</span><span style={{ color: 'var(--amp-text)', fontWeight: 500 }}>Problem {'\u2192'} Solution, Trend Story</span></div>
            <div className="amp-price-row"><span>Scripts</span><span style={{ color: 'var(--amp-text)', fontWeight: 500 }}>2 samples (edit after payment)</span></div>
          </div>
        </Card>
      </div>

      {/* Right: Payment */}
      <div>
        <Card variant="default" padding="lg" style={{ position: 'sticky', top: 100 }}>
          <h2 style={{ fontSize: 'var(--amp-text-lg)', fontWeight: 600, color: 'var(--amp-text)', marginBottom: 'var(--amp-sp-5)' }}>Payment</h2>

          {/* Billing */}
          <div style={{ marginBottom: 'var(--amp-sp-4)' }}>
            <div style={{ fontSize: 'var(--amp-text-sm)', fontWeight: 600, marginBottom: 'var(--amp-sp-2)' }}>Billing</div>
            <Card variant="default" padding="sm" style={{ background: 'var(--amp-green-50)', borderColor: 'var(--amp-green-600)' }}>
              <div style={{ fontSize: 'var(--amp-text-sm)', color: 'var(--amp-green-600)', fontWeight: 600 }}>{'\u2713'} We found your billing details</div>
              <div style={{ fontSize: 'var(--amp-text-xs)', color: 'var(--amp-text-muted)', marginTop: 2 }}>Luminara Beauty Pvt Ltd {'\u00B7'} GST: 27AALCL1234F1Z5 {'\u00B7'} Mumbai</div>
              <a href="#" style={{ fontSize: 'var(--amp-text-xs)', color: 'var(--amp-accent)', textDecoration: 'none' }}>Change {'\u2192'}</a>
            </Card>
          </div>

          {/* Price breakdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--amp-sp-2)' }}>
            <div className="amp-price-row"><span>Campaign cost</span><span>{fmt(total)}</span></div>
            <div className="amp-price-row"><span>GST (18%)</span><span>{fmt(gst)}</span></div>
            <div className="amp-price-row amp-price-total"><span>Total</span><span>{fmt(grandTotal)}</span></div>
            <div className="amp-price-row amp-price-credit"><span>OI Money</span><span>{'\u2212'}{fmt(wallet)}</span></div>
            <div className="amp-price-row amp-price-due"><span>Amount Due</span><span>{fmt(due)}</span></div>
          </div>

          {/* Payment tabs */}
          <div className="amp-tabs">
            <button className="amp-tab active">UPI</button>
            <button className="amp-tab">Card</button>
            <button className="amp-tab">Net Banking</button>
          </div>
          <div id="payTab0">
            <input className="amp-input" placeholder="Enter UPI ID (e.g., name@upi)" />
            <p style={{ fontSize: 'var(--amp-text-xs)', color: 'var(--amp-stone-400)', textAlign: 'center', marginTop: 'var(--amp-sp-1)' }}>Or scan QR on next screen</p>
          </div>
          <div id="payTab1" style={{ display: 'none' }}>
            <input className="amp-input" placeholder="Card Number" style={{ marginBottom: 'var(--amp-sp-2)' }} />
            <div style={{ display: 'flex', gap: 'var(--amp-sp-2)' }}>
              <input className="amp-input" placeholder="MM/YY" />
              <input className="amp-input" placeholder="CVV" style={{ maxWidth: 100 }} />
            </div>
          </div>
          <div id="payTab2" style={{ display: 'none' }}>
            <select className="amp-input">
              <option>Select your bank</option>
              <option>HDFC Bank</option>
              <option>ICICI Bank</option>
              <option>SBI</option>
              <option>Axis Bank</option>
            </select>
          </div>

          <Button variant="primary" size="lg" className="amp-btn-full" style={{ marginTop: 'var(--amp-sp-5)' }}>
            {due > 0 ? `Place Order \u2014 Pay ${fmt(due)}` : 'Place Order \u2014 Covered by OI Money \u2713'}
          </Button>
          <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--amp-stone-400)', marginTop: 'var(--amp-sp-2)' }}>{'\uD83D\uDD12'} Secured by Razorpay</p>
          <div style={{ textAlign: 'center', marginTop: 'var(--amp-sp-3)', display: 'flex', justifyContent: 'center', gap: 'var(--amp-sp-4)' }}>
            <a href="#" style={{ fontSize: 11, color: 'var(--amp-stone-400)', textDecoration: 'none' }}>Ordering Guidelines</a>
            <a href="#" style={{ fontSize: 11, color: 'var(--amp-stone-400)', textDecoration: 'none' }}>Cancellation Policy</a>
          </div>
        </Card>
      </div>
    </div>
  );
};
