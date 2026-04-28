#!/usr/bin/env node
/**
 * Generate JSON component contracts from @one-impression/ui source.
 *
 * Uses the real TypeScript compiler API (vs. the regex extractors in
 * scripts/generate-llms-docs.mjs and packages/mcp-server) so resolved
 * types, JSDoc descriptions, defaults, and inherited props are all
 * captured accurately. Output is the single source of truth that the
 * llms-docs generator and the MCP server now consume — kills the three
 * parallel extraction implementations.
 *
 * Outputs (under packages/ui/dist/):
 *   - contracts/<Component>.json   — full per-component contract
 *   - contracts.json               — manifest (component name → contract path + summary)
 *
 * Run via `npm run prebuild -w packages/ui` (or just `npm run build -w packages/ui`).
 */
import ts from 'typescript';
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync, mkdirSync } from 'node:fs';
import { join, resolve, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const uiRoot = resolve(here, '..');
const repoRoot = resolve(uiRoot, '../..');
const componentsDir = resolve(uiRoot, 'src/components');
const distDir = resolve(uiRoot, 'dist');
const contractsDir = resolve(distDir, 'contracts');

const log = (msg) => process.stdout.write(`[contracts] ${msg}\n`);
const warn = (msg) => process.stderr.write(`[contracts] ${msg}\n`);
const summary = (event, fields) =>
  process.stdout.write(JSON.stringify({ level: 'info', event, ...fields }) + '\n');

const findEntryFile = (dir, name) => {
  for (const candidate of [`${name}.tsx`, 'index.tsx', `${name}.ts`, 'index.ts']) {
    const full = join(dir, candidate);
    if (existsSync(full)) return full;
  }
  return null;
};

const extractJsDoc = (symbol) => {
  if (!symbol) return undefined;
  const docs = symbol.getDocumentationComment(undefined);
  const text = ts.displayPartsToString(docs).trim();
  return text || undefined;
};

/**
 * Get literal values from a union type, filtering out `undefined` (which
 * appears on every optional prop). Returns null if any non-literal,
 * non-undefined member exists.
 */
const literalUnionValues = (type) => {
  if (!type.isUnion()) return null;
  const values = [];
  for (const t of type.types) {
    if (t.flags & ts.TypeFlags.Undefined) continue;
    if (t.isStringLiteral()) values.push(t.value);
    else if (t.isNumberLiteral()) values.push(t.value);
    else return null;
  }
  return values.length > 0 ? values : null;
};

const stringifyType = (checker, type, location) => {
  return checker.typeToString(
    type,
    location,
    ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope
  );
};

/**
 * Walk a forwardRef call and pull default values from the destructuring
 * pattern of its render function: `({ variant = 'primary', ... }, ref) => ...`.
 */
const extractDefaultsFromForwardRef = (sourceFile) => {
  const defaults = new Map();
  const visit = (node) => {
    if (
      ts.isCallExpression(node) &&
      ts.isPropertyAccessExpression(node.expression) &&
      node.expression.name.text === 'forwardRef' &&
      node.arguments.length >= 1
    ) {
      const renderFn = node.arguments[0];
      if (
        (ts.isArrowFunction(renderFn) || ts.isFunctionExpression(renderFn)) &&
        renderFn.parameters.length >= 1 &&
        ts.isObjectBindingPattern(renderFn.parameters[0].name)
      ) {
        for (const element of renderFn.parameters[0].name.elements) {
          if (element.initializer && ts.isIdentifier(element.name)) {
            const text = element.initializer.getText(sourceFile);
            defaults.set(element.name.text, text);
          }
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  return defaults;
};

/**
 * Find subcomponent exports (CardHeader, CardTitle, etc.) — anything
 * exported from the same file whose name starts with the component name
 * or matches conventional suffixes.
 */
const findSubcomponents = (sourceFile, componentName) => {
  const out = [];
  const visit = (node) => {
    if (
      (ts.isVariableStatement(node) || ts.isFunctionDeclaration(node)) &&
      node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
    ) {
      if (ts.isFunctionDeclaration(node) && node.name) {
        const name = node.name.text;
        if (name !== componentName && /(Header|Title|Description|Content|Footer|Body|Item|Trigger|Group)$/.test(name)) {
          out.push(name);
        }
      }
      if (ts.isVariableStatement(node)) {
        for (const decl of node.declarationList.declarations) {
          if (ts.isIdentifier(decl.name)) {
            const name = decl.name.text;
            if (name !== componentName && /(Header|Title|Description|Content|Footer|Body|Item|Trigger|Group)$/.test(name)) {
              out.push(name);
            }
          }
        }
      }
    }
  };
  ts.forEachChild(sourceFile, visit);
  return out;
};

/**
 * Detect whether the component is built with React.forwardRef.
 */
const detectKind = (sourceFile, componentName) => {
  let kind = 'function';
  const visit = (node) => {
    if (
      ts.isVariableStatement(node) &&
      node.declarationList.declarations.some(
        (d) => ts.isIdentifier(d.name) && d.name.text === componentName && d.initializer
      )
    ) {
      const init = node.declarationList.declarations.find(
        (d) => ts.isIdentifier(d.name) && d.name.text === componentName
      ).initializer;
      if (
        init &&
        ts.isCallExpression(init) &&
        ts.isPropertyAccessExpression(init.expression) &&
        init.expression.name.text === 'forwardRef'
      ) {
        kind = 'forwardRef';
      }
    }
  };
  ts.forEachChild(sourceFile, visit);
  return kind;
};

const buildProgram = (entries) => {
  const tsconfigPath = resolve(uiRoot, 'tsconfig.json');
  const config = ts.readConfigFile(tsconfigPath, ts.sys.readFile);
  const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, uiRoot);
  return ts.createProgram({
    rootNames: entries,
    options: {
      ...parsed.options,
      noEmit: true,
      skipLibCheck: true,
    },
  });
};

const extractContract = (program, checker, filePath, componentName) => {
  const sourceFile = program.getSourceFile(filePath);
  if (!sourceFile) return null;

  const propsInterfaceName = `${componentName}Props`;
  let propsSymbol = null;
  const aliases = new Map();

  for (const stmt of sourceFile.statements) {
    if (
      ts.isInterfaceDeclaration(stmt) &&
      stmt.name.text === propsInterfaceName &&
      stmt.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
    ) {
      propsSymbol = checker.getSymbolAtLocation(stmt.name);
    }
    if (
      ts.isTypeAliasDeclaration(stmt) &&
      stmt.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
    ) {
      const aliasName = stmt.name.text;
      const aliasType = checker.getTypeAtLocation(stmt.type);
      const values = literalUnionValues(aliasType);
      if (values) aliases.set(aliasName, values);
    }
  }

  const defaults = extractDefaultsFromForwardRef(sourceFile);
  const subcomponents = findSubcomponents(sourceFile, componentName);
  const kind = detectKind(sourceFile, componentName);

  // Locate the Props interface declaration's source range so we can
  // distinguish own props (declared in the interface body) from inherited
  // ones (from `extends ButtonHTMLAttributes<...>`). Inherited HTML
  // attributes flood the output and aren't useful for LLM agents — we
  // capture them as a count + parent type list rather than expanding.
  const propsInterfaceDecl = sourceFile.statements.find(
    (s) =>
      ts.isInterfaceDeclaration(s) &&
      s.name.text === propsInterfaceName &&
      s.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
  );

  const inheritsFrom = [];
  if (propsInterfaceDecl?.heritageClauses) {
    for (const clause of propsInterfaceDecl.heritageClauses) {
      for (const t of clause.types) {
        inheritsFrom.push(t.getText(sourceFile));
      }
    }
  }

  const ownProps = [];
  const inheritedPropNames = [];
  if (propsSymbol) {
    const declaredType = checker.getDeclaredTypeOfSymbol(propsSymbol);
    for (const prop of declaredType.getProperties()) {
      const decl = prop.declarations?.[0];
      if (!decl) continue;
      const isOwn =
        propsInterfaceDecl &&
        decl.getSourceFile() === sourceFile &&
        decl.getStart() >= propsInterfaceDecl.getStart() &&
        decl.getEnd() <= propsInterfaceDecl.getEnd();
      if (!isOwn) {
        inheritedPropNames.push(prop.name);
        continue;
      }
      const propType = checker.getTypeOfSymbolAtLocation(prop, decl);
      const typeString = stringifyType(checker, propType, decl);
      const literalValues = literalUnionValues(propType);
      const optional = !!(prop.flags & ts.SymbolFlags.Optional);
      const description = extractJsDoc(prop);
      const defaultRaw = defaults.get(prop.name);
      const defaultValue = defaultRaw ? defaultRaw.replace(/^['"]|['"]$/g, '') : undefined;
      ownProps.push({
        name: prop.name,
        type: typeString,
        optional,
        default: defaultValue,
        enumValues: literalValues,
        description,
      });
    }
  }

  return {
    name: componentName,
    filePath: relative(repoRoot, filePath),
    kind,
    variants: aliases.get(`${componentName}Variant`) ?? null,
    sizes: aliases.get(`${componentName}Size`) ?? null,
    props: ownProps,
    inherits: {
      from: inheritsFrom,
      propCount: inheritedPropNames.length,
    },
    subcomponents,
    declaresPropsInterface: !!propsSymbol,
  };
};

const loadComponentStatus = () => {
  const path = resolve(uiRoot, 'component-status.json');
  if (!existsSync(path)) {
    warn(`component-status.json not found at ${path} — all components will get status='unknown'`);
    return {};
  }
  try {
    const raw = JSON.parse(readFileSync(path, 'utf8'));
    return raw.components || {};
  } catch (err) {
    warn(`failed to parse component-status.json: ${err.message} — falling back to empty map`);
    return {};
  }
};

const main = () => {
  if (!existsSync(componentsDir)) {
    warn(`components dir not found, skipping contract generation: ${componentsDir}`);
    return;
  }
  if (!existsSync(distDir)) mkdirSync(distDir, { recursive: true });
  if (!existsSync(contractsDir)) mkdirSync(contractsDir, { recursive: true });

  const statusMap = loadComponentStatus();

  const dirs = readdirSync(componentsDir).filter((d) => statSync(join(componentsDir, d)).isDirectory());
  const entries = [];
  const componentMap = new Map();
  for (const dir of dirs) {
    const file = findEntryFile(join(componentsDir, dir), dir);
    if (!file) continue;
    entries.push(file);
    componentMap.set(file, dir);
  }

  const program = buildProgram(entries);
  const checker = program.getTypeChecker();

  const contracts = [];
  const failures = [];
  const suspicious = [];

  for (const [filePath, name] of componentMap) {
    let contract;
    try {
      contract = extractContract(program, checker, filePath, name);
    } catch (err) {
      failures.push({ name, reason: err instanceof Error ? err.message : String(err) });
      continue;
    }
    if (!contract) {
      failures.push({ name, reason: 'no source file in program' });
      continue;
    }
    if (contract.declaresPropsInterface && contract.props.length === 0) {
      suspicious.push(name);
    }
    const lifecycle = statusMap[name] || { status: 'unknown', since: 'unknown' };
    contract.lifecycle = lifecycle;
    writeFileSync(join(contractsDir, `${name}.json`), JSON.stringify(contract, null, 2));
    contracts.push(contract);
  }

  contracts.sort((a, b) => a.name.localeCompare(b.name));

  const missingStatus = contracts.filter((c) => c.lifecycle.status === 'unknown').map((c) => c.name);
  if (missingStatus.length > 0) {
    warn(`${missingStatus.length} components missing status in component-status.json: ${missingStatus.join(', ')}`);
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    tsVersion: ts.version,
    componentCount: contracts.length,
    statusBreakdown: contracts.reduce((acc, c) => {
      acc[c.lifecycle.status] = (acc[c.lifecycle.status] || 0) + 1;
      return acc;
    }, {}),
    components: contracts.map((c) => ({
      name: c.name,
      contract: `contracts/${c.name}.json`,
      filePath: c.filePath,
      kind: c.kind,
      variants: c.variants,
      sizes: c.sizes,
      propCount: c.props.length,
      subcomponents: c.subcomponents,
      lifecycle: c.lifecycle,
    })),
  };
  writeFileSync(join(distDir, 'contracts.json'), JSON.stringify(manifest, null, 2));

  log(`wrote ${contracts.length} contracts → ${contractsDir}`);
  log(`wrote manifest → ${distDir}/contracts.json`);
  if (failures.length) {
    warn(`${failures.length} components failed:`);
    for (const f of failures) warn(`  - ${f.name}: ${f.reason}`);
  }
  if (suspicious.length) {
    warn(`${suspicious.length} components declare a Props interface but yielded zero props: ${suspicious.join(', ')}`);
  }
  summary('contracts_generated', {
    componentCount: contracts.length,
    failureCount: failures.length,
    suspiciousCount: suspicious.length,
    tsVersion: ts.version,
  });
};

try {
  main();
} catch (err) {
  warn(`unexpected failure: ${err instanceof Error ? err.stack ?? err.message : String(err)}`);
}
