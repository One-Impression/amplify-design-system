# @amplify/mcp-server

MCP server exposing the Amplify Canvas design system to AI agents (Pixel, Claude Code, etc.).

## Tools

| Tool | Purpose |
|------|---------|
| `list_components` | All components in `@amplify/ui` with one-line descriptions and tags. |
| `get_props` | Full prop signature for a component (variants, sizes, states, required props). |
| `find_block` | Search the templates package for blocks matching a use case (e.g. "checkout", "stepper"). |
| `validate_usage` | Validate a JSX snippet against component contracts — reports invalid props/values. |
| `suggest_token` | Given a raw value (color hex, spacing px), suggest the closest Canvas token. |

## Transports

Two entry points:

- `amplify-mcp` — stdio transport (used by Claude Code via `.mcp.json`).
- `amplify-mcp-http` — HTTP transport (used by Pixel runtime via `MCP_URL`).

## Local dev

```bash
npm install
npm run build
npm run dev          # stdio
npm run dev:http     # http on :3500
```

## Consuming from Claude Code

Add to `~/.claude/.mcp.json`:

```json
{
  "mcpServers": {
    "canvas": {
      "command": "npx",
      "args": ["-y", "@amplify/mcp-server"]
    }
  }
}
```

## Consuming from Pixel

```ts
import { createCanvasClient } from '@amplify/mcp-server';

const canvas = createCanvasClient({ url: process.env.MCP_URL });
const components = await canvas.listComponents();
```
