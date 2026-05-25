import React from "react";
import {
  Image as DSImage,
  Icon as DSIcon,
  ImageStack as DSImageStack,
  ProgressIndicator as DSProgressIndicator,
} from "@one-impression/ui-native";

interface MediaImage {
  type: "image";
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  resize_mode?: string;
  border_radius?: number;
}

interface MediaIcon {
  type: "icon";
  name: string;
  size?: number;
  color?: string;
}

interface MediaImageStack {
  type: "image_stack";
  images: Array<{ src: string; alt?: string }>;
  max_visible?: number;
}

interface MediaProgress {
  type: "progress";
  value: number;
  track_color?: string;
  fill_color?: string;
  height?: number;
}

type Media = MediaImage | MediaIcon | MediaImageStack | MediaProgress;

export function renderMedia(media: Media): React.ReactElement | null {
  if (!media) return null;

  switch (media.type) {
    case "image":
      return (
        <DSImage
          source={{ uri: media.src }}
          accessibilityLabel={media.alt}
          width={media.width}
          height={media.height}
          resizeMode={media.resize_mode}
          rounded={media.border_radius}
        />
      );
    case "icon":
      return (
        <DSIcon
          name={media.name}
          size={media.size}
          color={media.color}
        />
      );
    case "image_stack":
      return (
        <DSImageStack
          images={media.images.map((img) => ({ uri: img.src }))}
          maxVisible={media.max_visible}
        />
      );
    case "progress":
      return (
        <DSProgressIndicator
          value={media.value}
          trackColor={media.track_color}
          fillColor={media.fill_color}
          height={media.height}
        />
      );
    default:
      return null;
  }
}
