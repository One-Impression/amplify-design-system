# Intentional Cross-Product Divergences

This document tracks design token differences between Brand, Creator, and Atmosphere that are **intentional** and should not be normalized.

## Typography — Body Font Size

| Product | Size | Rationale |
|---------|------|-----------|
| Brand | 15px | Desktop-first dashboard; readability at arm's length |
| Creator | 14px | Mobile-first app; compact content density on small screens |
| Atmosphere | 13px | Data-dense analytics; maximize information per viewport |

Foundation tokens: `typography.body.desktop` (15px), `typography.body.mobile` (14px), `typography.body.dense` (13px)

## Card Border Radius

| Product | Radius | Rationale |
|---------|--------|-----------|
| Brand | 8px | Balanced rounding for desktop card grids |
| Atmosphere | 10px | Slightly larger rounding pairs with dark theme surfaces |
| Creator | 16px | Generous rounding for mobile touch targets and thumb-friendly UI |

Foundation tokens: `radius.card-desktop` (8px), `radius.card-analytics` (10px), `radius.card-mobile` (16px)

## Error Red

| Product | Value | Rationale |
|---------|-------|-----------|
| Brand | #FD5154 | Warm red matching brand palette |
| Creator | #FD5154 | Same as Brand — consistent cross-product error signaling |
| Atmosphere | #EF4444 | Tailwind red-500; better contrast ratio on dark backgrounds |

## Success Green

| Product | Value | Rationale |
|---------|-------|-----------|
| Brand | #21C179 | Shared success green |
| Creator | #21C179 | Same as Brand |
| Atmosphere (light) | #21C179 | Same in light mode |
| Atmosphere (dark) | #4ADE80 | Lighter green needed for WCAG AA contrast on dark surfaces |

Foundation provides both as primitives: `color.primitive.green-500` (#21C179) and `color.primitive.green-400` (#4ADE80).
