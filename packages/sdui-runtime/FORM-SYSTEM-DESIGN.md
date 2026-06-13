# SDUI Form & Submission System — Design

> Status: **built + verified on-device in the playground; pending SDK promotion.**
> Source of truth for the form-state + validation + submission feature (plus the
> UI/token consistency + phone country-picker built on top). Authored locally
> (Zenith/brief-wiki unavailable). Sections 1–9 are the original design (the
> contract); **§10 records what actually shipped** and the gating follow-ups.
>
> ⚠️ **Not merge-ready as-is** — the `submit` action depends on an SDK change
> that currently lives only as a local `node_modules` patch (see §8). A
> `amplify-schemas` PR must land first.

---

## 1. Context & motivation

The SDUI runtime renders server-driven forms (`creator.snippet.form` + the input
snippets: `input`, `phone_number_input`, `toggle_input`, `single_select_input`,
`multi_select_input`, `upload_file`). Two things were broken / missing:

1. **A submit button outside the form can't submit it.** A real form often has a
   **pinned footer** (or a button in a bottom sheet) that must trigger the form's
   submission — but that button lives outside the form's subtree.
2. **Inputs don't collect their values.** The current input renderers ignore the
   typed text entirely (`handleChange` just dispatches `on_change`); nothing is
   stored, so even a nested submit button would POST an empty body.

There was also no validation, and no way to gate submission on validity.

### Why not just match the legacy app?

The legacy app (`oportunities-creator-app/src/sdui`) already solved decoupled
submit, and it's the better of the two existing approaches — but it isn't the
ceiling:

- **Legacy:** one `FormProvider` per **screen** (`SduiScreen` wraps the whole
  tree). Fields register by `field_id`; a `submit` **action** reads
  `getFormValues()` (the whole screen bag) and POSTs. A button anywhere in the
  screen tree can submit because submit is an *action* reading shared state, not
  a tree-nested button.
- **Legacy's limits:** (a) one **flat, unnamed namespace per screen** — two forms
  collide; (b) the provider is a **React context bound to the screen subtree**, so
  it **cannot reach a button rendered in a bottom-sheet route** (our sheets are
  sibling native-stack routes, not children); (c) `useFormValues` re-renders on
  **any** field change; (d) a `setTimeout(setField, 0)` default-seeding hack.

**Decision: keep legacy's *shape* (shared state + submit-as-action), change the
*plumbing*** — a module-level store keyed by `form_id` instead of a screen-scoped
context. Same mental model legacy engineers already have; fixes all four limits.

---

## 2. Locked decisions

| # | Decision | Rationale |
|---|----------|-----------|
| D1 | **Form state lives in a module-level store keyed by `form_id`** (`useFormStore`, in `src/state/` per the store convention), not a React context bound to a subtree. `register` on mount, `unregister` on page unmount. | Route-agnostic: a footer **and** a sheet-route button both reach it by id. Matches existing `useBottomSheetStore` / `useNavigationStore` grain. Supports N forms per screen. |
| D2 | **Submit is a declarative `submit` action**, a thin alias over `bff_call`. Decoupled from tree position. | SDUI ethos; reuses existing `bff_call` machinery. |
| D3 | **Pre-registered (server-known) constants → baked into the submit action** (`request_body` + `endpoint` templating). *(Option B; Option A "seed the store with `initial_values`" was rejected.)* | Legacy already does this (template substitution); team knows it; no added value from store-seeding for this case. Bonus: drops the seed-if-absent / re-render correctness seam. |
| D4 | **Submit body = `{ ...action.request_body, ...forms[formId].values }`** — shallow merge, **form values win** on collision. | Endpoint constants are rarely `field_name`s, so no real collision; non-overridable values simply have no field. |
| D5 | **Untouched fields submit as empty** — `""` for scalars, `[]` for arrays (not omitted). | Predictable body shape for the server. |
| D6 | **Validation: server passes a typed rule array per field**; first-failing rule's `error` is shown. *(Generalized from "array of regex" — regex is one rule type among several.)* | Pure regex can't express numeric **range** (budget), multiselect **count** (platforms 1–3), `required`, or **cross-field** — all of which our own demo form needs. |
| D7 | **Validation evaluator lives in the SDK package** (`@one-impression/sdk-native-sdui`), as a pure `(rules, value) => error \| null`. | Client *and* server import the same evaluator → zero drift between what the client checks and what the BFF enforces. |
| D8 | **Show a field's error only when `touched \|\| submitAttempted`.** | Don't flash red while the user is still typing. |
| D9 | **`submit_gate` (form-level): default `validate_on_submit`**, `disable` available. `validate_on_submit` = button always enabled, press validates + scrolls to first error. `disable` = greyed until `isValid`. | Disabling-until-valid hides *why* it's disabled (and required fields start invalid). Validate-on-press tells the user the reason and is more accessible. |
| D10 | **Client validation is UX only; the server remains authoritative.** Server 4xx field errors write into the **same** `errors[formId]` map via `on_error`. | Client = fast feedback; server = the security boundary. One render path for both error sources. |
| D11 | **Build in the playground runtime now; promote the wire contract to the SDK as a follow-up.** | Same precedent as `overlay_on_click`. SDK-first would force a cross-repo publish cycle before anything is verifiable. |

