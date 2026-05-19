# Oportunities — Push Notification Format Spec

Authoritative format and voice rules for every push notification emitted by
Oportunities (iOS / Android). Voice register follows the locked
`BRAND-DECISIONS.md` in `@amplify-ai/brand-oportunities`.

---

## Field-level limits

| Field | Limit | Notes |
|---|---|---|
| Title | 40 chars (visible across iOS lock-screen + Android collapsed) | Prefix conventions below |
| Body | 100 chars | One sentence. No emoji at end. |
| Action button label | 14 chars | Verb-first, e.g. `View`, `Unlock`, `Open` |
| Category / `apns-category` | snake_case event slug | e.g. `INTENT_NEW`, `PAYMENT_OK`, `CREDIT_LOW` |
| Sound | `default` for action moments, `none` for digests | Never custom sound files |

---

## Title prefix conventions

| Prefix | Voice | Use |
|---|---|---|
| `Heads up —` | Tool-curious | New signal, weekly digest, marketing nudge, onboarding |
| `✓ ` (U+2713 + space) | Direct-confident | Payment success, KYC approved, unlock confirmed |
| (no prefix) | Direct-confident | Error, low credit, payout blocked |

Never use `!`, `🚨`, `🔔` in title text. Reserve emoji for body only when it is a
brand mark (apricot dot `·`) — and even then prefer a typographic separator.

---

## Voice register — locked from `BRAND-DECISIONS.md`

### Direct-confident (action moments)
- Payment processed / failed
- Credits low / depleted
- KYC blocked
- Unlock complete
- Brief sent

Rules: verb-first, no hedging, no filler, no exclamation marks.

### Tool-curious (`Heads up —`)
- New intent signal landed
- Weekly digest ready
- Onboarding day-1 / day-3
- Marketing nudges (upgrade, feature launch)

Rules: warm but not cute. Frame as observation, not demand. One soft question
per surface max — but not in push (push is glanceable, not a conversation).

---

## iOS (APNs) payload shape

```json
{
  "aps": {
    "alert": {
      "title": "Heads up —",
      "body": "Komal Pandey is going to Bali Jan 18. AI fit 94% with Mamaearth.",
      "subtitle": null
    },
    "sound": "default",
    "badge": 1,
    "category": "INTENT_NEW",
    "thread-id": "intent",
    "mutable-content": 1
  },
  "data": {
    "deeplink": "oportunities://signal/sig_01HXYZ",
    "signal_id": "sig_01HXYZ",
    "fit_score": 94
  }
}
```

`category` must be registered on the iOS client with the matching action button
labels (`UNNotificationAction`). Action labels must satisfy the 14-char limit.

### Rich notifications (iOS)

Use `mutable-content: 1` and supply a creator avatar via the Notification
Service Extension when the signal has a creator photo. Apricot border applied
client-side at extension level — do not bake into image.

---

## Android (FCM) payload shape

```json
{
  "message": {
    "notification": {
      "title": "Heads up —",
      "body": "Komal Pandey is going to Bali Jan 18. AI fit 94% with Mamaearth."
    },
    "android": {
      "priority": "HIGH",
      "notification": {
        "channel_id": "intent_signals",
        "color": "#E68F47",
        "icon": "ic_notification_op",
        "click_action": "INTENT_NEW"
      }
    },
    "data": {
      "deeplink": "oportunities://signal/sig_01HXYZ",
      "signal_id": "sig_01HXYZ",
      "fit_score": "94"
    }
  }
}
```

Channels (required by Android 8+):
- `intent_signals` — high priority, sound, vibration
- `account_alerts` — high priority (payments, credit, KYC)
- `digest` — low priority, no sound, no vibration
- `marketing` — low priority, user-opt-in default off

Accent color `#E68F47` (apricot) must match `tokens-oportunities/color.brand.accent`.

---

## Rich notification specs

| Field | Width × Height | Format |
|---|---|---|
| iOS large image (NSE) | 1038 × 1038 (square) or 1038 × 692 (3:2) | PNG, ≤ 10 MB |
| Android big-picture | 1024 × 512 (2:1) | JPG/PNG, ≤ 1 MB |
| Avatar (both) | 256 × 256 | Cropped circular client-side |

Image source: signed S3 URL from Oportunities `notif-assets` bucket, expiring
in 24h. Never embed PII in the URL.

---

## Action buttons (14-char labels)

Approved action labels:
- `View` — open the signal / brief
- `Unlock` — spend credits to unlock contact
- `Reply` — open thread in WhatsApp bridge
- `Snooze 1h` — postpone (max 24h chain)
- `Open` — fallback generic
- `Top up` — credit top-up flow
- `Pay now` — outstanding invoice

Forbidden: `Dismiss` (that's the system gesture), `OK`, `Cancel`, `Got it`.

---

## Frequency caps

| Channel | Daily cap | Quiet hours (user-local) |
|---|---|---|
| `intent_signals` | 6 | 22:00 – 08:00 |
| `account_alerts` | unlimited | none (always-deliver) |
| `digest` | 1 | sends at 09:00 user-local Monday |
| `marketing` | 2 | 22:00 – 08:00, weekends off |

Exceeded caps roll into the next digest. Always-deliver channels bypass the cap
but still respect Android channel priority for non-critical surfaces.

---

## Localisation

v1 ships English-only. Hindi + regional language are deferred to v2 — when
added, the brand prefix `Heads up —` localises to a culturally-equivalent
phrase (TBD with localisation review) but the apricot accent and `✓` remain.

Currency is always `₹` (no fallback to `Rs.` or `INR `).
