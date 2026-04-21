const { register } = require('../../registry.cjs');

register('content-type', (props, ctx) => {
  return `
<div class="amp-h2">${props.heading || 'How should we create your content?'}</div>
<p class="amp-sub">${props.subheading || 'AI is our recommended default — trained on 50,000+ campaigns'}</p>

<div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--amp-sp-5);margin-top:var(--amp-sp-5)">
  <div class="amp-card clickable selected" id="cardAi" onclick="selectContentType('ai')" style="padding:var(--amp-sp-6);position:relative">
    <span class="amp-badge amp-badge-green" style="position:absolute;top:var(--amp-sp-4);right:var(--amp-sp-4)">Recommended</span>
    <div class="amp-h3">⚡ AI-Generated Video</div>
    <ul style="list-style:none;margin:var(--amp-sp-4) 0">
      <li style="display:flex;gap:var(--amp-sp-2);font-size:var(--amp-text-sm);color:var(--amp-text-secondary);padding:var(--amp-sp-1) 0"><span style="color:var(--amp-green-600);font-weight:700;flex-shrink:0">✓</span>Ready in 24 hours</li>
      <li style="display:flex;gap:var(--amp-sp-2);font-size:var(--amp-text-sm);color:var(--amp-text-secondary);padding:var(--amp-sp-1) 0"><span style="color:var(--amp-green-600);font-weight:700;flex-shrink:0">✓</span>Unlimited revisions included</li>
      <li style="display:flex;gap:var(--amp-sp-2);font-size:var(--amp-text-sm);color:var(--amp-text-secondary);padding:var(--amp-sp-1) 0"><span style="color:var(--amp-green-600);font-weight:700;flex-shrink:0">✓</span>Trained on 50,000+ campaigns</li>
      <li style="display:flex;gap:var(--amp-sp-2);font-size:var(--amp-text-sm);color:var(--amp-text-secondary);padding:var(--amp-sp-1) 0"><span style="color:var(--amp-green-600);font-weight:700;flex-shrink:0">✓</span>Multiple variations from one brief</li>
    </ul>
    <div style="background:var(--amp-stone-50);border-radius:10px;padding:var(--amp-sp-3);margin-bottom:var(--amp-sp-4)">
      <div style="font-size:10px;font-weight:600;color:var(--amp-stone-400);text-transform:uppercase;letter-spacing:.05em;margin-bottom:var(--amp-sp-1)">Best for</div>
      <p style="font-size:var(--amp-text-sm);color:var(--amp-text-secondary)">Performance marketing, A/B testing, fast creative iteration</p>
    </div>
    <div style="font-size:var(--amp-text-md);font-weight:700;color:var(--amp-violet-700);margin-bottom:var(--amp-sp-4)">From ₹2,000/video</div>
    <button class="amp-btn amp-btn-primary amp-btn-full" id="btnAi">Selected ✓</button>
  </div>

  <div class="amp-card clickable" id="cardHuman" onclick="selectContentType('human')" style="padding:var(--amp-sp-6);position:relative">
    <div class="amp-h3">★ Human Creator Content</div>
    <ul style="list-style:none;margin:var(--amp-sp-4) 0">
      <li style="display:flex;gap:var(--amp-sp-2);font-size:var(--amp-text-sm);color:var(--amp-text-secondary);padding:var(--amp-sp-1) 0"><span style="color:var(--amp-green-600);font-weight:700;flex-shrink:0">✓</span>Authentic & relatable content</li>
      <li style="display:flex;gap:var(--amp-sp-2);font-size:var(--amp-text-sm);color:var(--amp-text-secondary);padding:var(--amp-sp-1) 0"><span style="color:var(--amp-green-600);font-weight:700;flex-shrink:0">✓</span>Real audience reach & engagement</li>
      <li style="display:flex;gap:var(--amp-sp-2);font-size:var(--amp-text-sm);color:var(--amp-text-secondary);padding:var(--amp-sp-1) 0"><span style="color:var(--amp-green-600);font-weight:700;flex-shrink:0">✓</span>Posted on creator's own profile</li>
      <li style="display:flex;gap:var(--amp-sp-2);font-size:var(--amp-text-sm);color:var(--amp-text-secondary);padding:var(--amp-sp-1) 0"><span style="color:var(--amp-green-600);font-weight:700;flex-shrink:0">✓</span>Genuine brand endorsement</li>
    </ul>
    <div style="background:var(--amp-stone-50);border-radius:10px;padding:var(--amp-sp-3);margin-bottom:var(--amp-sp-4)">
      <div style="font-size:10px;font-weight:600;color:var(--amp-stone-400);text-transform:uppercase;letter-spacing:.05em;margin-bottom:var(--amp-sp-1)">Best for</div>
      <p style="font-size:var(--amp-text-sm);color:var(--amp-text-secondary)">Brand trust, organic social proof, community building</p>
    </div>
    <div style="font-size:var(--amp-text-md);font-weight:700;color:var(--amp-violet-700);margin-bottom:var(--amp-sp-4)">From ₹5,000/creator</div>
    <button class="amp-btn amp-btn-outline amp-btn-full" id="btnHuman">Select Human Creator</button>
  </div>
</div>

<div id="humanOptions" style="display:none;margin-top:var(--amp-sp-5)">
  <div class="amp-h3">Creator preferences</div>
  <p style="font-size:var(--amp-text-xs);color:var(--amp-text-muted);margin-bottom:var(--amp-sp-3)">Defaults to Flexi (we pick the best mix). Customize below if needed.</p>
  <details style="margin-top:var(--amp-sp-2)">
    <summary style="cursor:pointer;font-size:var(--amp-text-sm);font-weight:600;color:var(--amp-accent)">Customize creator preferences ▸</summary>
    <div style="margin-top:var(--amp-sp-3);display:flex;flex-direction:column;gap:var(--amp-sp-3)">
      <div><label style="font-size:var(--amp-text-xs);color:var(--amp-text-muted)">Size</label><div style="display:flex;gap:var(--amp-sp-2);margin-top:var(--amp-sp-1)"><span class="amp-chip active">Flexi (Recommended)</span><span class="amp-chip" onclick="this.classList.toggle('active')">Micro 5K-50K</span><span class="amp-chip" onclick="this.classList.toggle('active')">Mid 50K-100K</span><span class="amp-chip" onclick="this.classList.toggle('active')">Large 100K+</span></div></div>
      <div><label style="font-size:var(--amp-text-xs);color:var(--amp-text-muted)">Gender</label><div style="display:flex;gap:var(--amp-sp-2);margin-top:var(--amp-sp-1)"><span class="amp-chip active">All</span><span class="amp-chip" onclick="this.classList.toggle('active')">Male</span><span class="amp-chip" onclick="this.classList.toggle('active')">Female</span></div></div>
      <div><label style="font-size:var(--amp-text-xs);color:var(--amp-text-muted)">Language</label><div style="display:flex;gap:var(--amp-sp-2);margin-top:var(--amp-sp-1)"><span class="amp-chip active">Hindi</span><span class="amp-chip active">English</span><span class="amp-chip" onclick="this.classList.toggle('active')">Tamil</span><span class="amp-chip" onclick="this.classList.toggle('active')">Telugu</span></div></div>
    </div>
  </details>
</div>`;
});
