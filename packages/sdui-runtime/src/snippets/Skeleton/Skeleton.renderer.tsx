import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import type { Node } from "@one-impression/sdk-native-sdui";
import { sdui } from "@one-impression/tokens-creator/react-native";

/**
 * sdui.snippet.skeleton — a generic loading shimmer, composed by the BFF.
 *
 * Pure presentation (no on_click / lifecycle), so it renders directly. The
 * runtime supplies only the shimmer mechanics (an opacity pulse + placeholder
 * shapes); the BFF composes the LAYOUT so the same primitive depicts a header
 * (title line + a right-icon circle + a chip row), a feed card (media + logo
 * circle + tag + lines), a list row, etc. — no shape is hardcoded.
 *
 *   data: {
 *     rows: Row[],          // stacked vertically
 *     repeat?: number,      // render the rows as a group, this many times (default 1)
 *     card?: boolean,       // wrap each group in a card surface (default false)
 *     padding?: number,     // horizontal inset for the group (default 0; card has its own)
 *   }
 *   Row =
 *     | { shape?: "rect"|"line"|"circle", height?, width?, radius? }   // a single bar
 *     | { row: Bar[], justify?: "between"|"start"|"center" }           // a horizontal group
 */
interface SkeletonBar {
  shape?: "rect" | "line" | "circle";
  height?: number;
  width?: number | string;
  radius?: number;
}
interface SkeletonGroup {
  row: SkeletonBar[];
  justify?: "between" | "start" | "center";
}
type SkeletonRow = SkeletonBar | SkeletonGroup;
interface SkeletonData {
  rows?: SkeletonRow[];
  repeat?: number;
  card?: boolean;
  padding?: number;
}

const DEFAULT_CARD_ROWS: SkeletonRow[] = [
  { shape: "rect", height: 140 },
  { shape: "line", width: "70%" },
  { shape: "line", width: "45%" },
];

const BAR = "#E3E3E8";

function barStyle(bar: SkeletonBar): object {
  if (bar.shape === "circle") {
    const size = (bar.width as number) ?? bar.height ?? 40;
    return { width: size, height: size, borderRadius: size / 2, backgroundColor: BAR };
  }
  return {
    height: bar.height ?? (bar.shape === "rect" ? 120 : 14),
    width: (bar.width ?? (bar.shape === "rect" ? "100%" : "60%")) as number | `${number}%`,
    borderRadius: bar.radius ?? (bar.shape === "rect" ? 12 : 6),
    backgroundColor: BAR,
  };
}

const JUSTIFY: Record<string, "space-between" | "flex-start" | "center"> = {
  between: "space-between",
  start: "flex-start",
  center: "center",
};

function SkeletonRowView({ row, first }: { row: SkeletonRow; first: boolean }): React.ReactElement {
  const mt = first ? 0 : sdui.spacing.sm;
  if ("row" in row) {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: sdui.spacing.sm,
          justifyContent: JUSTIFY[row.justify ?? "start"],
          marginTop: mt,
        }}
      >
        {row.row.map((bar, i) => (
          <View key={`bar-${i}`} style={barStyle(bar)} />
        ))}
      </View>
    );
  }
  return <View style={[barStyle(row), { marginTop: mt }]} />;
}

export function SkeletonRenderer(node: Node): React.ReactElement {
  const data = (node.data ?? {}) as SkeletonData;
  const rows = data.rows && data.rows.length > 0 ? data.rows : DEFAULT_CARD_ROWS;
  const card = data.card ?? !data.rows;
  const repeat = Math.max(1, data.repeat ?? 1);

  const pulse = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 0.9, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  return (
    <Animated.View style={{ opacity: pulse }}>
      {Array.from({ length: repeat }).map((_, g) => (
        <View
          key={`skeleton-group-${g}`}
          style={[
            card ? styles.card : styles.group,
            data.padding != null ? { paddingHorizontal: data.padding } : null,
          ]}
        >
          {rows.map((row, i) => (
            <SkeletonRowView key={`row-${g}-${i}`} row={row} first={i === 0} />
          ))}
        </View>
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  group: { marginBottom: sdui.spacing.md },
  card: {
    marginBottom: sdui.spacing.md,
    padding: sdui.spacing.md,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: BAR,
  },
});
