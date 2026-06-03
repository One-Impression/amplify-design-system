# Oportunities — Business Card Templates

Filled team-role business cards for **oportunities**. Each template is a
two-sided card stacked vertically in a single SVG (front on top, back below the
dashed guide). Replace `{First Last}` / `{first@oportunities.in}` /
`{+91 98XXXX XX12}` placeholders before sending to print.

## Roles included

| File | Role |
|------|------|
| `ceo.svg` | Chief Executive Officer — filled for Apaksh Gupta |
| `cto.svg` | Chief Technology Officer |
| `cdo.svg` | Chief Design Officer |
| `coo.svg` | Chief Operating Officer |
| `engineer.svg` | Software Engineer |
| `designer.svg` | Product Designer |
| `sales.svg` | Brand Partnerships |
| `support.svg` | Customer Success |
| `template-blank.svg` | Empty template — fill role + contact yourself |

## Print specs

| Property | Value |
|---|---|
| Trim size | **89 × 54 mm** (standard India business card) |
| Bleed size | **92 × 57 mm** (3 mm bleed each edge) |
| Safe area | inset **3 mm** from trim on all sides — keep text / logo inside this |
| Resolution | **300 DPI** — viewBox is 1051 × 638 px per side at 300 DPI |
| Combined viewBox | 1051 × 1276 (front + back stacked, separated by dashed guide) |
| Colour mode | RGB in source. Convert to CMYK before sending to printer. Apricot `#E68F47` ≈ `0 / 50 / 80 / 5` CMYK. |
| Stock | 350 GSM matte uncoated recommended (warmth of apricot prints best on uncoated) |
| Finish | Matte; spot UV on the apricot period is optional but on-brand |

## Brand rules (do not break)

- Wordmark is always **"oportunities."** — single-P, lowercase, trailing apricot period.
- Wordmark colour is `#0F0D0B`. Apricot period is `#E68F47`.
- Body label colour is `#7B5BFF` (signature purple).
- Background is cream `#FDF8F3`.
- Typeface is **Geist** (weights 400/500/600). Fall back to Inter if Geist is unavailable on the press.
- Mono labels use **Geist Mono** / JetBrains Mono.
- Phone format: `+91 98XXXX XX12` (Indian 10-digit, grouped as 5-2-3 with leading +91).
- Location is always **Mumbai · India**.

## How to use

1. Open the role SVG you need in a vector editor (Figma, Illustrator, Affinity).
2. Replace each `{placeholder}` with the real name / email / phone.
3. Export each side separately:
   - **Front** = top half (`0,0,1051,638`)
   - **Back** = bottom half (`0,638,1051,638`)
4. Export at 300 DPI as PDF/X-1a or print-ready PNG with 3 mm bleed.
5. Send to printer as a paired pair (front + back).

## Notes

- The dashed guide between front and back is a **non-printing** layout reference. Remove or hide it before exporting to print.
- The large apricot period on the back is the brand mnemonic — keep it, do not crop.
- Never outline, drop-shadow, or scale the period independently from the wordmark on the front.
