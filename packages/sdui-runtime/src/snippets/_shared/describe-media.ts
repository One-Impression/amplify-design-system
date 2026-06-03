import type { Media } from "@one-impression/sdk-native-sdui";

/**
 * Pure descriptor returned by {@link describeMedia}. Each variant maps the
 * nested `MediaSchema` shape onto the flat prop-bag the matching ui-native
 * primitive consumes.
 *
 * Splitting the dispatch from the React layer (in `render-media.tsx`) keeps
 * this module free of `react-native` so it can be unit-tested under plain
 * Node via `node:test`.
 */
export type MediaDescriptor =
  | {
      kind: "image";
      props: {
        source: { uri: string };
        width?: number;
        height?: number;
        aspectRatio?: number;
        resizeMode?: "cover" | "contain" | "stretch" | "center";
        rounded?: number;
      };
    }
  | {
      kind: "icon";
      props: { name: string; size?: string; color?: string };
    }
  | {
      kind: "image_stack";
      props: { images: Array<{ uri: string }>; max?: number };
    }
  | {
      kind: "progress";
      props: {
        value: number;
        trackColor?: string;
        fillColor?: string;
      };
    };

/**
 * Maps a `MediaSchema` node onto the flat prop-bag the matching ui-native
 * primitive consumes.
 *
 * `MediaSchema` from `@one-impression/sdk-native-sdui` is a *nested*
 * discriminated union on `type`:
 *
 *   { type: "image",        image:    ImageSchema }
 *   { type: "icon",         icon:     IconSchema }
 *   { type: "image_stack",  images:   ImageSchema[], max_display?: number }
 *   { type: "progress",     progress: ProgressSchema }
 *
 * Earlier versions of `renderMedia` read the leaf fields as if `Media` were
 * a flat object (`media.src`, `media.name`, ...). That produced `undefined`
 * for valid wire payloads and surfaced as blank icons / missing cover
 * images on aerobars, cards, and info-rows.
 */
export function describeMedia(media: Media): MediaDescriptor | null {
  if (!media) return null;

  switch (media.type) {
    case "image": {
      const { image } = media;
      const rounded =
        image.container_shape === "circle"
          ? 9999
          : image.container_shape === "rounded"
            ? 8
            : undefined;
      return {
        kind: "image",
        props: {
          source: { uri: image.src },
          width: typeof image.width === "number" ? image.width : undefined,
          height: typeof image.height === "number" ? image.height : undefined,
          aspectRatio: image.aspect_ratio,
          resizeMode: image.resize_mode,
          rounded,
        },
      };
    }
    case "icon": {
      const { icon } = media;
      return {
        kind: "icon",
        props: { name: icon.name, size: icon.size, color: icon.color },
      };
    }
    case "image_stack": {
      return {
        kind: "image_stack",
        props: {
          images: media.images.map((img) => ({ uri: img.src })),
          max: media.max_display,
        },
      };
    }
    case "progress": {
      const { progress } = media;
      return {
        kind: "progress",
        props: {
          value: progress.value,
          trackColor: progress.track_color,
          fillColor: progress.color,
        },
      };
    }
    default: {
      // Exhaustiveness check — if a new MediaSchema variant is added in
      // sdk-native-sdui without updating this switch, TypeScript will flag
      // `_exhaustive` as `never`.
      const _exhaustive: never = media;
      void _exhaustive;
      return null;
    }
  }
}
