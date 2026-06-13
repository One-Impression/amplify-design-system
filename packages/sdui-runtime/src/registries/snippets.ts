import type { Node } from "@one-impression/sdk-native-sdui";

// Layout / Utility
import { GroupConfigRenderer } from "../snippets/GroupConfig/index.js";
import { GroupStepsRenderer } from "../snippets/GroupSteps/index.js";
import { GroupSnippetsRenderer } from "../snippets/GroupSnippets/index.js";
import { GroupChipsRenderer } from "../snippets/GroupChips/index.js";
import { CardRenderer } from "../snippets/Card/index.js";
import { BannerImageRenderer } from "../snippets/BannerImage/index.js";
import { EmptySpaceRenderer } from "../snippets/EmptySpace/index.js";
import { SeparatorRenderer } from "../snippets/Separator/index.js";
import { LoaderRenderer } from "../snippets/Loader/index.js";
import { AerobarRenderer } from "../snippets/Aerobar/index.js";
import { EmptyStateRenderer } from "../snippets/EmptyState/index.js";
import { StepsRenderer } from "../snippets/Steps/index.js";

// Headers / Footers
import { PageHeaderRenderer } from "../snippets/PageHeader/index.js";
import { PageHeaderImageStackRenderer } from "../snippets/PageHeaderImageStack/index.js";
import { PageFooterRenderer } from "../snippets/PageFooter/index.js";
import { PageFooterWithCheckboxRenderer } from "../snippets/PageFooterWithCheckbox/index.js";
import { PageFloaterHeaderRenderer } from "../snippets/PageFloaterHeader/index.js";
import { BottomSheetHeaderRenderer } from "../snippets/BottomSheetHeader/index.js";
import { BottomSheetHeaderWithSearchRenderer } from "../snippets/BottomSheetHeaderWithSearch/index.js";
import { BottomSheetFooterRenderer } from "../snippets/BottomSheetFooter/index.js";
import { SectionHeaderRenderer } from "../snippets/SectionHeader/index.js";
import { TabsFooterRenderer } from "../snippets/TabsFooter/index.js";
import { TabsRenderer } from "../snippets/Tabs/index.js";

// Card / Layout containers
import { BottomSheetRenderer } from "../snippets/BottomSheet/index.js";
import { BottomSheetInputSectionRenderer } from "../snippets/BottomSheetInputSection/index.js";
import { BottomSheetInputRenderer } from "../snippets/BottomSheetInput/index.js";
import { FormRenderer } from "../snippets/Form/index.js";

// Image snippets
import { ImageCarouselRenderer } from "../snippets/ImageCarousel/index.js";
import { ImageStackRenderer } from "../snippets/ImageStack/index.js";
import { OverlappingImageRenderer } from "../snippets/OverlappingImage/index.js";

// Info / List
import { InfoRowRenderer } from "../snippets/InfoRow/index.js";
import { InfoProgressRowRenderer } from "../snippets/InfoProgressRow/index.js";
import { InfoIconRowRenderer } from "../snippets/InfoIconRow/index.js";
import { InfoMediaRowRenderer } from "../snippets/InfoMediaRow/index.js";
import { InfoBreakdownRowRenderer } from "../snippets/InfoBreakdownRow/index.js";
import { ListRenderer } from "../snippets/List/index.js";

// Input / Selection
import { InputRenderer } from "../snippets/Input/index.js";
import { ToggleInputRenderer } from "../snippets/ToggleInput/index.js";
import { SingleSelectInputRenderer } from "../snippets/SingleSelectInput/index.js";
import { MultiSelectInputRenderer } from "../snippets/MultiSelectInput/index.js";
import { UploadFileRenderer } from "../snippets/UploadFile/index.js";

// Chip
import { ChipRenderer } from "../snippets/Chip/index.js";

/**
 * Registry mapping wire type strings to snippet renderers.
 * 43 snippets covering layout, headers, footers, cards, images,
 * info rows, inputs, and chips.
 */
export const snippetRegistry: Record<string, (node: Node) => React.ReactElement> = {
  // Layout / Utility (12)
  "creator.snippet.group_config": GroupConfigRenderer,
  "creator.snippet.group_steps": GroupStepsRenderer,
  "creator.snippet.group_snippets": GroupSnippetsRenderer,
  "creator.snippet.group_chips": GroupChipsRenderer,
  "creator.snippet.card": CardRenderer,
  "creator.snippet.banner_image": BannerImageRenderer,
  "creator.snippet.empty_space": EmptySpaceRenderer,
  "creator.snippet.separator": SeparatorRenderer,
  "creator.snippet.loader": LoaderRenderer,
  "creator.snippet.aerobar": AerobarRenderer,
  "creator.snippet.empty_state": EmptyStateRenderer,
  "creator.snippet.steps": StepsRenderer,

  // Headers / Footers (11)
  "creator.snippet.page_header": PageHeaderRenderer,
  "creator.snippet.page_header_image_stack": PageHeaderImageStackRenderer,
  "creator.snippet.page_footer": PageFooterRenderer,
  "creator.snippet.page_footer_with_checkbox": PageFooterWithCheckboxRenderer,
  "creator.snippet.page_floater_header": PageFloaterHeaderRenderer,
  "creator.snippet.bottom_sheet_header": BottomSheetHeaderRenderer,
  "creator.snippet.bottom_sheet_header_with_search": BottomSheetHeaderWithSearchRenderer,
  "creator.snippet.bottom_sheet_footer": BottomSheetFooterRenderer,
  "creator.snippet.section_header": SectionHeaderRenderer,
  "creator.snippet.tabs_footer": TabsFooterRenderer,
  "creator.snippet.tabs": TabsRenderer,

  // Card / Layout containers (4)
  "creator.snippet.bottom_sheet": BottomSheetRenderer,
  "creator.snippet.bottom_sheet_input_section": BottomSheetInputSectionRenderer,
  "creator.snippet.bottom_sheet_input": BottomSheetInputRenderer,
  "creator.snippet.form": FormRenderer,

  // Image snippets (3)
  "creator.snippet.image_carousel": ImageCarouselRenderer,
  "creator.snippet.image_stack": ImageStackRenderer,
  "creator.snippet.overlapping_image": OverlappingImageRenderer,

  // Info / List (6)
  "creator.snippet.info_row": InfoRowRenderer,
  "creator.snippet.info_progress_row": InfoProgressRowRenderer,
  "creator.snippet.info_icon_row": InfoIconRowRenderer,
  "creator.snippet.info_media_row": InfoMediaRowRenderer,
  "creator.snippet.info_breakdown_row": InfoBreakdownRowRenderer,
  "creator.snippet.list": ListRenderer,

  // Input / Selection
  "creator.snippet.input": InputRenderer,
  "creator.snippet.toggle_input": ToggleInputRenderer,
  "creator.snippet.single_select_input": SingleSelectInputRenderer,
  "creator.snippet.multi_select_input": MultiSelectInputRenderer,
  "creator.snippet.upload_file": UploadFileRenderer,

  // Chip (1)
  "creator.snippet.chip": ChipRenderer,
};