---

## 3. Layering — what lives where

Goal: any app (e.g. `amplify-creator-app`) adopts the whole system by bumping
`@one-impression/{ui-native,sdui-runtime}` and injecting host capabilities —
writing **zero** form/validation/store code.

Dependency direction (acyclic): `tokens ← ui-native ← sdui-runtime ← app`. SDK
schemas (`@one-impression/sdk-native-sdui`) are consumed by the runtime **and**
the server.

| Layer | Owns | Litmus test |
|-------|------|-------------|
| **`ui-native`** | Pure presentational primitives — props in, pixels out. Stateless, controlled, **zero** SDUI/wire/store/validation awareness. `Input` (`value`/`onChangeText`/`error`/`disabled`), `Switch`, `SelectableItem`, `Button`, `Text`, `FieldError`/`Field` wrapper, `FileDropZone`, `PhoneField`. | *"Could a non-SDUI RN screen reuse this?"* |
| **`sdui-runtime`** | The SDUI brain — node registry, renderers (adapters), `useFormStore`, `useFormField`, `form_id` context, validation **orchestration**, `submit` action, body-merge. Depends on ui-native + SDK. | *"Is this interpreting the wire or holding SDUI state?"* |
| **`@one-impression/sdk-native-sdui`** | Wire schemas + the **validation evaluator** (pure, isomorphic). | *"Is this the contract, shared by client and server?"* |
| **App (playground / creator-app)** | Thin host — injects capabilities via `SduiRuntimeProvider` (BFF client, auth/headers, navigation host, toast, telemetry); supplies the wire JSON. Playground additionally holds fixtures + the stub server. **No form/validation/store logic.** | *"Is this how THIS app talks to ITS backend / renders ITS chrome?"* |

### The boundary that matters most
**The renderer is the adapter; the primitive is dumb.** `ui-native/Input` takes
`value`/`onChangeText`/`error`/`disabled` and renders — it has no idea about
`form_id`, rules, or the store. The runtime's `InputRenderer` reads the store,
runs validation, and decides what `error`/`disabled` to pass down.

### Refactor as we go
Push currently-inline visuals down into ui-native: the `+91` chip in
`PhoneNumberInput.renderer` and the dashed box in `UploadFile.renderer` are
presentation leaking into the runtime → become `PhoneField` / `FileDropZone`
primitives; the renderer shrinks to data-wiring.

---

## 4. Store shape

```ts
// runtime: useFormStore (zustand, module-level, keyed by form_id)
forms[formId] = {
  values:  Record<string, string | number | boolean | string[] | Record<string, unknown>>,
  touched: Record<string, boolean>,
  errors:  Record<string, string | null>,  // client-rule OR server-4xx
  isValid: boolean,                          // derived
}
```

- `register(formId)` / `unregister(formId)` — mount / page-unmount lifecycle.
- `setField(formId, name, value)` / `setTouched(formId, name)`.
- `getForm(formId)` — imperative read for the submit action (ref-backed, fresh).
- `reset(formId)` — on submit success.
- **Per-field selector subscriptions** — typing in one field re-renders only that
  field, never the others or the submit button. The button subscribes to
  `isValid` only.

---

## 5. Wire contract (built raw/local now → promote to SDK)

### Input field (every input snippet's `data`)
```jsonc
{
  "field_name": "email",            // already in InputSnippetSchema (unused today)
  "form_id": "campaign",            // NEW; inherited from enclosing form snippet, or explicit
  "validations": [                  // NEW; ordered, first-failing error shown
    { "type": "required", "error": "Email is required" },
    { "type": "regex", "pattern": "^[^@]+@[^@]+\\.[^@]+$", "flags": "i", "error": "Enter a valid email" }
  ]
}
```

Rule types: `required`, `regex` (`pattern`,`flags`), `min_length`, `max_length`,
`min`, `max` (numeric), `min_selected`, `max_selected` (multiselect),
`match_field` (cross-field). Hidden (`show_when`) / disabled fields are skipped
in validity.

### Form snippet
```jsonc
{
  "type": "creator.snippet.form",
  "data": {
    "form_id": "campaign",
    "submit_gate": "validate_on_submit",   // NEW; default. or "disable"
    "fields": [ /* input snippets, each carrying form_id (inherited) + validations */ ]
  }
}
```
The `form` snippet sets the `form_id` context for its children. A field outside
it may carry `form_id` explicitly — form membership is **logical (by id)**, not
positional.

