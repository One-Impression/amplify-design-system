#!/usr/bin/env node
import { createServer } from 'node:http';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { createCanvasServer } from './server.js';

const PORT = parseInt(process.env.PORT ?? '3500', 10);

const main = async (): Promise<void> => {
  const mcpServer = createCanvasServer();
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
  await mcpServer.connect(transport);

  const http = createServer(async (req, res) => {
    if (req.url === '/health') {
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', server: '@one-impression/mcp-server' }));
      return;
    }
    await transport.handleRequest(req, res);
  });

  http.listen(PORT, () => {
    console.error(`[canvas-mcp] http transport listening on :${PORT}`);
  });
};

main().catch((err) => {
  console.error('[canvas-mcp] fatal:', err);
  process.exit(1);
});
