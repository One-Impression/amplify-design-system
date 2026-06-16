import { createServer } from "node:http";
import { readFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

/**
 * Playground fixture server — serves raw SDUI page contracts as JSON.
 *
 * Each page is a hand-editable JSON file in ./pages/<target>.json (the literal
 * wire contract — exactly what the app receives, no TS builder in between). The
 * server reads the file fresh on every request, so editing a fixture is picked
 * up on the NEXT fetch with no restart and no watcher. UI/renderer edits keep
 * their normal metro Fast Refresh; only page content lives here.
 *
 * `GET /sdui/page/:target` → ./pages/:target.json   |   `GET /healthz`
 * `POST /submit/:formId` → echoes the body; 422 with field errors for a
 *   server-only "name taken" rule (demonstrates the submit on_error path).
 *
 * Run: `npm run serve:fixtures`. Reach from the emulator with
 * `adb reverse tcp:3012 tcp:3012`.
 */
const PORT = Number(process.env.PORT ?? 3012);
// Optional simulated reload latency (ms) so the shimmer/skeleton is observable
// while hand-testing the playground. Off by default (0) so it never slows
// automated callers; set SDUI_FIXTURE_LATENCY_MS=3000 to watch the skeletons.
const RELOAD_LATENCY_MS = Number(process.env.SDUI_FIXTURE_LATENCY_MS) || 0;
const PAGE_PREFIX = "/sdui/page/";
const SUBMIT_PREFIX = "/submit/";
const HERE = dirname(fileURLToPath(import.meta.url));
const PAGES_DIR = join(HERE, "pages");
// The full icon manifest (all 225 glyphs) the IconStoreProvider fetches.
const ICONS_MANIFEST = "/v1/creator/assets/icons-manifest";
const ICONS_MANIFEST_PATH = join(
  HERE,
  "../../../packages/tokens-creator/dist/icons/manifest.json",
);

const json = (res, status, body) => {
  res.writeHead(status, { "content-type": "application/json" });
  res.end(typeof body === "string" ? body : JSON.stringify(body));
};

const listTargets = async () =>
  (await readdir(PAGES_DIR))
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.slice(0, -".json".length));

/** Collect a request body and parse it as JSON ({} on empty/invalid). */
const readJsonBody = (req) =>
  new Promise((resolve) => {
    let raw = "";
    req.on("data", (c) => (raw += c));
    req.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        resolve({});
      }
    });
  });

// ─── Campaigns feed — request-context demo (tabs + multi-select filters) ─────
// The whole feed page is a function of a request context: { tab, filters }. The
// header (filter chips) + footer (tabs) are dumb selection surfaces; the BFF
// owns the page per context. Tapping a chip toggles it in `selected_filters`
// (set_local array_toggle) then fires a DEBOUNCED `reload_page`; tapping a tab
// sets `selected_tab`, clears filters, and reloads immediately; pull-to-refresh
// reloads the current context. `reload_page` re-fetches THIS route with the
// bound context and the runtime replaces the whole page (header + filters +
// footer + items). The cursor for context lives entirely in the local store via
// `{ ref: "$.local.* }` bindings — the client takes no filtering decisions.
const TABS = [
  { id: "for_you", label: "For You" },
  { id: "applied", label: "Applied" },
  { id: "saved", label: "Saved" },
];
const FILTERS = [
  { id: "beauty", label: "Beauty" },
  { id: "wellness", label: "Wellness" },
  { id: "fashion", label: "Fashion" },
  { id: "tech", label: "Tech" },
];
// Fixed catalog — each campaign carries a category + the tabs it appears under.
const CAMPAIGNS = [
  { id: 1, brand: "Lumina Beauty", category: "beauty", reward: 3000, tabs: ["for_you", "saved"] },
  { id: 2, brand: "Verde Skincare", category: "beauty", reward: 2200, tabs: ["for_you", "applied"] },
  { id: 3, brand: "Nova Wellness", category: "wellness", reward: 4500, tabs: ["for_you"] },
  { id: 4, brand: "Bloom Organics", category: "wellness", reward: 1800, tabs: ["for_you", "saved"] },
  { id: 5, brand: "Ceré Paris", category: "fashion", reward: 5200, tabs: ["for_you", "applied"] },
  { id: 6, brand: "Indigo Hair", category: "fashion", reward: 2600, tabs: ["for_you"] },
  { id: 7, brand: "PixelPlay", category: "tech", reward: 6000, tabs: ["for_you", "applied"] },
  { id: 8, brand: "Solstice Audio", category: "tech", reward: 3400, tabs: ["for_you", "saved"] },
  { id: 9, brand: "Aura Cosmetics", category: "beauty", reward: 2800, tabs: ["for_you"] },
  { id: 10, brand: "Terra Fit", category: "wellness", reward: 3900, tabs: ["for_you", "applied"] },
];

