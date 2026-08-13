const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");
const mobileReact = path.resolve(projectRoot, "node_modules/react");

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];

// This workspace also contains web apps using React 18. Resolve dependencies
// for the native bundle from this app first so React Native and React
// Navigation share the Expo-compatible React 19 instance.
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

// Force the whole native bundle to a single React instance (the Expo-compatible
// 19.x) so hoisted packages (@react-navigation/core, zustand, react-freeze, ...)
// can't resolve the root's React 18 and end up with a duplicate React copy.
const defaultResolve = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "react" || moduleName.startsWith("react/")) {
    const filePath = require.resolve(moduleName, { paths: [mobileReact] });
    return { type: "sourceFile", filePath };
  }
  return defaultResolve
    ? defaultResolve(context, moduleName, platform)
    : context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
