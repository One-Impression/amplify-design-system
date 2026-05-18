import React, { useEffect, useRef, useState } from "react";
import type { Node } from "@one-impression/sdk-native-sdui";
import { ImageCarouselSchema } from "@one-impression/sdk-native-sdui";
import { ScrollView, Box, Image as DSImage } from "@amplify-ai/ui-native";
import { SduiNode } from "../../sdui-node/index.js";

export function ImageCarouselRenderer(node: Node): React.ReactElement {
  return (
    <SduiNode
      data={node.data}
      schema={ImageCarouselSchema.shape.data}
      id={node.id}
      on_click={node.on_click}
      on_load={node.on_load}
      on_view={node.on_view}
      on_dismount={node.on_dismount}
      view_events={node.view_events}
      load_events={node.load_events}
    >
      {(v) => (
        <ImageCarouselInner
          images={v.images}
          autoScroll={v.auto_scroll}
          intervalMs={v.interval_ms}
        />
      )}
    </SduiNode>
  );
}

function ImageCarouselInner({
  images,
  autoScroll,
  intervalMs,
}: {
  images: Array<{ src: string; alt?: string; aspect_ratio?: number }>;
  autoScroll?: boolean;
  intervalMs?: number;
}): React.ReactElement {
  const scrollRef = useRef<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const count = images?.length ?? 0;

  useEffect(() => {
    if (!autoScroll || count <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % count;
        scrollRef.current?.scrollTo?.({ x: next * 300, animated: true });
        return next;
      });
    }, intervalMs ?? 3000);
    return () => clearInterval(interval);
  }, [autoScroll, intervalMs, count]);

  return (
    <ScrollView
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      ref={scrollRef}
    >
      {images?.map((img, i) => (
        <Box key={i}>
          <DSImage
            source={{ uri: img.src }}
            accessibilityLabel={img.alt}
            resizeMode="cover"
            aspectRatio={img.aspect_ratio}
          />
        </Box>
      ))}
    </ScrollView>
  );
}
