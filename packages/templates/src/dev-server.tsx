import { createServer } from 'http';
import { renderPage } from './render';
import { orderingConfigs } from './configs/ordering';

const PORT = 3456;

const server = createServer((req, res) => {
  const url = new URL(req.url || '/', `http://localhost:${PORT}`);
  const path = url.pathname;

  // Index page
  if (path === '/') {
    const links = Object.keys(orderingConfigs)
      .map((name) => `<li><a href="/${name}">${name}</a></li>`)
      .join('\n');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`<!DOCTYPE html><html><head><title>Template Dev Server</title>
<style>body{font-family:Inter,system-ui,sans-serif;max-width:640px;margin:40px auto;padding:0 20px}
a{color:#7C3AED;text-decoration:none}a:hover{text-decoration:underline}
li{margin:8px 0;font-size:16px}h1{color:#1C1917}</style></head>
<body><h1>@amplify/templates Dev Server</h1><ul>${links}</ul></body></html>`);
    return;
  }

  // Render a config
  const configName = path.slice(1);
  const config = orderingConfigs[configName];
  if (!config) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end(`Config not found: ${configName}\nAvailable: ${Object.keys(orderingConfigs).join(', ')}`);
    return;
  }

  try {
    const html = renderPage(config);
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end(`Render error: ${(err as Error).message}\n${(err as Error).stack}`);
  }
});

server.listen(PORT, () => {
  console.log(`Dev server running at http://localhost:${PORT}`);
  console.log(`Available configs: ${Object.keys(orderingConfigs).join(', ')}`);
});
