import type { ComponentType } from "react";
import { DefaultPageSkeleton } from "./DefaultPageSkeleton.js";
import { FeedSkeleton } from "./FeedSkeleton.js";
import { StandardWithHeroSkeleton } from "./StandardWithHeroSkeleton.js";
import { ListRowsSkeleton } from "./ListRowsSkeleton.js";
import { FormSkeleton } from "./FormSkeleton.js";
import { WebViewSkeleton } from "./WebViewSkeleton.js";

/**
 * Maps skeleton type strings to skeleton components.
 * Used by the 3-tier loader resolution system.
 */
export const skeletonRegistry: Record<string, ComponentType> = {
  default: DefaultPageSkeleton,
  feed: FeedSkeleton,
  "standard-with-hero": StandardWithHeroSkeleton,
  "list-rows": ListRowsSkeleton,
  form: FormSkeleton,
  "web-view": WebViewSkeleton,
};