const CATEGORY_LABEL = Object.fromEntries(FILTERS.map((f) => [f.id, f.label]));

// One region-scoped `reload` verb. `regions` names what it refreshes:
//   ["content"]            → filter toggle / pull-refresh (header + footer stay)
//   ["header","content"]   → tab switch / first load (footer shell stays)
// The runtime sends `regions` + the bound context to the server, shows each
// region's skeleton while in flight, and merges the partial response. The
// context cursor lives entirely in the local store via `{ ref: "$.local.* }`.
const boundContext = {
  tab: { ref: "$.local.selected_tab" },
  filter: { ref: "$.local.selected_filters" },
};
const reload = (regions, debounceMs) => ({
  type: "reload",
  ...(debounceMs ? { debounce_ms: debounceMs } : {}),
  payload: { endpoint: "creator.campaigns.list", method: "GET", regions, query_params: { ...boundContext } },
});

function campaignCard(c) {
  return {
    type: "sdui.snippet.composite",
    id: `campaign-${c.id}`,
    on_click: { type: "navigate", payload: { target: "creator.campaigns.detail", op: "push", params: { id: String(c.id) } } },
    data: {
      layout: "cover",
      surface: { bg_color: "sdui.color.neutral-inverse", border_color: "sdui.color.neutral-subtle" },
      media: { type: "creator.snippet.banner_image", id: `m-${c.id}`, data: { image: { src: `https://picsum.photos/seed/camp${c.id}/640/320`, aspect_ratio: 2 } } },
      float: { type: "creator.ui_component.image", id: `a-${c.id}`, data: { src: `https://picsum.photos/seed/brand${c.id}/120`, width: 64, height: 64, border_radius: "sdui.radius.full" } },
      float_end: [
        { type: "creator.ui_component.tag", id: `cash-${c.id}`, data: { label: { text: `₹${c.reward.toLocaleString("en-IN")} Cash` }, bg_color: "sdui.color.positive-weak", text_color: "sdui.color.positive" } },
      ],
      body: [
        { type: "creator.snippet.info_row", id: `n-${c.id}`, data: { title: { text: c.brand, font_weight: "medium", font_size: "sdui.font-size.lg" } } },
        { type: "creator.snippet.info_row", id: `meta-${c.id}`, data: { title: { text: `${CATEGORY_LABEL[c.category]} · Micro creators`, font_size: "sdui.font-size.sm", color: "sdui.color.neutral-medium" } } },
      ],
      footer: { type: "creator.snippet.info_row", id: `f-${c.id}`, data: { title: { text: "Apply now — closes soon", font_size: "sdui.font-size.sm" } } },
    },
  };
}

