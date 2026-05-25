---
"@one-impression/sdui-runtime": minor
---

feat(sdui-runtime): add 43 Tier 2 snippet renderers for Creator App SDUI

Populates the snippet registry with renderers for all Creator BFF snippet types:
- Layout / Utility (12): GroupConfig, GroupSteps, GroupSnippets, GroupChips, Card,
  BannerImage, EmptySpace, Separator, Loader, Aerobar, EmptyState, Steps
- Headers / Footers (11): PageHeader, PageHeaderImageStack, PageFooter,
  PageFooterWithCheckbox, PageFloaterHeader, BottomSheetHeader,
  BottomSheetHeaderWithSearch, BottomSheetFooter, SectionHeader, TabsFooter, Tabs
- Card / Layout containers (4): BottomSheet (store-based), BottomSheetInputSection,
  BottomSheetInput, Form (with FormContext)
- Image snippets (3): ImageCarousel, ImageStack, OverlappingImage
- Info / List (6): InfoRow, InfoProgressRow, InfoIconRow, InfoMediaRow,
  InfoBreakdownRow, List
- Input / Selection (6): Input, PhoneNumberInput, ToggleInput, SingleSelectInput,
  MultiSelectInput, UploadFile
- Chip (1)

Shared helper: renderMedia() for discriminated MediaSchema union rendering.
All renderers follow the SduiNode + Interpreter pattern from Task 24.
