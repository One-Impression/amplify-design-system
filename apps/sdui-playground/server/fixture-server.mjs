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

  if (url.startsWith(PAGE_PREFIX)) {
    const target = decodeURIComponent(url.slice(PAGE_PREFIX.length));
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