// A filter chip. `selected` is a RENDER BINDING to local state — it re-renders
// the instant the chip toggles, no reload (the renderer shows a × when
// selected). Tapping toggles the filter into `selected_filters` and fires a
// debounced CONTENT-only reload; the header (and these chips) stay static.
function filterChip(f) {
  return {
    type: "creator.snippet.chip",
    id: `filter-${f.id}`,
    on_click: {
      type: "compound",
      payload: {
        actions: [
          { type: "set_local", payload: { key: "selected_filters", op: "array_toggle", value: f.id } },
          reload(["content"], 400),
        ],
      },
    },
    data: {
      label: { text: f.label },
      // reactive: true when selected_filters includes this filter's id.
      selected: { ref: "$.local.selected_filters", contains: f.id },
      bg_color: "sdui.color.neutral-weak",
      selected_bg_color: "sdui.color.primary-weak",
    },
  };
}

// A footer tab. `active` is a RENDER BINDING to local `selected_tab` — it
// highlights instantly on tap (optimistic), before the API returns. Tapping
// sets the tab, clears filters (filters are local to a tab), and fires a
// full-page reload.
function tabNode(t) {
  return {
    type: "creator.ui_component.tab",
    id: `tab-${t.id}`,
    on_click: {
      type: "compound",
      payload: {
        actions: [
          { type: "set_local", payload: { key: "selected_tab", op: "set", value: t.id } },
          { type: "set_local", payload: { key: "selected_filters", op: "set", value: [] } },
          reload(["header", "content"], 0),
        ],
      },
    },
    // reactive: active when selected_tab equals this tab's id.
    data: { label: { text: t.label }, active: { ref: "$.local.selected_tab", equals: t.id } },
  };
}

function selectCampaigns(tab, filters) {
  return CAMPAIGNS.filter(
    (c) => c.tabs.includes(tab) && (filters.length === 0 || filters.includes(c.category)),
  );
}

// ── Regions ──────────────────────────────────────────────────────────────────
// header region = [page_header, group_chips(filters)] — a Node[] the runtime
// stacks in the header zone. Per-tab (refreshed on tab switch). content region =
// the items array. footer region = the tabs shell (loaded once).

// ── Settings page (3rd tab) ──────────────────────────────────────────────────
// Demonstrates that a totally different page is JUST a different BFF response:
// the `saved` tab returns a simple header + info-row + group snippets instead of
// the campaign feed. Same region reload, same runtime — no frontend change.
// info_row is a full list row: left media (avatar/icon), title + subtitle, a
// right-side tag/badge/progress, and a chevron. Same snippet drives every row
// in the Profile screen — only the slots filled differ.
const infoRow = (id, text, opts = {}) => ({
  type: "creator.snippet.info_row",
  id,
  data: {
    title: { text, font_size: opts.size ?? "sdui.font-size.md", font_weight: opts.weight ?? "medium" },
    ...(opts.subtitle
      ? { subtitle: { text: opts.subtitle, color: "sdui.color.neutral-medium", font_size: "sdui.font-size.sm" } }
      : {}),
    ...(opts.avatar
      ? { left_media: { type: "image", image: { src: opts.avatar, width: 48, height: 48, container_shape: "circle" } } }
      : opts.icon
        ? { left_media: { type: "icon", icon: { name: opts.icon, color: "sdui.color.primary" } } }
        : {}),
    ...(opts.tag
      ? { tag: { label: { text: opts.tag, color: opts.tagColor ?? "sdui.color.notice" }, bg_color: opts.tagBg ?? "sdui.color.notice-weak" } }
      : {}),
    ...(opts.progress != null
      ? { progress: { value: opts.progress, max: 100, label: { text: `${opts.progress}%` } } }
      : {}),
    ...(opts.ring != null
      ? {
          right_media: {
            type: "progress",
            progress: {
              value: opts.ring,
              max: 100,
              shape: "ring",
              label: { text: `${opts.ring}%` },
              color: "sdui.color.primary",
              track_color: "sdui.color.neutral-subtle",
            },
          },
        }
      : {}),
    ...(opts.chevron === false || opts.ring != null
      ? {}
      : { right_icon: { name: "chevron-right", color: "sdui.color.neutral-medium" } }),
    ...(opts.card ? { card: opts.card === true ? {} : opts.card } : {}),
  },
});
const sectionHeader = (id, text) => ({
  type: "creator.snippet.section_header",
  id,
  data: { title: { text, font_weight: "bold", font_size: "sdui.font-size.lg" } },
});
// Carded vertical group — one white rounded card surface wrapping the rows
// (same `group_config` + `card` pattern the home page uses for its sections).
// Flat (no elevation) so every card reads consistently with the "Need help"
// tiles, which render through info_row's `card` and pass no elevation.
const group = (id, items) => ({
  type: "creator.snippet.group_config",
  id,
  data: { stacking: "vertical", card: { bg_color: "sdui.color.neutral-inverse" }, items },
});
// Horizontal equal-width cards (e.g. the 3 "Need help" tiles) — each child carries
// its own card surface; item_flex:"equal" splits the row width evenly.
const groupRow = (id, items) => ({
  type: "creator.snippet.group_config",
  id,
  data: { stacking: "horizontal", item_flex: "equal", gap: "sdui.spacing.sm", items },
});

