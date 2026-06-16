---
"@one-impression/sdui-runtime": minor
---

`PageHeader` renders a `sub_row` (content below the title, inside the header
surface — e.g. a filter chip row) and now has an intrinsic bottom-edge shadow
(elevation), the symmetric counterpart to TabsFooter's top-edge shadow. The
background (solid or gradient) fills the whole header, title + sub_row included,
so the header reads as one cohesive surface. Requires sdk-native-sdui ^4.5.0.
