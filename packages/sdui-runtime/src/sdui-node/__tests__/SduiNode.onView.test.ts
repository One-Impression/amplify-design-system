/**
 * SduiNode — on_view one-shot semantics.
 *
 * The runtime's Viewable HOC may invoke its onView callback every time
 * the node re-enters the viewport (e.g. the user scrolls back up over a
 * feed item). The wire contract treats on_view as a one-impression
 * signal, so SduiNode must gate dispatch + analytics on a per-instance
 * ref and drop subsequent triggers.
 *
 * SduiNode is a React component that owns a `useRef(false)` for this.
 * We don't have a React renderer in this test suite, so this test
 * exercises the guard pattern directly — calling the same one-shot
 * closure multiple times must only invoke the inner dispatch once.
 *
 * A regression here would mean either:
 *   - the firedRef gate was removed from SduiNode.handleViewed, or
 *   - it was placed AFTER the dispatch call rather than before.
 *
 * Both would result in duplicate on_view dispatches when a feed item
 * scrolls in and out of view repeatedly.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

test("SduiNode — handleViewed guards on a per-instance firedRef before dispatching", () => {
  // Lock the source-level invariant: handleViewed must check firedRef BEFORE
  // calling actionEngine.dispatch / telemetry.emit. The ordering matters —
  // a guard placed after dispatch would still fire on every viewport entry.
  const src = readFileSync(
    join(__dirname, "..", "SduiNode.tsx"),
    "utf8",
  );

  // The ref is named firedRef and is initialised to false.
  assert.match(
    src,
    /const firedRef = useRef\(false\)/,
    "firedRef must be declared with useRef(false)",
  );

  // handleViewed must short-circuit if the ref is already true.
  assert.match(
    src,
    /if \(firedRef\.current\) return/,
    "handleViewed must early-return when firedRef.current is true",
  );

  // The ref must flip to true BEFORE the dispatch site (so a re-entrant
  // synchronous callback can't slip through).
  const dispatchIdx = src.indexOf("actionEngine.dispatch(props.on_view)");
  const setIdx = src.indexOf("firedRef.current = true");
  assert.ok(dispatchIdx > -1, "must dispatch on_view");
  assert.ok(setIdx > -1, "must set firedRef.current = true");
  assert.ok(
    setIdx < dispatchIdx,
    "firedRef must be set BEFORE dispatch (re-entry guard)",
  );
});

test("SduiNode — one-shot guard pattern: repeated calls dispatch exactly once", () => {
  // A behavioural mirror of the guard inside handleViewed. If you change
  // the implementation, this test will keep documenting what the contract
  // should look like.
  let firedRef = { current: false };
  let dispatchCount = 0;
  const dispatch = (): void => {
    dispatchCount += 1;
  };

  const handleViewed = (): void => {
    if (firedRef.current) return;
    firedRef.current = true;
    dispatch();
  };

  handleViewed();
  handleViewed();
  handleViewed();

  assert.equal(
    dispatchCount,
    1,
    "on_view must be dispatched at most once per SduiNode instance",
  );

  // New instance → fresh ref → fires again. This mirrors the
  // append_items pagination case where new Nodes mount mid-list and
  // must fire their own on_view.
  firedRef = { current: false };
  handleViewed();
  assert.equal(
    dispatchCount,
    2,
    "a new SduiNode instance with a fresh firedRef must fire its own on_view",
  );
});