const settingsHeader = () => [
  {
    type: "creator.snippet.page_header",
    id: "settings-hdr",
    data: {
      title: { text: "Profile", font_size: "sdui.font-size.xl", font_weight: "bold", color: "sdui.color.neutral-inverse" },
      background: { gradient: { colors: ["#7C3AED", "#F2F2F2"], angle: 180 } },
    },
  },
];
const settingsContent = () => [
  // Profile card — avatar (left media) + name + phone + chevron.
  infoRow("set-name", "Sonali Kalra", {
    weight: "bold", size: "sdui.font-size.lg", subtitle: "+91 99584 78802",
    avatar: "https://picsum.photos/seed/sonali/120",
  }),
  group("set-earnings", [infoRow("set-earn", "My earnings", { icon: "earnings" })]),
  // "Get discovered quickly" — header row carries the progress circle (no chevron),
  // sub-rows carry a left icon + a count tag + chevron.
  group("set-discover", [
    infoRow("set-disc-h", "Get discovered quickly", {
      weight: "bold", subtitle: "Complete your profile to attract brands", ring: 41,
    }),
    infoRow("set-personal", "Personal details", { icon: "profile-icon", tag: "8/9" }),
    infoRow("set-about-me", "About me", { icon: "key-message", tag: "2/6" }),
    infoRow("set-social", "Connect social accounts", { icon: "connect-social-accounts", subtitle: "To get Verified tag", tag: "0" }),
  ]),
  group("set-paid", [
    infoRow("set-paid-h", "Get paid quickly", {
      weight: "bold", subtitle: "Set up payment details to receive payments", ring: 0,
    }),
    infoRow("set-kyc", "KYC details", { icon: "kyc-details", tag: "Not Verified", tagColor: "sdui.color.negative", tagBg: "sdui.color.negative-weak" }),
    infoRow("set-pay", "Payment methods", { icon: "payment-details", tag: "0" }),
    infoRow("set-ship", "Shipping address", { icon: "document", tag: "0" }),
  ]),
  group("set-actions", [
    infoRow("set-prof-actions", "Profile actions", { icon: "nav-profile" }),
    infoRow("set-about-app", "About", { icon: "document" }),
  ]),
  sectionHeader("set-help-h", "Need help"),
  groupRow("set-help", [
    infoRow("set-call", "Call", { icon: "call-us", chevron: false, card: true }),
    infoRow("set-email", "Email", { icon: "email-us", chevron: false, card: true }),
    infoRow("set-chat", "Chat", { icon: "chat-with-us", chevron: false, card: true }),
  ]),
];

