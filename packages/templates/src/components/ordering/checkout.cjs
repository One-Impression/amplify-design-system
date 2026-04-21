const { register } = require('../../registry.cjs');

register('checkout', (props, ctx) => {
  const wallet = ctx.data?.wallet || 12400;
  const total = props.total || 30000;
  const gst = Math.round(total * 0.18);
  const grandTotal = total + gst;
  const due = Math.max(0, grandTotal - wallet);

  return `
<div class="amp-two-col">
  <div>
    <div class="amp-card" style="padding:var(--amp-sp-6)">
      <div style="padding:var(--amp-sp-4) 0;border-bottom:1px solid var(--amp-stone-100)">
        <div style="display:flex;justify-content:space-between;margin-bottom:var(--amp-sp-3)"><div class="amp-h3">Goal & Product</div><span style="font-size:var(--amp-text-xs);color:var(--amp-accent);cursor:pointer" onclick="goToStep(1)">Edit</span></div>
        <div style="display:flex;gap:var(--amp-sp-3);align-items:center">
          <div style="width:48px;height:48px;border-radius:var(--amp-radius-md);background:linear-gradient(135deg,var(--amp-violet-100),var(--amp-violet-300));flex-shrink:0"></div>
          <div><div style="font-size:var(--amp-text-base);font-weight:600">Glow Radiance Serum</div><div style="font-size:var(--amp-text-xs);color:var(--amp-text-muted)">Luminara Beauty · ₹1,299 · 🎬 Content for Ads</div></div>
        </div>
      </div>
      <div style="padding:var(--amp-sp-4) 0;border-bottom:1px solid var(--amp-stone-100)">
        <div style="display:flex;justify-content:space-between;margin-bottom:var(--amp-sp-2)"><div class="amp-h3">Content & Budget</div><span style="font-size:var(--amp-text-xs);color:var(--amp-accent);cursor:pointer" onclick="goToStep(3)">Edit</span></div>
        <div class="amp-price-row"><span>Type</span><span style="color:var(--amp-text);font-weight:500">AI Video — Growth Package</span></div>
        <div class="amp-price-row"><span>Videos</span><span style="color:var(--amp-text);font-weight:500">15 videos · 24s · 9:16 vertical</span></div>
      </div>
      <div style="padding:var(--amp-sp-4) 0">
        <div style="display:flex;justify-content:space-between;margin-bottom:var(--amp-sp-2)"><div class="amp-h3">Brief & Scripts</div><span style="font-size:var(--amp-text-xs);color:var(--amp-accent);cursor:pointer" onclick="goToStep(4)">Edit</span></div>
        <div class="amp-price-row"><span>Concepts</span><span style="color:var(--amp-text);font-weight:500">Problem → Solution, Trend Story</span></div>
        <div class="amp-price-row"><span>Scripts</span><span style="color:var(--amp-text);font-weight:500">2 samples (edit after payment)</span></div>
      </div>
    </div>
  </div>

  <div>
    <div class="amp-card" style="padding:var(--amp-sp-6);position:sticky;top:100px">
      <div class="amp-h2" style="margin-bottom:var(--amp-sp-5)">Payment</div>

      <div style="margin-bottom:var(--amp-sp-4)">
        <div style="font-size:var(--amp-text-sm);font-weight:600;margin-bottom:var(--amp-sp-2)">Billing</div>
        <div class="amp-card" style="padding:var(--amp-sp-3) var(--amp-sp-4);background:var(--amp-green-50);border-color:var(--amp-green-600)">
          <div style="font-size:var(--amp-text-sm);color:var(--amp-green-600);font-weight:600">✓ We found your billing details</div>
          <div style="font-size:var(--amp-text-xs);color:var(--amp-text-muted);margin-top:2px">Luminara Beauty Pvt Ltd · GST: 27AALCL1234F1Z5 · Mumbai</div>
          <a href="#" style="font-size:var(--amp-text-xs);color:var(--amp-accent);text-decoration:none">Change →</a>
        </div>
      </div>

      <div style="display:flex;flex-direction:column;gap:var(--amp-sp-2)">
        <div class="amp-price-row"><span>Campaign cost</span><span>₹${total.toLocaleString('en-IN')}</span></div>
        <div class="amp-price-row"><span>GST (18%)</span><span>₹${gst.toLocaleString('en-IN')}</span></div>
        <div class="amp-price-row amp-price-total"><span>Total</span><span>₹${grandTotal.toLocaleString('en-IN')}</span></div>
        <div class="amp-price-row amp-price-credit"><span>OI Money</span><span>−₹${wallet.toLocaleString('en-IN')}</span></div>
        <div class="amp-price-row amp-price-due"><span>Amount Due</span><span>₹${due.toLocaleString('en-IN')}</span></div>
      </div>

      <div class="amp-tabs">
        <button class="amp-tab active" onclick="switchTab(this,0)">UPI</button>
        <button class="amp-tab" onclick="switchTab(this,1)">Card</button>
        <button class="amp-tab" onclick="switchTab(this,2)">Net Banking</button>
      </div>
      <div id="payTab0"><input class="amp-input" placeholder="Enter UPI ID (e.g., name@upi)"><p style="font-size:var(--amp-text-xs);color:var(--amp-stone-400);text-align:center;margin-top:var(--amp-sp-1)">Or scan QR on next screen</p></div>
      <div id="payTab1" style="display:none"><input class="amp-input" placeholder="Card Number" style="margin-bottom:var(--amp-sp-2)"><div style="display:flex;gap:var(--amp-sp-2)"><input class="amp-input" placeholder="MM/YY"><input class="amp-input" placeholder="CVV" style="max-width:100px"></div></div>
      <div id="payTab2" style="display:none"><select class="amp-input"><option>Select your bank</option><option>HDFC Bank</option><option>ICICI Bank</option><option>SBI</option><option>Axis Bank</option></select></div>

      <button class="amp-btn amp-btn-primary amp-btn-lg amp-btn-full" style="margin-top:var(--amp-sp-5)" onclick="placeOrder()">Place Order${due > 0 ? ' — Pay ₹' + due.toLocaleString('en-IN') : ' — Covered by OI Money ✓'}</button>
      <p style="text-align:center;font-size:11px;color:var(--amp-stone-400);margin-top:var(--amp-sp-2)">🔒 Secured by Razorpay</p>
      <div style="text-align:center;margin-top:var(--amp-sp-3);display:flex;justify-content:center;gap:var(--amp-sp-4)"><a href="#" style="font-size:11px;color:var(--amp-stone-400);text-decoration:none">Ordering Guidelines</a><a href="#" style="font-size:11px;color:var(--amp-stone-400);text-decoration:none">Cancellation Policy</a></div>
    </div>
  </div>
</div>`;
});
