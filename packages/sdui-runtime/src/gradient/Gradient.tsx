import React from "react";
import { StyleSheet, View } from "react-native";

/**
 * Linear gradient descriptor consumed by the SDUI runtime.
 *
 * Mirrors the legacy `PageType3` shape — the producer (gateway / BFF) ships
 * angle in degrees, an array of color stops, and an optional screen portion
 * (vertical span the gradient should fill, in px).
 */
export interface GradientItem {
  angle: number;
  colors: string[];
  screen_portion?: number;
}

interface GradientProps {
  item?: GradientItem | null;
}

/**
 * Optional peer-dep loader for `react-native-linear-gradient`.
 *
 * The dependency is *not* declared in package.json — consuming apps that
 * want true linear gradients install it themselves. When present we use it;
 * when absent we fall back to a stacked-color View that approximates a
 * vertical fade using the first and last gradient stops.
 */
function loadLinearGradient(): React.ComponentType<{
  colors: string[];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  locations?: number[];
  style?: object;
}> | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require("react-native-linear-gradient");
    return (mod?.default ?? mod) as React.ComponentType<{
      colors: string[];
      start?: { x: number; y: number };
      end?: { x: number; y: number };
      locations?: number[];
      style?: object;
    }>;
  } catch {
    return null;
  }
}

/**
 * Convert a CSS-style angle (0 = up, 90 = right, 180 = down) into
 * `start` / `end` unit-space coords expected by `react-native-linear-gradient`.
 */
function angleToCoords(angle: number): {
  start: { x: number; y: number };
  end: { x: number; y: number };
} {
  const rad = ((angle - 90) * Math.PI) / 180;
  return {
    start: {
      x: 0.5 - Math.cos(rad) / 2,
      y: 0.5 - Math.sin(rad) / 2,
    },
    end: {
      x: 0.5 + Math.cos(rad) / 2,
      y: 0.5 + Math.sin(rad) / 2,
    },
  };
}

/**
 * Render a gradient backdrop.
 *
 * - When `react-native-linear-gradient` is installed in the host app, we
 *   render a true linear gradient honoring `angle`, `colors`, and
 *   `screen_portion`.
 * - Otherwise we render the first gradient color as a solid fallback so the
 *   visual hierarchy still works (header tint, scroll color) — no JS error.
 */
export function Gradient({ item }: GradientProps): React.ReactElement | null {
  if (!item || !item.colors || item.colors.length === 0) return null;

  const { angle, colors, screen_portion } = item;
  const LinearGradient = loadLinearGradient();

  if (LinearGradient) {
    const locations = colors.map((_, i) =>
      colors.length === 1 ? 0 : i / (colors.length - 1),
    );
    return (
      <LinearGradient
        colors={colors}
        {...angleToCoords(angle)}
        locations={locations}
        style={[
          StyleSheet.absoluteFillObject,
          screen_portion ? { height: screen_portion } : null,
        ]}
      />
    );
  }

  // Fallback: solid first-color backdrop.
  return (
    <View
      style={[
        StyleSheet.absoluteFillObject,
        screen_portion ? { height: screen_portion } : null,
        { backgroundColor: colors[0] },
      ]}
    />
  );
}