function headerRegion(tab, filters) {
  if (tab === "saved") return settingsHeader();
  const tabLabel = TABS.find((t) => t.id === tab).label;
  const subtitle =
    filters.length > 0
      ? `${selectCampaigns(tab, filters).length} in ${filters.map((f) => CATEGORY_LABEL[f]).join(", ")}`
      : `${selectCampaigns(tab, filters).length} campaigns`;
  return [
    {
      type: "creator.snippet.page_header",
      id: "feed-hdr",
      data: {
        title: { text: "My Campaigns", font_size: "sdui.font-size.xl", font_weight: "bold", color: "sdui.color.neutral-inverse" },
        subtitle: { text: `${tabLabel} · ${subtitle}`, color: "sdui.color.neutral-inverse" },
        right_icon: { name: "search", color: "sdui.color.neutral-inverse" },
        background: { gradient: { colors: ["#7C3AED", "#F2F2F2"], angle: 180 } },
      },
    },
    // Chips' selected state is render-bound to local — instant, no reload.
    { type: "creator.snippet.group_chips", id: "feed-filters", data: { items: FILTERS.map(filterChip) } },
  ];
}

const contentItems = (tab, filters) =>
  tab === "saved" ? settingsContent() : selectCampaigns(tab, filters).map(campaignCard);

// Per-region skeletons (BFF-composed, cached in the shell so they show
// instantly). Composed to MATCH the content they stand in for:
//   header  → title line + right-icon circle (spaced), subtitle, a chip row
//   content → cards: media + (logo circle + cash-tag pill) + brand + meta
const headerSkeleton = {
  type: "creator.snippet.skeleton",
  id: "skel-header",
  data: {
    padding: 16,
    rows: [
      { row: [{ shape: "line", height: 24, width: "55%" }, { shape: "circle", width: 24 }], justify: "between" },
      { shape: "line", height: 14, width: "35%" },
      // filter chip row — four rounded pills
      { row: FILTERS.map(() => ({ shape: "rect", height: 32, width: 76, radius: 16 })) },
    ],
  },
};
const contentSkeleton = {
  type: "creator.snippet.skeleton",
  id: "skel-content",
  data: {
    card: true,
    repeat: 4,
    rows: [
      { shape: "rect", height: 140 },
      // overlapping logo circle + cash-tag pill
      { row: [{ shape: "circle", width: 48 }, { shape: "rect", height: 28, width: 96, radius: 14 }], justify: "between" },
      { shape: "line", height: 18, width: "55%" },
      { shape: "line", height: 12, width: "40%" },
    ],
  },
};

// The SHELL: footer (loaded once) + per-region skeletons; on_load seeds the
// default context and fires reload(["header","content"]) to stream the tab in.
function buildShell() {
  return {
    id: "demo.feed",
    title: "My Campaigns",
    protocol_version: "1.0.0",
    layout: "feed",
    on_load: {
      type: "compound",
      payload: {
        actions: [
          { type: "set_local", payload: { key: "selected_tab", op: "set", value: TABS[0].id } },
          { type: "set_local", payload: { key: "selected_filters", op: "set", value: [] } },
          reload(["header", "content"], 0),
        ],
      },
    },
    on_refresh: reload(["content"], 0),
    data: {
      footer: { type: "creator.snippet.tabs_footer", id: "feed-tabs", data: { items: TABS.map(tabNode) } },
      header_skeleton: headerSkeleton,
      content_skeleton: contentSkeleton,
    },
    items: [],
  };
}

// A `reload` partial response: only the requested regions.
function buildPartial(regions, tab, filters) {
  const out = {};
  if (regions.includes("header")) out.data = { ...(out.data ?? {}), header: headerRegion(tab, filters) };
  if (regions.includes("content")) out.items = contentItems(tab, filters);
  return out;
}

