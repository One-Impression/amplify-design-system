#!/usr/bin/env node
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createCanvasServer } from './server.js';

const main = async (): Promise<void> => {
  const server = createCanvasServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
};

main().catch((err) => {
  console.error('[canvas-mcp] fatal:', err);
  process.exit(1);
});
