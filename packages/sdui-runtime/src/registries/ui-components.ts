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

export const uiComponentRegistry: Record<string, (node: Node) => React.ReactElement> = {
  "sdui.ui_component.button": ButtonRenderer,
  "sdui.ui_component.text": TextRenderer,
  "sdui.ui_component.card": CardRenderer,
  "sdui.ui_component.chip": ChipRenderer,
  "sdui.ui_component.checkbox": CheckboxRenderer,
  "sdui.ui_component.radio": RadioRenderer,
  "sdui.ui_component.icon": IconRenderer,
  "sdui.ui_component.image": ImageRenderer,
  "sdui.ui_component.image_stack": ImageStackRenderer,
  "sdui.ui_component.input": InputRenderer,
  "sdui.ui_component.section": SectionRenderer,
  "sdui.ui_component.separator": SeparatorRenderer,
  "sdui.ui_component.tag": TagRenderer,
  "sdui.ui_component.tab": TabRenderer,
  "sdui.ui_component.progress_indicator": ProgressIndicatorRenderer,
  "sdui.ui_component.search_bar": SearchBarRenderer,
  "sdui.ui_component.selectable_item": SelectableItemRenderer,
  "sdui.ui_component.select_trigger": SelectTriggerRenderer,
  "sdui.ui_component.scroll_view": ScrollViewRenderer,
};
