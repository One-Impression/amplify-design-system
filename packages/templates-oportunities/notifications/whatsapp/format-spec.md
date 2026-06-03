# Oportunities — WhatsApp Business Template Spec

Authoritative format for every WhatsApp message template submitted to the
WhatsApp Business API for the Oportunities WABA. Voice register follows the
locked `BRAND-DECISIONS.md`.

---

## Approval categories

Every template is one of these Meta WhatsApp categories:

| Category | When to use | Examples in this package |
|---|---|---|
| `UTILITY` | Transactional, post-action, expected | `signal-notification`, `brand-interest`, `payment-confirmation`, `follow-up` (within 24h window) |
| `MARKETING` | Promotional, broadcast, opt-in required | weekly digest broadcast (not in v1) |
| `AUTHENTICATION` | One-time codes (OTP) | Not used — Oportunities auth is OAuth not OTP-via-WhatsApp |

We default to `UTILITY` wherever defensible. Marketing templates require
24h re-engagement window and quality-rating risk.

---

## Variable placeholders

WhatsApp templates use positional placeholders **`{{1}}`, `{{2}}`, …** in the
order they appear in the template body. Each variable must:

1. Be **plain text** — no formatting, links, or emoji embedded in variables.
2. Be **non-empty** at send time (Meta rejects empty `{{n}}` substitutions).
3. Match the **example values** submitted in the template registration.

URLs go inside variables; the template's CTA button takes the URL as a
variable too (button type `URL` with dynamic suffix).

---

## Header / body / footer / buttons

Standard layout for our utility templates:

```
[Header]    — optional. Plain text only. 60 chars. Used for "Heads up —".
[Body]      — required. ≤ 1024 chars but we cap at ~280 for legibility.
[Footer]    — optional. ≤ 60 chars. We always set: "— Oportunities".
[Buttons]   — optional. Max 3. Mix of:
              - URL (with {{1}} suffix for tracked deep-link)
              - QUICK_REPLY (e.g. "Yes, interested")
              - PHONE_NUMBER (e.g. support line)
```

Forbidden in header/body:
- Multiple consecutive whitespace runs (Meta strips them, breaking layout).
- Newlines inside variables (Meta rejects).
- Emoji at the start of body (looks promo; flagged by Meta quality review).

---

## Voice register

### Tool-curious (`Heads up —`)
- Signal notifications (brand-side and creator-side)
- Onboarding / re-engagement nudges

### Direct-confident
- Payment confirmations
- Refund processed
- Payout blocked
- KYC required

---

## Template naming convention

Submit to Meta with names matching our internal slug:

```
oportunities_<event>_<lang>_v<N>
```

Examples:
- `oportunities_signal_notification_en_v1`
- `oportunities_brand_interest_en_v1`
- `oportunities_payment_confirmation_en_v1`

When we revise after approval, bump `v1` → `v2` — never edit in place.

---

## Currency & locale

- Currency always `₹`. Spell out only in voice prompts.
- Numbers comma-grouped Indian style (`1,00,000` not `100,000` for amounts ≥ 1 lakh; below that use `10,000`).
- Dates: `Jan 18` short, `18 January 2026` long. Never `01/18` (US-style ambiguity).

---

## Quality rating discipline

To keep our WABA in `GREEN` rating:

- Send only after **positive intent signal** (user signed up, paid, opted in).
- 24h re-engagement window respected — outside the window, only approved utility templates.
- Always include an opt-out cue in marketing templates (`Reply STOP to opt out`).
- Never use templates that mislead category — Meta will downgrade silently.

---

## Files in this directory

All template bodies are stored as `.txt` files for easy round-tripping with
Meta's template registration UI. JSON registration payloads can be generated
from these `.txt` files via the publishing script (deferred to publishing PR).

- `templates/signal-notification.txt` — brand-side: new signal alert
- `templates/brand-interest.txt` — creator-side: brand sent interest
- `templates/sample-message-draft.txt` — brand-to-creator outreach (AI-drafted, brand sends through their own WhatsApp)
- `templates/follow-up.txt` — auto follow-up after no creator response
- `templates/payment-confirmation.txt` — payment processed receipt