### Submit action (on any button — footer, header, sheet)
```jsonc
{
  "type": "submit",
  "form_id": "campaign",
  "endpoint": "/campaigns/c_456/submit",   // path constants baked in (D3)
  "method": "POST",
  "request_body": { "source": "onboarding" },  // static extras (D3); merged under form values (D4)
  "on_success": { "type": "toast", "payload": { "message": "Submitted", "level": "success" } },
  "on_error":   { /* writes field errors into errors[formId] (D10) */ }
}
```

---

## 6. End-to-end workflow

1. **Render.** Page JSON arrives. Inputs mount → each calls
   `useFormField(form_id, field_name, default)` → seeds default (`""`/`[]`) into
   `forms[form_id].values[field_name]`, subscribes to its own slice.
2. **Type.** Field change → `setField` → store updates → only that field
   re-renders. On blur → `setTouched`.
3. **Validate.** On change, re-run that field's rules via the SDK evaluator →
   `errors[field] = firstError | null`; recompute `isValid`. Error is **shown**
   only if `touched || submitAttempted`.
4. **Gate.** `validate_on_submit`: button always enabled. `disable`: button
   `disabled = !isValid`.
5. **Submit.** Tap (footer / sheet / anywhere) → `submit` action → reads
   `getForm(form_id).values`, merges `{ ...request_body, ...values }`, dispatches
   the underlying `bff_call` to `endpoint` via the app-injected BFF client.
   - `validate_on_submit` + invalid → mark all touched, show errors, scroll to
     first failure; abort the call.
6. **Respond.** `on_success` → navigate / toast / `reset(form_id)`. 4xx field
   errors → `on_error` writes `errors[form_id]` → same inline render path.

---

## 7. Task plan (phased; verify on-device each phase)

Each runtime phase pushes its visual into `ui-native` where it's currently inline.

| Phase | Package(s) | Work | Verify |
|-------|-----------|------|--------|
| **1. Store** | runtime | `useFormStore` — register/unregister/setField/setTouched/getForm/reset + derived `isValid`. | unit-level; no UI yet |
| **2. Field plumbing** | runtime (+ ui-native `Field`/`Input` controlled) | id-only `form_id` context set by the `form` snippet; `useFormField` hook; wire `Input` first. | type in `Input` → value lands in store (devtools/log) on device |
| **3. Remaining inputs** | runtime (+ ui-native `PhoneField`, `Switch`, `SelectableItem`, `FileDropZone`) | wire phone / toggle / single-select / multi-select / upload to `useFormField`. | each input's value updates the store |
| **4. Validation** | **SDK** (evaluator) + runtime (orchestration) + ui-native (`FieldError`) | pure rule evaluator in SDK; runtime runs it, writes `errors`, derives `isValid`; touched-gated inline errors. | blur invalid field → error; fix → clears; `isValid` flips |
| **5. Submit action** | runtime | register `submit` (delegates `bff_call`); body merge (D4); both gate modes (D9); `on_error` → `errors`. | both gate modes; success + simulated 4xx |
| **6. Demo + e2e** | playground only | update `demo.form` (real `form_id`/`field_name`/`validations`/`submit`/`submit_gate`); add a **POST submit endpoint** to the fixture server (success + 4xx-with-field-errors). | full loop on device: type → blur error → fix → gate → submit → success / server error |

---

## 8. Follow-ups & seams

- **🚩 SDK promotion (GATING — required before merge/use elsewhere).** The
  runtime now emits/reads wire that the published SDK doesn't yet know:
  - **`submit` action type** — `ActionTypeSchema` is a **closed enum**, so an
    unknown action type fails node validation and blanks the containing node.
    Verified only via a **local `node_modules` patch** (added `submit` + a
    `z.string()` forward-compat catchall to `ActionTypeSchema`). **This patch is
    not committed (node_modules is gitignored) and is lost on `npm install`.**
    Real fix: `amplify-schemas` PR — add `submit` to `ActionTypeSchema` **and a
    forward-compat catchall** so future server action types degrade gracefully
    instead of breaking the page (the action engine already no-ops unknowns).
  - Also promote `form_id`, `validations`, `submit_gate`, the `evaluateField`
    evaluator (D7), and `Input` `leading`/`trailing` + the `component.field`
    token group as the contract (read raw / locally typed today).
- **Button size enum mismatch (fixed in renderer; promote the lesson).** Wire
  `ButtonSizeSchema` is `small|medium|large`; ui-native `Button` keys `sm|md|lg`.
  The renderer now maps via `SIZE_MAP` — *any* explicit wire button size crashed
  before. A regression test + aligning the enums is the durable fix.
