const { register } = require('../../registry.cjs');

register('brief-editor', (props, ctx) => {
  const concepts = props.concepts || ['Problem → Solution', 'Trend Story', 'Tutorial', 'Review', 'Behind-the-Scenes', 'Unboxing', 'Demo', 'Day in Life'];
  const defaultSelected = props.selectedConcepts || [0, 1];
  const talkingPoints = props.talkingPoints || ['Lightweight, non-greasy formula', 'Visible results in 7 days'];
  const avoidItems = props.avoidItems || ["Don't compare to competitor brands"];
  const audiences = props.audiences || ['Women 25-35', 'Skincare enthusiasts', 'Instagram-active'];

  return `
<div class="amp-h2">Content Brief</div>
<p style="font-size:var(--amp-text-xs);color:var(--amp-text-muted);margin-bottom:var(--amp-sp-4)">Auto-configured based on your goal and product. Customize as needed.</p>

<div style="margin-bottom:var(--amp-sp-5)">
  <div class="amp-h3">Script Concepts</div>
  <p style="font-size:var(--amp-text-xs);color:var(--amp-stone-400);margin:var(--amp-sp-1) 0 var(--amp-sp-2)">Click to toggle — we'll use these to generate your scripts</p>
  <div style="display:flex;flex-wrap:wrap;gap:var(--amp-sp-2)">
    ${concepts.map((c, i) => `<span class="amp-chip${defaultSelected.includes(i) ? ' active' : ''}" onclick="this.classList.toggle('active')">${c}</span>`).join('')}
  </div>
</div>

<div style="margin-bottom:var(--amp-sp-5)">
  <div class="amp-h3">Target Audience</div>
  <p style="font-size:var(--amp-text-xs);color:var(--amp-stone-400);margin:var(--amp-sp-1) 0 var(--amp-sp-2)">Auto-suggested from your product — edit as needed</p>
  <div id="audienceTags" style="display:flex;flex-wrap:wrap;gap:var(--amp-sp-2)">
    ${audiences.map(a => `<span class="amp-chip active" onclick="this.remove()">${a} ×</span>`).join('')}
  </div>
  <input class="amp-input" placeholder="Add audience segment + Enter" style="margin-top:var(--amp-sp-2)" onkeydown="if(event.key==='Enter'&&this.value){addAudienceTag(this.value);this.value=''}">
</div>

<div style="margin-bottom:var(--amp-sp-5)">
  <div class="amp-h3">Key Talking Points</div>
  <div id="talkingPoints">
    ${talkingPoints.map(t => `<div style="display:flex;align-items:center;gap:var(--amp-sp-2);margin-bottom:var(--amp-sp-1)"><span style="flex:1;font-size:var(--amp-text-sm);color:var(--amp-text-secondary);background:var(--amp-stone-50);padding:var(--amp-sp-2) var(--amp-sp-3);border-radius:var(--amp-radius-md)">${t}</span><button onclick="this.parentElement.remove()" style="background:none;border:none;color:var(--amp-stone-400);cursor:pointer;font-size:16px">×</button></div>`).join('')}
  </div>
  <input class="amp-input" placeholder="Add a talking point + Enter" style="margin-top:var(--amp-sp-1)" onkeydown="if(event.key==='Enter'&&this.value){addListItem('talkingPoints',this.value);this.value=''}">
</div>

<div style="margin-bottom:var(--amp-sp-5)">
  <div class="amp-h3">Things to Avoid</div>
  <div id="avoidList">
    ${avoidItems.map(a => `<div style="display:flex;align-items:center;gap:var(--amp-sp-2);margin-bottom:var(--amp-sp-1)"><span style="flex:1;font-size:var(--amp-text-sm);color:var(--amp-text-secondary);background:var(--amp-stone-50);padding:var(--amp-sp-2) var(--amp-sp-3);border-radius:var(--amp-radius-md)">${a}</span><button onclick="this.parentElement.remove()" style="background:none;border:none;color:var(--amp-stone-400);cursor:pointer;font-size:16px">×</button></div>`).join('')}
  </div>
  <input class="amp-input" placeholder="Add item + Enter" style="margin-top:var(--amp-sp-1)" onkeydown="if(event.key==='Enter'&&this.value){addListItem('avoidList',this.value);this.value=''}">
</div>

<div>
  <div class="amp-h3">Video Length</div>
  <div style="display:flex;gap:var(--amp-sp-1);margin-top:var(--amp-sp-2)">
    <button class="amp-chip" onclick="selectLength(this)">15s</button>
    <button class="amp-chip active" onclick="selectLength(this)">24s</button>
    <button class="amp-chip" onclick="selectLength(this)">30s</button>
    <button class="amp-chip" onclick="selectLength(this)">45s</button>
    <button class="amp-chip" onclick="selectLength(this)">60s</button>
  </div>
  <p style="font-size:var(--amp-text-xs);color:var(--amp-stone-400);margin-top:var(--amp-sp-1)">24s is optimal for Instagram Reels and YouTube Shorts</p>
</div>`;
});
