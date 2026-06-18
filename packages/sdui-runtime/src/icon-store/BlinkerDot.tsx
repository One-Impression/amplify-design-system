import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

/** Blend a #RRGGBB colour toward white by `t` (0..1). Non-hex input passes through. */
function lighten(hex: string, t: number): string {
  const m = /^#?([0-9a-fA-F]{6})$/.exec(hex);
  if (!m) return hex;
  const n = parseInt(m[1], 16);
  const mix = (c: number) => Math.round(c + (255 - c) * t);
  const r = mix((n >> 16) & 255);
  const g = mix((n >> 8) & 255);
  const b = mix(n & 255);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

/**
 * BlinkerDot — an animated "active/live" indicator, built like a map "you are
 * here" pin (concentric, centre → out):
 *   1. a solid centre dot,
 *   2. a thin WHITE gap around it,
 *   3. a circular outline ring (the "line") — sized to match the other icons,
 *   4. a pulse that expands + fades OUTSIDE the ring, on a loop.
 *
 * Runtime component (a static SVG can't animate) but font-like — it takes a
 * resolved `color` (tints the dot, ring, and pulse) and `size` px (the icon-size
 * token). The dot + ring are lightened slightly; the pulse keeps the full tint
 * as the accent. Native-driver loop (transform + opacity), off the JS thread.
 */
export function BlinkerDot({
  color = "#6531FF",
  size = 24,
}: {
  color?: string;
  size?: number;
}): React.ReactElement {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(pulse, {
        toValue: 1,
        duration: 1600,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const outer = Math.round(size * 0.8); // outline ring — matches other icons' footprint
  const dot = Math.round(size * 0.34); // centre dot
  const offset = (size - outer) / 2; // centre the absolute pulse in the size box
  const soft = lighten(color, 0.18); // slightly-lighter tone for the dot + ring
  const pulseScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.5] });
  const pulseOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.7, 0] });

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      {/* Pulse — expanding + fading disc, centred behind the ring; the part that
          grows past the ring reads as a blinker around it. Full tint. */}
      <Animated.View
        style={{
          position: "absolute",
          top: offset,
          left: offset,
          width: outer,
          height: outer,
          borderRadius: outer / 2,
          backgroundColor: color,
          opacity: pulseOpacity,
          transform: [{ scale: pulseScale }],
        }}
      />
      {/* Outline ring + white interior (white gap shows between ring and dot). */}
      <View
        style={[
          styles.center,
          {
            width: outer,
            height: outer,
            borderRadius: outer / 2,
            borderWidth: 1.5,
            borderColor: soft,
            backgroundColor: "#FFFFFF",
          },
        ]}
      >
        <View
          style={{ width: dot, height: dot, borderRadius: dot / 2, backgroundColor: soft }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", justifyContent: "center" },
  center: { alignItems: "center", justifyContent: "center" },
});
