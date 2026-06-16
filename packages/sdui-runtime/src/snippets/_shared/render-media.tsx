import React from "react";
import type { Media } from "@one-impression/sdk-native-sdui";
import {
  Image as DSImage,
  ImageStack as DSImageStack,
  ProgressIndicator as DSProgressIndicator,
  CircularProgress as DSCircularProgress,
  Text as DSText,
} from "@one-impression/ui-native";
import { IconGlyph } from "../../icon-store/IconGlyph.js";
import { describeMedia } from "./describe-media.js";

/**
 * Renders a `MediaSchema` node. The shape-mapping rules live in
 * {@link describeMedia} (a pure function with no `react-native` imports, so
 * it can be unit-tested under plain Node); this wrapper hands the resulting
 * descriptor's `props` to the appropriate ui-native primitive.
 */
export function renderMedia(media: Media): React.ReactElement | null {
  const desc = describeMedia(media);
  if (!desc) return null;

  switch (desc.kind) {
    case "image":
      return <DSImage {...desc.props} />;
    case "icon":
      return <IconGlyph {...desc.props} />;
    case "image_stack":
      return <DSImageStack {...desc.props} />;
    case "progress": {
      const { shape, label, value, trackColor, fillColor } = desc.props;
      if (shape === "ring") {
        return (
          <DSCircularProgress value={value} trackColor={trackColor} fillColor={fillColor}>
            {label ? (
              <DSText size={12} weight="bold">
                {label}
              </DSText>
            ) : null}
          </DSCircularProgress>
        );
      }
      return (
        <DSProgressIndicator value={value} trackColor={trackColor} fillColor={fillColor} />
      );
    }
    default: {
      const _exhaustive: never = desc;
      void _exhaustive;
      return null;
    }
  }
}
