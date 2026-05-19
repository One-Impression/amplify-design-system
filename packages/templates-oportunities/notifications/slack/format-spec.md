# Oportunities — Slack Notification Format Spec

Format and voice rules for Slack notifications emitted by the Oportunities Slack
app (incoming webhook + slash command + Events API). Voice register follows the
locked `BRAND-DECISIONS.md`.

---

## When Slack is the right channel

Slack is opted-in by a brand admin and routes a subset of the user's mobile-push
events to a chosen channel. Default routing:

| Event | Default Slack route | Voice |
|---|---|---|
| New intent signal (above fit threshold) | yes — team channel | Tool-curious |
| Brand interest (creator-side) | no — creator-app push only | n/a |
| Weekly digest | yes — team channel | Tool-curious |
| Payment / billing alert | yes — admin-only DM | Direct-confident |
| Credit low | yes — admin-only DM | Direct-confident |
| KYC / payout block | yes — admin-only DM | Direct-confident |

Slack never receives a notification that the user has not also seen on push or
email — Slack is a fan-out, not the only delivery.

---

## Block Kit structure (every message)

Every Slack message uses the [Block Kit](https://api.slack.com/block-kit)
schema. We standardise on this 5-block skeleton:

1. **Header block** — emoji + short title. Use `🔔` (bell) for new signals, `✓`
   for confirmations, `⚠` (warning sign) for action-required alerts. No `🚨`.
2. **Section block** — primary content (creator name, amount, summary).
3. **Section block — fields[]** — key/value pairs (fit score, destination, dates).
4. **Actions block** — 1–2 buttons (`View`, `Unlock`, `Top up`).
5. **Context block** — apricot dot + `oportunities.` wordmark + timestamp.

---

## Attachment color (apricot accent)

When using legacy `attachments` (e.g. for IFTTT-style integrations), the
attachment `color` field must be **`#E68F47`** (apricot). This matches
`tokens-oportunities/color.brand.accent`.

In modern Block Kit messages, accent is conveyed via the `🍑`-adjacent
context block — Slack does not yet support per-block color on free workspaces.

---

## Voice register

### Tool-curious
- New signal: `🔔 New intent signal`
- Weekly digest: `🔔 Your weekly digest is in`
- Onboarding: `🔔 First signals are live`

Body lines may use a soft cue (`We thought you'd want to see this`), but
**never** include an exclamation mark in the body.

### Direct-confident
- Payment: `✓ Payment processed` / `Payment failed`
- Credit: `Low credits — 5 left`
- Payout: `Payout blocked — bank IFSC invalid`

Body lines verb-first, declarative, no hedging.

---

## Field-level limits

| Field | Limit |
|---|---|
| Header text | 150 chars (Slack hard limit) but keep ≤ 60 for mobile |
| Section text (mrkdwn) | 3,000 chars; keep ≤ 200 for readability |
| Button text | 30 chars (Slack hard limit) but keep ≤ 14 to match push parity |
| Fields[] entries | 10 max; use 2-column grid (2, 4, or 6 entries) |
| Context elements | 10 max; we use 3 (apricot dot, wordmark, timestamp) |

---

## Markdown rules (mrkdwn dialect)

- Bold via `*asterisks*` (Slack mrkdwn, **not** standard markdown).
- Italics via `_underscores_`.
- Links via `<https://url|text>`.
- Currency rendering: `*₹10,000*` — bold the amount, never the unit.
- Dates: format as `Jan 18` for short, `Jan 18 – 25, 2026` for ranges.
- Never use headings (`#`). Use header block instead.
- Never use bullet characters (`•`, `-`). Use fields[] instead.

---

## Channel naming

When the app provisions or suggests channels:

| Purpose | Suggested channel | Description |
|---|---|---|
| All signals | `#oportunities` | Default firehose |
| High-priority | `#oportunities-priority` | Fit score ≥ 90 only |
| Billing | DM to admin | Never a public channel |

---

## Example skeletons

See `examples/` for the four required payloads:
- `new-signal.json`
- `weekly-digest.json`
- `brand-interest.json` (legacy support — most brand-interest goes via creator-app push, this template is for the brand-side mirror)
- `payment-alert.json`
