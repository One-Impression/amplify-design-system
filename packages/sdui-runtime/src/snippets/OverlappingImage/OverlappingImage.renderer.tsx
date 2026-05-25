import React from "react";
import type { Node } from "@one-impression/sdk-native-sdui";
import { OverlappingImageSchema } from "@one-impression/sdk-native-sdui";
import { Box, Image as DSImage } from "@one-impression/ui-native";
import { View, StyleSheet } from "react-native";
import { SduiNode } from "../../sdui-node/index.js";

const styles = StyleSheet.create({
  container: { flexDirection: "row", alignItems: "center" },
  imageWrapper: { marginLeft: -12 },
  firstImage: { marginLeft: 0 },
});

export function OverlappingImageRenderer(node: Node): React.ReactElement {
  return (
    <SduiNode
      data={node.data}
      schema={OverlappingImageSchema.shape.data}
      id={node.id}
      on_click={node.on_click}
      on_load={node.on_load}
      on_view={node.on_view}
      on_dismount={node.on_dismount}
      view_events={node.view_events}
      load_events={node.load_events}
    >
      {(v) => {
        const maxVisible = v.max_visible ?? v.images?.length ?? 0;
        const visibleImages = v.images?.slice(0, maxVisible) ?? [];

        return (
          <View style={styles.container}>
            {visibleImages.map(
              (img: { src: string; alt?: string }, i: number) => (
                <View
                  key={i}
                  style={[styles.imageWrapper, i === 0 && styles.firstImage]}
                >
                  <DSImage
                    source={{ uri: img.src }}
                    accessibilityLabel={img.alt}
                    width={40}
                    height={40}
                    rounded={20}
                    resizeMode="cover"
                  />
                </View>
              ),
            )}
          </View>
        );
      }}
    </SduiNode>
  );
}
