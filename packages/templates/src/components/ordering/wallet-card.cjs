const { register } = require('../../registry.cjs');

register('wallet-card', (props, ctx) => {
  const balance = ctx.data?.wallet || 12400;
  const total = props.campaignTotal || 30000;
  const coverage = Math.min(100, Math.round(balance / (total * 1.18) * 100));

  return `
<div class="amp-wallet" style="margin-top:var(--amp-sp-5)">
  <div style="display:flex;align-items:center;gap:var(--amp-sp-2)">💰 <span style="font-size:var(--amp-text-base);font-weight:600;color:var(--amp-violet-700)">₹${balance.toLocaleString('en-IN')} available in OI Money</span></div>
  <p style="font-size:var(--amp-text-sm);color:var(--amp-accent);margin-top:var(--amp-sp-1)">Auto-applied at checkout — covers ~${coverage}% of this campaign</p>
  <div class="amp-wallet-bar"><div class="amp-wallet-fill" style="width:${coverage}%"></div></div>
</div>`;
});
