import type { ComponentType } from "react";
import type { Node } from "@one-impression/sdk-native-sdui";
import { ButtonRenderer } from "../ui_components/Button/index.js";
import { TextRenderer } from "../ui_components/Text/index.js";
import { CardRenderer } from "../ui_components/Card/index.js";
import { ChipRenderer } from "../ui_components/Chip/index.js";
import { CheckboxRenderer } from "../ui_components/Checkbox/index.js";
import { RadioRenderer } from "../ui_components/Radio/index.js";
import { IconRenderer } from "../ui_components/Icon/index.js";
import { ImageRenderer } from "../ui_components/Image/index.js";
import { ImageStackRenderer } from "../ui_components/ImageStack/index.js";
import { InputRenderer } from "../ui_components/Input/index.js";
import { SectionRenderer } from "../ui_components/Section/index.js";
import { SeparatorRenderer } from "../ui_components/Separator/index.js";
import { TagRenderer } from "../ui_components/Tag/index.js";
import { TabRenderer } from "../ui_components/Tab/index.js";
import { ProgressIndicatorRenderer } from "../ui_components/ProgressIndicator/index.js";
import { SearchBarRenderer } from "../ui_components/SearchBar/index.js";
import { SelectableItemRenderer } from "../ui_components/SelectableItem/index.js";
import { SelectTriggerRenderer } from "../ui_components/SelectTrigger/index.js";
import { ScrollViewRenderer } from "../ui_components/ScrollView/index.js";

const baseUiComponentRegistry: Record<string, (node: Node) => React.ReactElement> = {
  "creator.ui_component.button": ButtonRenderer,
  "creator.ui_component.text": TextRenderer,
  "creator.ui_component.card": CardRenderer,
  "creator.ui_component.chip": ChipRenderer,
  "creator.ui_component.checkbox": CheckboxRenderer,
  "creator.ui_component.radio": RadioRenderer,
  "creator.ui_component.icon": IconRenderer,
  "creator.ui_component.image": ImageRenderer,
  "creator.ui_component.image_stack": ImageStackRenderer,
  "creator.ui_component.input": InputRenderer,
  "creator.ui_component.section": SectionRenderer,
  "creator.ui_component.separator": SeparatorRenderer,
  "creator.ui_component.tag": TagRenderer,
  "creator.ui_component.tab": TabRenderer,
  "creator.ui_component.progress_indicator": ProgressIndicatorRenderer,
  "creator.ui_component.search_bar": SearchBarRenderer,
  "creator.ui_component.selectable_item": SelectableItemRenderer,
  "creator.ui_component.select_trigger": SelectTriggerRenderer,
  "creator.ui_component.scroll_view": ScrollViewRenderer,
};

// Namespace migration: alias every `creator.*` entry to its `sdui.*` key so both
// prefixes resolve to the same renderer while emitters move creator.* -> sdui.*.
export const uiComponentRegistry: Record<string, (node: Node) => React.ReactElement> = {
  ...baseUiComponentRegistry,
  ...Object.fromEntries(
    Object.entries(baseUiComponentRegistry).map(([k, v]) => [k.replace(/^creator\./, "sdui."), v]),
  ),
};
