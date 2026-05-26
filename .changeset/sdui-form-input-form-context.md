---
"@one-impression/sdui-runtime": minor
---

Wires `Form` and `Input` together through a `FormContext` so submit-time `bff_call` actions see the latest input values. `Input` reads `data.field_name` and propagates each keystroke to `FormContext.setValue(field_name, value)`; `Form` wraps its submit button in `FormSubmitWrapper`, which intercepts the `bff_call` action and merges the ref-backed values snapshot into `payload.request_body` at click time. The merge logic + state factory are extracted into a framework-free `form-values.ts` so the contract is unit-testable without React Native. Mount-time seeding of FormContext captures refs to keep the empty-deps useEffect lint-clean. Without this, OTP entry and every form submit fired with empty bodies.
