import React from "react";
import { StyleSheet, View } from "react-native";
import type { Node } from "@one-impression/sdk-native-sdui";
import { GroupChipsSchema } from "@one-impression/sdk-native-sdui";
import { SduiNode } from "../../sdui-node/index.js";
import { Interpreter } from "../../interpreter/index.js";

export function GroupChipsRenderer(node: Node): React.ReactElement {
  return (
    <SduiNode
      data={node.data}
      schema={GroupChipsSchema.shape.data}
      id={node.id}
      on_click={node.on_click}
      on_load={node.on_load}
      on_view={node.on_view}
      on_dismount={node.on_dismount}
      view_events={node.view_events}
      load_events={node.load_events}
    >
      {(v) => (
        // A wrapping row that sizes to its content height. (Previously a
        // ui-native ScrollView whose `flex: 1` base collapsed to zero height in
        // a column with no fixed height — e.g. a pinned page header — leaving
        // the chips invisible. A plain row View has no such viewport-height
        // dependency and wraps if the chips overflow.)
        <View style={styles.row}>
          {v.items?.map((item: Node, i: number) => (
            <Interpreter key={item.id || i} node={item} />
          ))}
        </View>
      )}
    </SduiNode>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});
