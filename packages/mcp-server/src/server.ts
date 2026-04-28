import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { listComponents, listComponentsSchema } from './tools/list-components.js';
import { getProps, getPropsSchema } from './tools/get-props.js';
import { findBlock, findBlockSchema } from './tools/find-block.js';
import { validateUsage, validateUsageSchema } from './tools/validate-usage.js';
import { suggestToken, suggestTokenSchema } from './tools/suggest-token.js';
import { z } from 'zod';

const tools = [
  {
    name: 'list_components',
    description: 'List components in @amplify/ui with their variants, sizes, and forwardRef status.',
    schema: listComponentsSchema,
    handler: listComponents,
  },
  {
    name: 'get_props',
    description: 'Get the full prop signature for a component — types, defaults, and enum values.',
    schema: getPropsSchema,
    handler: getProps,
  },
  {
    name: 'find_block',
    description: 'Search the templates package for blocks/configs matching a use case.',
    schema: findBlockSchema,
    handler: findBlock,
  },
  {
    name: 'validate_usage',
    description: 'Validate a JSX snippet against component contracts. Reports unknown props and invalid enum values.',
    schema: validateUsageSchema,
    handler: validateUsage,
  },
  {
    name: 'suggest_token',
    description: 'Given a raw value (hex color, spacing px, etc.), suggest the closest Canvas token.',
    schema: suggestTokenSchema,
    handler: suggestToken,
  },
] as const;

const zodToInputSchema = (schema: z.ZodTypeAny): Record<string, unknown> => {
  if (!(schema instanceof z.ZodObject)) return { type: 'object' };
  const properties: Record<string, unknown> = {};
  const required: string[] = [];
  const shape = schema.shape as Record<string, z.ZodTypeAny>;
  for (const [key, child] of Object.entries(shape)) {
    const def = child._def as { description?: string; typeName: string };
    const isOptional = child.isOptional() || child instanceof z.ZodDefault;
    let type: string = 'string';
    if (child instanceof z.ZodNumber) type = 'number';
    else if (child instanceof z.ZodBoolean) type = 'boolean';
    else if (child instanceof z.ZodEnum) type = 'string';
    properties[key] = { type, description: def.description };
    if (!isOptional) required.push(key);
  }
  return { type: 'object', properties, required };
};

export const createCanvasServer = (): Server => {
  const server = new Server(
    { name: '@amplify/mcp-server', version: '0.1.0' },
    { capabilities: { tools: {} } }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: tools.map((t) => ({
      name: t.name,
      description: t.description,
      inputSchema: zodToInputSchema(t.schema),
    })),
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const tool = tools.find((t) => t.name === request.params.name);
    if (!tool) {
      return {
        isError: true,
        content: [{ type: 'text', text: `Unknown tool: ${request.params.name}` }],
      };
    }
    try {
      const parsed = tool.schema.parse(request.params.arguments ?? {});
      const result = (tool.handler as (input: unknown) => unknown)(parsed);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    } catch (err) {
      const isZod = err instanceof z.ZodError;
      const msg = isZod
        ? `Invalid arguments for ${tool.name}: ${err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ')}`
        : err instanceof Error
          ? err.message
          : String(err);
      console.error(`[canvas-mcp] tool "${tool.name}" failed: ${msg}`);
      return { isError: true, content: [{ type: 'text', text: msg }] };
    }
  });

  return server;
};
