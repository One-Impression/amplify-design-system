import { test } from "node:test";
import assert from "node:assert/strict";
import {
  resolveRenderer,
  setResolveRendererWarnSink,
  _unknownTypesWarned,
  _resetResolveRendererState,
} from "../node-registry.ts";

test("resolveRenderer — known ui_component type returns a renderer", () => {
  _resetResolveRendererState();
  const renderer = resolveRenderer("creator.ui_component.text");
  // We don't assert on identity (the renderer is a React component
  // function pulled in via the registry) — only that resolution
  // succeeded and the return value is a function.
  assert.equal(typeof renderer, "function");
});

test("resolveRenderer — known snippet type returns a renderer", () => {
  _resetResolveRendererState();
  const renderer = resolveRenderer("creator.snippet.steps");
  assert.equal(typeof renderer, "function");
});

test("resolveRenderer — unknown type returns null (does not throw)", () => {
  _resetResolveRendererState();
  // The whole point: a totally bogus type degrades gracefully.
  const renderer = resolveRenderer("creator.ui_component.does_not_exist");
  assert.equal(renderer, null);
});

test("resolveRenderer — unknown bare type (no creator. prefix) returns null", () => {
  _resetResolveRendererState();
  // Types that don't match either prefix used to fall through to
  // `return undefined`; we now explicitly return null.
  const renderer = resolveRenderer("totally.unknown.type");
  assert.equal(renderer, null);
});

test("resolveRenderer — warning fires once per unknown type", () => {
  _resetResolveRendererState();
  const calls: string[] = [];
  setResolveRendererWarnSink((type: string) => {
    calls.push(type);
  });

  resolveRenderer("creator.ui_component.ghost");
  resolveRenderer("creator.ui_component.ghost");
  resolveRenderer("creator.ui_component.ghost");

  assert.deepEqual(calls, ["creator.ui_component.ghost"]);
  assert.ok(_unknownTypesWarned.has("creator.ui_component.ghost"));
});

test("resolveRenderer — distinct unknown types each warn once", () => {
  _resetResolveRendererState();
  const calls: string[] = [];
  setResolveRendererWarnSink((type: string) => {
    calls.push(type);
  });

  resolveRenderer("creator.ui_component.alpha");
  resolveRenderer("creator.ui_component.beta");
  resolveRenderer("creator.ui_component.alpha");
  resolveRenderer("creator.ui_component.beta");

  assert.deepEqual(calls.sort(), [
    "creator.ui_component.alpha",
    "creator.ui_component.beta",
  ]);
});