const server = createServer(async (req, res) => {
  const url = req.url ?? "/";
  // eslint-disable-next-line no-console
  console.log(`[fixture-server] ${req.method} ${url}`);
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (url === "/healthz") {
    json(res, 200, { ok: true, pages: await listTargets() });
    return;
  }

  // Icon manifest — IconStoreProvider fetches this (with ?known_version=…) and
  // persists { version, icons } to MMKV. We always return the full manifest.
  if (url.startsWith(ICONS_MANIFEST)) {
    try {
      const m = JSON.parse(await readFile(ICONS_MANIFEST_PATH, "utf8"));
      json(res, 200, { version: m.version, icons: m.icons });
    } catch (e) {
      json(res, 500, { error: `icon manifest unavailable: ${String(e)}` });
    }
    return;
  }

  // Form submission target. Echoes the merged body the runtime POSTs, and
  // demonstrates server-authoritative field errors: a "taken" campaign name is
  // rejected with a 422 the client can't pre-check (a uniqueness rule).
  if (req.method === "POST" && url.startsWith(SUBMIT_PREFIX)) {
    const formId = decodeURIComponent(url.slice(SUBMIT_PREFIX.length));
    const submitted = await readJsonBody(req);
    console.log(`[fixture-server] submit ${formId}:`, JSON.stringify(submitted));
    if (typeof submitted.campaign_name === "string" && submitted.campaign_name.trim().toLowerCase() === "taken") {
      json(res, 422, { errors: { campaign_name: "That campaign name is taken" } });
      return;
    }
    json(res, 200, { ok: true, form_id: formId, received: submitted });
    return;
  }

  // Campaigns `reload` — lands here with `regions` (CSV) + the bound context
  // (tab + filter CSV). Returns a PARTIAL page with only the requested regions:
  // `["content"]` → { items }, `["header","content"]` → { data:{header}, items }.
  if (url.startsWith("/v1/creator/campaigns")) {
    // Simulate reload latency only when explicitly opted in (see RELOAD_LATENCY_MS).
    if (RELOAD_LATENCY_MS > 0) await new Promise((r) => setTimeout(r, RELOAD_LATENCY_MS));
    const params = new URL(url, "http://x").searchParams;
    const tab = TABS.some((t) => t.id === params.get("tab")) ? params.get("tab") : TABS[0].id;
    const filterCsv = params.get("filter") || "";
    const filters = (filterCsv ? filterCsv.split(",") : []).filter((f) => FILTERS.some((x) => x.id === f));
    const regions = (params.get("regions") || "content").split(",").filter(Boolean);
    console.log(`[fixture-server] campaigns reload regions=[${regions.join(",")}] tab=${tab} filters=[${filters.join(",")}]`);
    json(res, 200, buildPartial(regions, tab, filters));
    return;
  }

  if (url.startsWith(PAGE_PREFIX)) {
    const target = decodeURIComponent(url.slice(PAGE_PREFIX.length));
    // Generated campaigns feed (shell-first region demo) — overrides any on-disk
    // fixture of the same name. Initial load returns the SHELL (footer +
    // skeletons); on_load streams in the default tab via reload.
    if (target === "demo.feed") {
      json(res, 200, buildShell());
      return;
    }
    // Guard against path traversal — target is a flat page id, never a path.
    if (target.includes("/") || target.includes("..")) {
      json(res, 400, { error: `invalid target "${target}"` });
      return;
    }
    try {
      // Read fresh every request so a fixture edit is served immediately.
      const raw = await readFile(join(PAGES_DIR, `${target}.json`), "utf8");
      json(res, 200, raw); // pass through verbatim — it's already the contract
    } catch {
      json(res, 404, {
        error: `no page for target "${target}"`,
        available: await listTargets(),
      });
    }
    return;
  }

  json(res, 404, { error: "not found", routes: [`${PAGE_PREFIX}:target`, "/healthz"] });
});

server.listen(PORT, "0.0.0.0", async () => {
  // eslint-disable-next-line no-console
  console.log(
    `[fixture-server] ${(await listTargets()).length} pages on ` +
      `http://0.0.0.0:${PORT}${PAGE_PREFIX}:target`,
  );
});
