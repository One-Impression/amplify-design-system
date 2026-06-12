// Metro config for the SDUI playground inside the amplify-design-system monorepo.
// Lets the app render the LOCAL workspace packages (sdui-runtime / ui-native /
// tokens-creator) with Fast Refresh, and forces a single react / react-native.
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// 1. Watch the whole monorepo so Metro sees the workspace packages' source.
config.watchFolders = [workspaceRoot];

// 2. Resolve from the app first, then the hoisted workspace-root node_modules.
//    NOTE: hierarchical lookup is left ENABLED on purpose — react-native ships
//    nested deps (react-devtools-core, etc.) under its own node_modules, and
//    disabling hierarchical lookup makes Metro unable to resolve them. The
//    single-copy guarantee for react/react-native comes from extraNodeModules
//    below, not from disabling hierarchical lookup.
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

// 3. Honor package "exports" maps (sdui-runtime + tokens-creator subpaths).
config.resolver.unstable_enablePackageExports = true;

// 3b. Renderer dev-loop: resolve the packages we iterate on from SOURCE, not
//     dist. Editing a renderer in packages/{sdui-runtime,ui-native}/src then
//     Fast-Refreshes with no build step (Metro's babel handles the TS/Flow
//     that esbuild/tsup-watch chokes on). Other packages stay on dist.
const SRC_ALIASES = {
  "@one-impression/sdui-runtime": path.resolve(
    workspaceRoot,
    "packages/sdui-runtime/src/index.ts",
  ),
  "@one-impression/ui-native": path.resolve(
    workspaceRoot,
    "packages/ui-native/src/index.ts",
  ),
};
// Dirs whose TS source uses ESM ".js" specifiers that map to ".ts/.tsx"
// siblings (NodeNext style). Scoped so the rewrite below can't touch real
// ".js" files in node_modules dist.
const SRC_DIRS = [
  path.resolve(workspaceRoot, "packages/sdui-runtime/src"),
  path.resolve(workspaceRoot, "packages/ui-native/src"),
];
const defaultResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (SRC_ALIASES[moduleName]) {
    return { type: "sourceFile", filePath: SRC_ALIASES[moduleName] };
  }
  // Inside the aliased src packages, strip the ".js" so Metro's sourceExts
  // (ts/tsx/js) resolves the real source file the specifier points at.
  let name = moduleName;
  const origin = context.originModulePath || "";
  if (
    name.startsWith(".") &&
    name.endsWith(".js") &&
    SRC_DIRS.some((d) => origin.startsWith(d))
  ) {
    name = name.slice(0, -3);
  }
  return defaultResolveRequest
    ? defaultResolveRequest(context, name, platform)
    : context.resolveRequest(context, name, platform);
};

// 4. CRITICAL — a SINGLE copy of react / react-native (the hoisted one).
//    Without this, a workspace package can pull a 2nd copy → "Invalid hook
//    call" / "Element type is invalid" red-screen.
config.resolver.extraNodeModules = {
  react: path.resolve(workspaceRoot, "node_modules/react"),
  "react-native": path.resolve(workspaceRoot, "node_modules/react-native"),
};

module.exports = config;
