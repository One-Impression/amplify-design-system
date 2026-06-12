import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { PageSchema } from "@one-impression/sdk-native-sdui/schemas";
import {
  NavigatePayloadSchema,
  SheetPayloadSchema,
  ToastPayloadSchema,
  DismissPayloadSchema,
} from "@one-impression/sdk-native-sdui";

const PAGES_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "server", "pages");

const ACTION_TYPES = new Set([
  "navigate", "bff_call", "sheet", "dismiss", "toast", "reload_section",
  "replace_section", "append_items", "set_local", "emit_telemetry",
  "compound", "branch", "deeplink",
]);
const PAYLOAD_SCHEMAS = {
  navigate: NavigatePayloadSchema,
  sheet: SheetPayloadSchema,
  toast: ToastPayloadSchema,
  dismiss: DismissPayloadSchema,
};

// Keys present in `orig` but dropped from `parsed` (Zod strip = unknown field).
function strippedPaths(orig, parsed, path = "") {
  const out = [];
  if (Array.isArray(orig)) {
    orig.forEach((v, i) => out.push(...strippedPaths(v, parsed?.[i], `${path}[${i}]`)));
  } else if (orig && typeof orig === "object") {
    for (const k of Object.keys(orig)) {
      if (!parsed || typeof parsed !== "object" || !(k in parsed)) out.push(`${path}.${k}`);
      else out.push(...strippedPaths(orig[k], parsed[k], `${path}.${k}`));
    }
  }
  return out;
}

// Every object that looks like an SDUI action (its `type` is an action type).
function collectActions(node, path = "", acc = []) {
  if (Array.isArray(node)) {
    node.forEach((v, i) => collectActions(v, `${path}[${i}]`, acc));
  } else if (node && typeof node === "object") {
    if (typeof node.type === "string" && ACTION_TYPES.has(node.type)) {
      acc.push({ path, action: node });
    }
    for (const [k, v] of Object.entries(node)) collectActions(v, `${path}.${k}`, acc);
  }
  return acc;
}

const files = (await readdir(PAGES_DIR)).filter((f) => f.endsWith(".json")).sort();
let totalProblems = 0;

for (const file of files) {
  const raw = await readFile(join(PAGES_DIR, file), "utf8");
  const data = JSON.parse(raw);
  const problems = [];

  // 1 — envelope + nodes + structure against PageSchema
  const res = PageSchema.safeParse(data);
  if (!res.success) {
    for (const issue of res.error.issues) {
      problems.push(`SCHEMA  ${issue.path.join(".") || "(root)"}: ${issue.message}`);
    }
  } else {
    // 2 — fields the schema silently stripped (= not in schema = drift/extension)
    for (const p of strippedPaths(data, res.data)) {
      problems.push(`UNKNOWN field stripped by schema: ${p.replace(/^\./, "")}`);
    }
  }

  // 3 — deep-validate each action payload against its per-type schema
  for (const { path, action } of collectActions(data)) {
    const schema = PAYLOAD_SCHEMAS[action.type];
    if (!schema) continue;
    const pr = schema.safeParse(action.payload ?? {});
    if (!pr.success) {
      for (const issue of pr.error.issues) {
        problems.push(`PAYLOAD ${path.replace(/^\./, "")} (${action.type}).${issue.path.join(".")}: ${issue.message}`);
      }
    } else {
      for (const p of strippedPaths(action.payload ?? {}, pr.data)) {
        problems.push(`PAYLOAD ${path.replace(/^\./, "")} (${action.type}): unknown payload field${p}`);
      }
    }
  }

  totalProblems += problems.length;
  if (problems.length === 0) {
    console.log(`✓ ${file} — valid (envelope + ${collectActions(data).length} actions)`);
  } else {
    console.log(`✗ ${file} — ${problems.length} finding(s):`);
    for (const p of problems) console.log(`    ${p}`);
  }
}

console.log(`\n${totalProblems === 0 ? "ALL CONTRACTS VALID" : `${totalProblems} total finding(s)`} across ${files.length} pages`);
