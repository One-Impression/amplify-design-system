---
"@one-impression/sdui-runtime": patch
---

`replace_section` (and `replaceNode`) now reach nodes in the page's sticky header/footer slots, not just `items` — so a section reload can swap the pinned footer (e.g. a KYC verify step revealing the declaration + Submit footer). Also: `page_footer_with_checkbox` renders its primary CTA full-width when there's no secondary button, matching the plain `page_footer` bar.
