import { test } from "node:test";
import assert from "node:assert/strict";
import { describeMedia } from "../describe-media.js";
import type { Media } from "@one-impression/sdk-native-sdui";

test("describeMedia — image variant reads nested image.src", () => {
  const media: Media = {
    type: "image",
    image: {
      src: "https://cdn.example.com/cover.png",
      width: 120,
      height: 80,
      aspect_ratio: 1.5,
      resize_mode: "cover",
    },
  };
  const desc = describeMedia(media);
  assert.equal(desc?.kind, "image");
  if (desc?.kind !== "image") throw new Error("type guard");
  assert.deepEqual(desc.props.source, {
    uri: "https://cdn.example.com/cover.png",
  });
  assert.equal(desc.props.width, 120);
  assert.equal(desc.props.height, 80);
  assert.equal(desc.props.aspectRatio, 1.5);
  assert.equal(desc.props.resizeMode, "cover");
});

test("describeMedia — image variant maps container_shape to rounded", () => {
  const circle = describeMedia({
    type: "image",
    image: { src: "x", container_shape: "circle" },
  });
  assert.equal(circle?.kind === "image" && circle.props.rounded, 9999);

  const rounded = describeMedia({
    type: "image",
    image: { src: "x", container_shape: "rounded" },
  });
  assert.equal(rounded?.kind === "image" && rounded.props.rounded, 8);

  const square = describeMedia({
    type: "image",
    image: { src: "x", container_shape: "square" },
  });
  // square → no explicit rounded
  assert.equal(square?.kind === "image" && square.props.rounded, undefined);
});

test("describeMedia — icon variant reads nested icon.name", () => {
  const media: Media = {
    type: "icon",
    icon: {
      name: "sdui.icon.heart",
      size: "sdui.icon-size.md",
      color: "sdui.color.primary",
    },
  };
  const desc = describeMedia(media);
  assert.equal(desc?.kind, "icon");
  if (desc?.kind !== "icon") throw new Error("type guard");
  assert.equal(desc.props.name, "sdui.icon.heart");
  assert.equal(desc.props.size, "sdui.icon-size.md");
  assert.equal(desc.props.color, "sdui.color.primary");
});

test("describeMedia — icon variant tolerates missing size/color", () => {
  const desc = describeMedia({
    type: "icon",
    icon: { name: "sdui.icon.star" },
  });
  assert.equal(desc?.kind, "icon");
  if (desc?.kind !== "icon") throw new Error("type guard");
  assert.equal(desc.props.name, "sdui.icon.star");
  assert.equal(desc.props.size, undefined);
  assert.equal(desc.props.color, undefined);
});

test("describeMedia — image_stack variant maps nested images[] to uri[] and max_display to max", () => {
  const media: Media = {
    type: "image_stack",
    images: [{ src: "a.png" }, { src: "b.png" }, { src: "c.png" }],
    max_display: 2,
  };
  const desc = describeMedia(media);
  assert.equal(desc?.kind, "image_stack");
  if (desc?.kind !== "image_stack") throw new Error("type guard");
  assert.deepEqual(desc.props.images, [
    { uri: "a.png" },
    { uri: "b.png" },
    { uri: "c.png" },
  ]);
  assert.equal(desc.props.max, 2);
});

test("describeMedia — progress variant reads nested progress object", () => {
  const media: Media = {
    type: "progress",
    progress: {
      value: 0.6,
      max: 1,
      color: "sdui.color.primary",
      track_color: "sdui.color.neutral-weak",
    },
  };
  const desc = describeMedia(media);
  assert.equal(desc?.kind, "progress");
  if (desc?.kind !== "progress") throw new Error("type guard");
  assert.equal(desc.props.value, 0.6);
  assert.equal(desc.props.fillColor, "sdui.color.primary");
  assert.equal(desc.props.trackColor, "sdui.color.neutral-weak");
});

test("describeMedia — null / undefined input returns null", () => {
  // The runtime guards against falsy input even though the type forbids it,
  // because real wire payloads can be undefined when an optional `media`
  // field is absent.
  assert.equal(describeMedia(null as unknown as Media), null);
  assert.equal(describeMedia(undefined as unknown as Media), null);
});
