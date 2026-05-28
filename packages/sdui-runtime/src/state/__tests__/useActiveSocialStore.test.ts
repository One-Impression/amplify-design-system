import { test } from "node:test";
import assert from "node:assert/strict";
import { useActiveSocialStore } from "../useActiveSocialStore.ts";

test("useActiveSocialStore — default activeInfluencerId is null", () => {
  // Reset to default before reading — other test files may have set a value.
  useActiveSocialStore.getState().setActiveInfluencerId(null);
  assert.equal(useActiveSocialStore.getState().activeInfluencerId, null);
});

test("useActiveSocialStore — setActiveInfluencerId(value) updates the store", () => {
  useActiveSocialStore.getState().setActiveInfluencerId("inf-abc");
  assert.equal(
    useActiveSocialStore.getState().activeInfluencerId,
    "inf-abc",
  );
  // Clean up so we don't leak state into subsequent test files.
  useActiveSocialStore.getState().setActiveInfluencerId(null);
});

test("useActiveSocialStore — setActiveInfluencerId(null) clears the store", () => {
  useActiveSocialStore.getState().setActiveInfluencerId("inf-xyz");
  useActiveSocialStore.getState().setActiveInfluencerId(null);
  assert.equal(useActiveSocialStore.getState().activeInfluencerId, null);
});
