/**
 * parseSvg — lazy SVG-string to React Native component conversion.
 *
 * Converts raw SVG markup into react-native-svg components. Results are
 * memoized per icon name so repeated lookups are O(1) after first parse.
 */
import React from 'react';
import { SvgXml } from 'react-native-svg';

/** Cache of already-parsed SVG components keyed by icon name. */
const svgCache = new Map<string, React.FC<SvgIconProps>>();

/**
 * Strip comment syntax that is invalid inside an SVG/XML document. Some glyphs
 * in the icon manifest were authored as JSX and leaked `{/* ... *\/}` comments
 * (and occasionally HTML `<!-- ... -->` comments) into the markup string. The
 * `SvgXml` parser treats these as raw text nodes and renders them as bare
 * strings inside an SVG element, which throws "Text strings must be rendered
 * within a <Text> component". Removing them is always safe — comments carry no
 * rendering meaning.
 */
function sanitizeSvg(svg: string): string {
  return svg
    .replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, "") // JSX comments: {/* ... */}
    .replace(/<!--[\s\S]*?-->/g, ""); // HTML/XML comments: <!-- ... -->
}

export interface SvgIconProps {
  width?: number;
  height?: number;
  color?: string;
}

/**
 * Parse an SVG string into a React Native component.
 *
 * The returned component accepts width, height, and color props.
 * Color replaces `currentColor` in the SVG markup so stroke/fill
 * tokens resolve correctly at render time.
 *
 * @param name  - Unique icon identifier (used as cache key)
 * @param svg   - Raw SVG markup string
 * @returns A React component that renders the SVG via react-native-svg
 */
export function parseSvg(name: string, svg: string): React.FC<SvgIconProps> {
  const cached = svgCache.get(name);
  if (cached) return cached;

  const cleanSvg = sanitizeSvg(svg);

  const Component: React.FC<SvgIconProps> = ({ width = 24, height = 24, color }) => {
    const resolvedSvg = color ? cleanSvg.replace(/currentColor/g, color) : cleanSvg;

    return React.createElement(SvgXml, {
      xml: resolvedSvg,
      width,
      height,
    });
  };

  Component.displayName = `SvgIcon(${name})`;
  svgCache.set(name, Component);

  return Component;
}

/** Clear the SVG component cache. Useful for testing or memory pressure. */
export function clearSvgCache(): void {
  svgCache.clear();
}
