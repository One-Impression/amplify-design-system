import type { Node } from "@one-impression/sdk-native-sdui";

// Layout / Utility
import { CompositeRenderer } from "../snippets/Composite/index.js";
import { GroupConfigRenderer } from "../snippets/GroupConfig/index.js";
import { GroupStepsRenderer } from "../snippets/GroupSteps/index.js";
import { GroupSnippetsRenderer } from "../snippets/GroupSnippets/index.js";
import { GroupChipsRenderer } from "../snippets/GroupChips/index.js";
import { CardRenderer } from "../snippets/Card/index.js";
import { BannerImageRenderer } from "../snippets/BannerImage/index.js";
import { EmptySpaceRenderer } from "../snippets/EmptySpace/index.js";
import { SeparatorRenderer } from "../snippets/Separator/index.js";
import { LoaderRenderer } from "../snippets/Loader/index.js";
import { SkeletonRenderer } from "../snippets/Skeleton/index.js";
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
import { DateInputRenderer } from "../snippets/DateInput/index.js";
import { UploadFileRenderer } from "../snippets/UploadFile/index.js";

// Chip
import { ChipRenderer } from "../snippets/Chip/index.js";

/**
 * Registry mapping wire type strings to snippet renderers.
 * 43 snippets covering layout, headers, footers, cards, images,
 * info rows, inputs, and chips.
 */
export const snippetRegistry: Record<string, (node: Node) => React.ReactElement> = {
  // Layout / Utility
  "sdui.snippet.composite": CompositeRenderer,
  "sdui.snippet.group_config": GroupConfigRenderer,
  "sdui.snippet.group_steps": GroupStepsRenderer,
  "sdui.snippet.group_snippets": GroupSnippetsRenderer,
  "sdui.snippet.group_chips": GroupChipsRenderer,
  "sdui.snippet.card": CardRenderer,
  "sdui.snippet.banner_image": BannerImageRenderer,
  "sdui.snippet.empty_space": EmptySpaceRenderer,
  "sdui.snippet.separator": SeparatorRenderer,
  "sdui.snippet.loader": LoaderRenderer,
  "sdui.snippet.skeleton": SkeletonRenderer,
  "sdui.snippet.aerobar": AerobarRenderer,
  "sdui.snippet.empty_state": EmptyStateRenderer,
  "sdui.snippet.steps": StepsRenderer,

  // Headers / Footers (11)
  "sdui.snippet.page_header": PageHeaderRenderer,
  "sdui.snippet.page_header_image_stack": PageHeaderImageStackRenderer,
  "sdui.snippet.page_footer": PageFooterRenderer,
  "sdui.snippet.page_footer_with_checkbox": PageFooterWithCheckboxRenderer,
  "sdui.snippet.page_floater_header": PageFloaterHeaderRenderer,
  "sdui.snippet.bottom_sheet_header": BottomSheetHeaderRenderer,
  "sdui.snippet.bottom_sheet_header_with_search": BottomSheetHeaderWithSearchRenderer,
  "sdui.snippet.bottom_sheet_footer": BottomSheetFooterRenderer,
  "sdui.snippet.section_header": SectionHeaderRenderer,
  "sdui.snippet.tabs_footer": TabsFooterRenderer,
  "sdui.snippet.tabs": TabsRenderer,

  // Card / Layout containers (4)
  "sdui.snippet.bottom_sheet": BottomSheetRenderer,
  "sdui.snippet.bottom_sheet_input_section": BottomSheetInputSectionRenderer,
  "sdui.snippet.bottom_sheet_input": BottomSheetInputRenderer,
  "sdui.snippet.form": FormRenderer,

  // Image snippets (3)
  "sdui.snippet.image_carousel": ImageCarouselRenderer,
  "sdui.snippet.image_stack": ImageStackRenderer,
  "sdui.snippet.overlapping_image": OverlappingImageRenderer,

  // Info / List (6)
  "sdui.snippet.info_row": InfoRowRenderer,
  "sdui.snippet.info_progress_row": InfoProgressRowRenderer,
  "sdui.snippet.info_icon_row": InfoIconRowRenderer,
  "sdui.snippet.info_media_row": InfoMediaRowRenderer,
  "sdui.snippet.info_breakdown_row": InfoBreakdownRowRenderer,
  "sdui.snippet.list": ListRenderer,

  // Input / Selection
  "sdui.snippet.input": InputRenderer,
  "sdui.snippet.toggle_input": ToggleInputRenderer,
  "sdui.snippet.single_select_input": SingleSelectInputRenderer,
  "sdui.snippet.multi_select_input": MultiSelectInputRenderer,
  "sdui.snippet.date_input": DateInputRenderer,
  "sdui.snippet.upload_file": UploadFileRenderer,

  // Chip (1)
  "sdui.snippet.chip": ChipRenderer,
};
