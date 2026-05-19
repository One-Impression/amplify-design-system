# Oportunities — Slide Deck Templates

Self-contained 16:9 (1920 × 1080) HTML slide templates for pitch, sales, and
internal decks. Each file is standalone — open it in a browser, print to PDF,
or screenshot for use in Pitch / Tome / Google Slides / Keynote.

All slides follow the locked Oportunities brand:
- **Wordmark**: Geist 600, `-0.04em` tracking, lowercase, trailing apricot period
- **Surface**: Cream `#FDF8F3` (light slides) or Ink `#0F0D0B` (closing only)
- **Accent**: Apricot `#E89252` (used sparingly — only for emphasis, dots, rules, headers)
- **Type**: Geist (system fallback chain), Charter serif (italic, for quotes only)
- **Single-P spelling**: `oportunities.` — never correct to "opportunities"

---

## Files

| File | Purpose | Use this when |
|---|---|---|
| `cover.html` | Title slide with gradient backdrop | First slide of any deck |
| `section-divider.html` | Section header with apricot underline | Between major sections (2-5 per deck) |
| `content-slide.html` | Standard bullets + sidebar callout | Default for most content slides |
| `chart-slide.html` | Bar chart + insight callout | Data slides (traction, market sizing, growth) |
| `quote-slide.html` | Pull-quote in serif italic | Customer voices, founder vision |
| `comparison-slide.html` | Before / after 2-column | Status quo vs solution; old vs new |
| `team-slide.html` | Avatar grid (4-up) | Team intro |
| `closing.html` | Dark "Thank you." with contact | Always last slide |

---

## Build a full deck (recommended order)

```
1. cover.html
2. section-divider.html         "The moment"
3. content-slide.html           "Why now"
4. comparison-slide.html        "Before / after outreach"
5. chart-slide.html             "Market size"
6. section-divider.html         "What we built"
7. content-slide.html           "How it works"
8. content-slide.html           "Product principles"
9. section-divider.html         "Traction"
10. chart-slide.html            "Signals per week"
11. quote-slide.html            "Customer voice"
12. section-divider.html        "Team & ask"
13. team-slide.html
14. content-slide.html          "What we're raising"
15. closing.html
```

Edit copy directly inside each file. Slide number (`12 / 24`) is in the top bar
of every slide — keep it in sync if you add/remove slides.

---

## Print to PDF

**Chrome / Edge (recommended):**
1. Open the HTML file in Chrome
2. ⌘P / Ctrl-P
3. Destination: **Save as PDF**
4. Paper size: **Custom** — width `20 in` (1920px ÷ 96), height `11.25 in` (1080px ÷ 96)
5. Margins: **None**
6. Scale: **100%** (do not "fit")
7. **Background graphics: ON** (otherwise cream + apricot strip out)

**Safari:**
- ⌘P, choose Paper Size **Manage Custom Sizes** → 20 in × 11.25 in, margins 0.
- "Background printing" is on by default.

**Combine PDFs:** Use macOS Preview (drag pages from each PDF into one), or
`pdftk *.pdf cat output deck.pdf` (CLI), or any PDF merger.

---

## Import to deck tools

### Pitch.com
- **Best path**: Export each slide as a 1920 × 1080 PNG (Chrome devtools full-page screenshot), import as image slide. Pitch does not honour custom HTML; treat these as the visual reference.
- **Or**: rebuild manually in Pitch using these screenshots as the spec — colours, fonts, spacing come from the slides directly.

### Tome
- Same as Pitch — image-import is the working path. Tome's AI deck builder will respect uploaded brand colours; load apricot `#E89252` and cream `#FDF8F3` as the brand palette first.

### Google Slides / Keynote / PowerPoint
- **Quickest**: print the HTML to a single PDF, then in Slides/Keynote/PPT use "Insert > Image" for each page. Resolution stays sharp because the source is vector text-on-cream.
- **Editable**: Recreate manually using these as the visual reference. Geist is available in Google Slides via the font picker; in Keynote install Geist from Vercel's font CDN.

---

## Tokens reference

The slides hard-code values from `@amplify-ai/tokens-oportunities`. If those
tokens change, update each HTML file's `:root` block to match. Authoritative
values right now:

```css
--cream:      #FDF8F3;   /* tokens-oportunities.surface.background */
--ink:        #0F0D0B;   /* tokens-oportunities.text.primary */
--apricot:    #E89252;   /* tokens-oportunities.color.brand.accent */
--apricot-2:  #F0A668;   /* tokens-oportunities.color.brand.accent-dark-surface */
--terracotta: #D87B6E;   /* tokens-oportunities.color.brand.terracotta */
--purple:     #6B4FA0;   /* tokens-oportunities.color.brand.purple */
```

---

## What these are NOT

- **Not a runtime templating system.** The deck slides are static HTML
  intended for human editing. No `{{variable}}` substitution layer — variables
  are for the notification templates.
- **Not the marketing landing page templates.** Marketing pages live in
  `packages/templates-oportunities/marketing/`.
- **Not Pixel-generated.** These were hand-crafted to lock the visual
  language. Pixel can generate variants once we have a CDN distribution flow.
