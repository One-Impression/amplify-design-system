import React, { useMemo } from "react";
import {
  Icon as DSIcon,
  resolveColor,
  resolveIconSize,
} from "@one-impression/ui-native";
import { useIconStore } from "./useIconStore.js";
import { parseSvg } from "./parseSvg.js";

export interface IconGlyphProps {
  name: string;
  color?: string;
  size?: string | number;
}

/**
 * Resolve an icon name to its actual SVG glyph (via the icon store — MMKV
 * manifest → bundled essentials → placeholder) and render it inside the sized,
 * coloured `DSIcon` container. The ui-native `Icon` primitive only handles
 * size/colour; the glyph must be supplied as a child.
 *
 * Crucially we resolve the colour + size to concrete values and pass them to
 * the parsed SVG: most icons stroke/fill with `currentColor`, which `parseSvg`
 * substitutes — without a concrete colour the glyph renders invisible.
 */
export function IconGlyph({ name, color, size }: IconGlyphProps): React.ReactElement {
  const { getIcon } = useIconStore();
  // Memoise on name so the SVG subtree isn't unmounted/remounted each render.
  const SvgIcon = useMemo(() => parseSvg(name, getIcon(name)), [name, getIcon]);
  const px = (typeof size === "number" ? size : resolveIconSize(size ?? "md")) ?? 20;
  const tint = resolveColor(color ?? "neutralStrong") ?? "#1A1A1A";
  return (
    <DSIcon name={name} color={color} size={size}>
      <SvgIcon width={px} height={px} color={tint} />
    </DSIcon>
  );
}