- **Country values keyed by dial code** — US & Canada share `+1`, so selecting
  one highlights both in the picker. Key options by **ISO** (unique), store ISO,
  display the dial code.
- **Picker search** — country sheet has no search yet (fine for ~12; needed for
  ~195). Additive: filter the single-select options.
- **Async / uniqueness validation** ("username taken") — not regex; handled by
  server 4xx, or a future debounced check action.
- **Async / uniqueness validation** ("username taken") — not regex; handled by
  server 4xx, or a future debounced check action.
- **`show_when`** — conditional visibility must skip hidden fields in validity.
- **ReDoS / regex flavor** — patterns are JS `RegExp`, authored server-side
  (trusted); cap input length before testing; server provides anchors.
- **Draft persistence / multi-step wizards** — a store keyed by `form_id` makes
  "one form per step" and draft restore trivial later.

### Reconciliation with existing dead code
`src/state/useBottomSheetFormStore.ts` is an **abandoned earlier attempt** at this
feature: a single flat form (`values`/`touched`/`errors`/`submitting`/`submitted`),
**not keyed by `form_id`**, "mirrors the legacy Redux bottomSheetForm slice." It is
**not in the package's public export surface** (root `index.ts` doesn't re-export it)
and has **zero consumers** anywhere in the monorepo — the bottom-sheet input
renderers don't use it either. It is **superseded by `useFormStore`** (D1) and
should be **deleted** as a cleanup (safe: not public, no consumers). Left in place
pending explicit ok to remove.

---

## 9. Reuse outcome

A new app adopts everything by bumping `@one-impression/{ui-native,sdui-runtime}`
and providing four capabilities to `SduiRuntimeProvider`: a BFF client,
auth/headers, a navigation host, a toast impl. Zero form logic, zero validation,
zero store code. Its gateway emits the same wire JSON the playground fixtures
emit. The playground is the only place holding fixtures + the stub server.

---

## 10. Implementation status — what shipped (verified on-device)

**Core form system (§1–7), all verified in the playground via `demo.form`:**
- **`state/useFormStore.ts`** — store keyed by `form_id` (D1): `register`/
  `unregister`/`setField`/`setTouched`/`touchAll`/`setErrors`/`getForm`/`reset`
  + `selectFormIsValid`. Supersedes the dead `useBottomSheetFormStore` (still
  present, flagged for deletion).
- **`form/`** — `FormIdContext` (id-only) + `useFormField` (per-field selector,
  mount-seed, runs validation, returns `{value,setValue,error,touched,markTouched,bound}`).
- **`validation/evaluate.ts`** — pure `evaluateField(rules,value,ctx)`; rule types
  per D6; ReDoS input cap; safe-fail on bad regex. (Promote to SDK — D7.)
- **`action-engine/handlers/submit.ts`** — gate (touchAll + abort if invalid) →
  merge `{...request_body, ...values}` → POST → on_success / on_error (+ writes
  server field errors into the same error map). Registered as `submit`.
- All input snippets bound to the store (text/email/number, phone, toggle,
  single/multi-select interactive, upload). Untouched → `""`/`[]` (D5).

**UI / ui-native enhancements (token-driven, design-owned):**
- **`SelectableItem`** — `indicator: radio|checkbox` (single = circle, multi =
  square) + `rounded` prop; option cards use field tokens + `minHeight`.
- **`Input`** — Material **floating label** (token-driven sizes: `fontSize.lg`→`sm`,
  Material easing); **`leading`/`trailing` adornment slots** (border moved to a
  wrapper row); `error`/`helperText` at `fontSize.sm` (12) in the `negative` color.
- **`component.field` token group** (`tokens-creator` theme JSON + `build-tokens.js`
  native emit + ui-native d.ts): `{ height:48, paddingX:16, paddingY:12, radius:8 }`
  — Input, SelectableItem, and (via size `large`) Button now share one rhythm /
  touch target. Sibling to `component.button`.
- **`UploadFile`** — functional via the `pickDocument` capability; shows selected
  files with remove (multi) / remove+replace (single); tighter spacing.
- **`Button` renderer** — `SIZE_MAP` maps wire `small|medium|large` → ui-native
  `sm|md|lg` (fixed a crash on any explicit wire size).

**Phone number = composition (not a bespoke input):** `data/countries.ts` (runtime
dataset, emoji flags) + the generic `Input` with a leading `🇮🇳 +91 ▾` chip +
`phone-pad`. The chip opens a **route bottom sheet whose body is the reused
`single_select_input`** bound to `<field_name>_country_code` on the same form,
`on_change: dismiss` (tap-to-pick-and-close). Submits `phone` + `phone_country_code`.

**Not committed / external:** the `node_modules` SDK `ActionType` patch (see §8 🚩)
and `tokens-creator/dist` (gitignored build artifact — regenerated by `npm run build`).
