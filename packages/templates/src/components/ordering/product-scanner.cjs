const { register } = require('../../registry.cjs');

register('product-scanner', (props, ctx) => {
  const data = ctx.data || {};
  const recentProducts = props.recentProducts || [
    { name: 'Glow Radiance Serum', brand: 'Luminara Beauty', price: '₹1,299', lastUsed: '3 days ago' },
    { name: 'HydraGlow Moisturizer', brand: 'Luminara Beauty', price: '₹899', lastUsed: '2 weeks ago' }
  ];
  const product = data.product || { name: 'Glow Radiance Serum', brand: 'Luminara Beauty', price: '₹1,299', description: 'Lightweight, fast-absorbing serum with Vitamin C and Hyaluronic Acid for radiant, hydrated skin.', categories: ['Beauty', 'Skincare'], instagram: '@luminara.beauty' };

  return `
<div class="amp-h2">${props.heading || 'What product are you promoting?'}</div>

${props.showRecent !== false ? `
<div style="margin:var(--amp-sp-4) 0">
  <p style="font-size:var(--amp-text-sm);color:var(--amp-text-muted);margin-bottom:var(--amp-sp-2)">Your recent products</p>
  <div style="display:flex;gap:var(--amp-sp-3)">
    ${recentProducts.map(p => `
    <div class="amp-card clickable" style="padding:var(--amp-sp-3) var(--amp-sp-4);display:flex;gap:var(--amp-sp-3);align-items:center;flex:1" onclick="selectRecentProduct(this)">
      <div style="width:40px;height:40px;border-radius:var(--amp-radius-md);background:linear-gradient(135deg,var(--amp-violet-100),var(--amp-violet-300));flex-shrink:0"></div>
      <div>
        <div style="font-size:var(--amp-text-sm);font-weight:600">${p.name}</div>
        <div style="font-size:var(--amp-text-xs);color:var(--amp-text-muted)">${p.brand} · ${p.lastUsed}</div>
      </div>
    </div>`).join('')}
  </div>
  <p style="font-size:var(--amp-text-xs);color:var(--amp-text-muted);margin-top:var(--amp-sp-2);text-align:center">— or add a new product —</p>
</div>` : ''}

<div style="position:relative;margin-top:var(--amp-sp-3)">
  <input class="amp-input" id="productUrl" placeholder="Paste your product URL here" style="padding-right:90px;height:52px;font-size:var(--amp-text-md)">
  <button onclick="scanProduct()" style="position:absolute;right:6px;top:50%;transform:translateY(-50%);padding:var(--amp-sp-2) var(--amp-sp-4);background:var(--amp-accent);color:#fff;border:none;border-radius:var(--amp-radius-md);font-size:var(--amp-text-sm);font-weight:600;cursor:pointer;font-family:var(--amp-font)">Scan ↗</button>
</div>

<div id="productArea" style="display:none"></div>
<div id="intelligenceScrape" style="display:none;margin-top:var(--amp-sp-4);text-align:center;padding:var(--amp-sp-8)">
  <div style="font-size:var(--amp-text-md);font-weight:600;color:var(--amp-text);margin-bottom:var(--amp-sp-4)" id="scrapeStep">Analyzing your product...</div>
  <div style="width:200px;height:4px;background:var(--amp-stone-200);border-radius:var(--amp-radius-full);margin:0 auto"><div id="scrapeBar" style="width:0%;height:100%;background:var(--amp-accent);border-radius:var(--amp-radius-full);transition:width .5s"></div></div>
</div>

<template id="productCardTemplate">
  <div class="amp-card" style="padding:var(--amp-sp-6);margin-top:var(--amp-sp-4);display:flex;gap:var(--amp-sp-5);align-items:flex-start">
    <div style="width:100px;height:100px;border-radius:var(--amp-radius-lg);background:linear-gradient(135deg,var(--amp-violet-100),var(--amp-violet-300));flex-shrink:0"></div>
    <div style="flex:1;display:flex;flex-direction:column;gap:var(--amp-sp-2)">
      <div style="display:flex;gap:var(--amp-sp-3)">
        <div style="flex:2"><label style="font-size:var(--amp-text-xs);color:var(--amp-text-muted)">Product Name</label><input class="amp-input" value="${product.name}" style="margin-top:2px"></div>
        <div style="flex:1"><label style="font-size:var(--amp-text-xs);color:var(--amp-text-muted)">Price</label><input class="amp-input" value="${product.price}" style="margin-top:2px"></div>
      </div>
      <div><label style="font-size:var(--amp-text-xs);color:var(--amp-text-muted)">Brand</label><input class="amp-input" value="${product.brand}" style="margin-top:2px"></div>
      <div><label style="font-size:var(--amp-text-xs);color:var(--amp-text-muted)">Description</label><textarea class="amp-input" rows="2" style="margin-top:2px">${product.description}</textarea></div>
      <div style="display:flex;flex-wrap:wrap;gap:var(--amp-sp-2);margin-top:var(--amp-sp-1)">
        ${product.categories.map(c => `<span class="amp-chip active">${c}</span>`).join('')}
        <span class="amp-chip" onclick="this.classList.toggle('active')">Health</span>
        <span class="amp-chip" onclick="this.classList.toggle('active')">Lifestyle</span>
      </div>
      <label style="display:flex;align-items:center;gap:var(--amp-sp-2);font-size:var(--amp-text-sm);color:var(--amp-text-secondary);cursor:pointer;margin-top:var(--amp-sp-1)"><input type="checkbox" checked id="shippingToggle"> Requires shipping</label>
    </div>
  </div>
</template>`;
});
