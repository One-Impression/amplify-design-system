---
"@one-impression/sdui-runtime": patch
---

Single-source the gutter/gap model across pages and sheets, and refine section-header + chip + first-item spacing:

- Spacing is page-owned: `GutterItem` owns each item's horizontal gutter and vertical inter-item gap (incl. per-type `GAP_OVERRIDES` / extra-top / bottom-reduction), so snippets no longer carry competing margins.
- Route-based bottom sheet (`SduiSheetScreen`) now wraps its items in `GutterItem`, matching page layouts.
- First item rule: a full-bleed banner sits flush at the top (`marginTop: 0`); any other first item gets a standard `md` top inset. Applied on pages, feed tabs, and sheets.
- Section headers: extra `md` top / reduced (`md − sm`) bottom for a clear break that hugs its content; title defaults to semibold.
- `group_chips`: outer vertical padding removed (`gap` owns inter-row spacing for wrapped rows; outer spacing is the page gutter); scroll inset uses the page gutter token.
