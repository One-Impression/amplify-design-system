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

// ─── Campaigns feed (composite cards + backend-driven infinite scroll) ───────
// The feed renders `sdui.snippet.composite` cards as top-level page.items. The
// 2nd-last card of each batch carries a `viewability.on_view` (policy: once)
// that bff_calls this server for the next batch; the server returns an
// `append_items` action. The LAST batch omits `on_view`, so it self-terminates
// — the cursor lives entirely here, never on the client.
const FEED_PAGE_SIZE = 5;
const FEED_TOTAL = 15;
const FEED_BRANDS = [
  "Lumina Beauty", "Verde Skincare", "Aura Cosmetics", "Nova Wellness",
  "Bloom Organics", "Ceré Paris", "Indigo Hair", "Solstice Fragrance",
];

function campaignCard(i) {
  const brand = FEED_BRANDS[(i - 1) % FEED_BRANDS.length];
  return {
    type: "sdui.snippet.composite",
    id: `campaign-${i}`,
    on_click: { type: "navigate", payload: { target: "creator.campaigns.detail", op: "push", params: { id: String(i) } } },
    data: {
      layout: "cover",
      surface: { bg_color: "sdui.color.neutral-inverse", border_color: "sdui.color.neutral-subtle" },
      media: { type: "creator.snippet.banner_image", id: `m-${i}`, data: { image: { src: `https://picsum.photos/seed/camp${i}/640/320`, aspect_ratio: 2 } } },
      float: { type: "creator.ui_component.image", id: `a-${i}`, data: { src: `https://picsum.photos/seed/brand${i}/120`, width: 64, height: 64, border_radius: "sdui.radius.full" } },
      float_end: [
        { type: "creator.ui_component.tag", id: `cash-${i}`, data: { label: { text: `₹${(1000 + i * 200).toLocaleString("en-IN")} Cash` }, bg_color: "sdui.color.positive-weak", text_color: "sdui.color.positive" } },
      ],
      body: [
        { type: "creator.snippet.info_row", id: `n-${i}`, data: { title: { text: `${brand} · #${i}`, font_weight: "medium", font_size: "sdui.font-size.lg" } } },
        { type: "creator.snippet.info_row", id: `meta-${i}`, data: { title: { text: "Beauty · Micro creators", font_size: "sdui.font-size.sm", color: "sdui.color.neutral-medium" } } },
      ],
      footer: { type: "creator.snippet.info_row", id: `f-${i}`, data: { title: { text: "Apply now — closes soon", font_size: "sdui.font-size.sm" } } },
    },
  };
}

// `nextCursor` null ⇒ last page (no on_view ⇒ stops). Otherwise the 2nd-last
// card carries the load-more trigger pointing at the next cursor.
function campaignBatch(startId, count, nextCursor) {
  const cards = [];
  for (let k = 0; k < count; k++) {
    const card = campaignCard(startId + k);
    if (nextCursor !== null && k === count - 2) {
      card.viewability = {
        on_view: [{
          id: "load-more",
          policy: "once",
          action: { type: "bff_call", payload: { endpoint: "creator.campaigns.list", method: "GET", query_params: { cursor: String(nextCursor) } } },
        }],
      };
    }
    cards.push(card);
  }
  return cards;
}

function buildFeedPage() {
  const nextCursor = FEED_TOTAL > FEED_PAGE_SIZE ? FEED_PAGE_SIZE : null;
  return {
    id: "demo.feed",
    title: "Campaigns",
    protocol_version: "1.0.0",
    layout: "feed",
    data: {
      header: {
        type: "creator.snippet.page_header",
        id: "feed-hdr",
        data: {
          title: { text: "Campaigns", font_size: "sdui.font-size.xl", font_weight: "bold", color: "sdui.color.neutral-inverse" },
          subtitle: { text: "infinite scroll · composite cards", color: "sdui.color.neutral-inverse" },
          background: { gradient: { colors: ["#7C3AED", "#F2F2F2"], angle: 180 } },
        },
      },
    },
    items: campaignBatch(1, FEED_PAGE_SIZE, nextCursor),
  };
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

  // Campaigns pagination — the load-more bff_call (creator.campaigns.list →
  // /v1/creator/campaigns) lands here. Returns an `append_items` action that the
  // bff_call handler dispatches. The cursor is tracked server-side via the query
  // param baked into each batch's load-more trigger; the final page omits it.
  if (url.startsWith("/v1/creator/campaigns")) {
    const cursor = Number(new URL(url, "http://x").searchParams.get("cursor") || "0");
    const count = Math.min(FEED_PAGE_SIZE, FEED_TOTAL - cursor);
    if (count <= 0) {
      json(res, 200, { action: { type: "append_items", payload: { target: "demo.feed", items: [], has_more: false } } });
      return;
    }
    const nextCursor = cursor + count < FEED_TOTAL ? cursor + count : null;
    const items = campaignBatch(cursor + 1, count, nextCursor);
    console.log(`[fixture-server] campaigns cursor=${cursor} → cards ${cursor + 1}..${cursor + count} (next=${nextCursor})`);
    json(res, 200, { action: { type: "append_items", payload: { target: "demo.feed", items, has_more: nextCursor !== null } } });
    return;
  }

  if (url.startsWith(PAGE_PREFIX)) {
    const target = decodeURIComponent(url.slice(PAGE_PREFIX.length));
    // Generated campaigns feed (composite cards + infinite scroll) — overrides
    // any on-disk fixture of the same name.
    if (target === "demo.feed") {
      json(res, 200, buildFeedPage());
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
