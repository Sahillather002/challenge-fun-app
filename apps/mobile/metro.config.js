const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

// Get the default Expo Metro config
const config = getDefaultConfig(__dirname);

//
// ✅ Add support for @/ aliases
//
config.resolver.alias = {
  "@": path.resolve(__dirname, "src"),
};

//
// ✅ Fix Supabase module resolution by providing fallback paths
//
config.resolver.alias["@supabase/postgrest-js"] = path.resolve(
  __dirname,
  "node_modules/@supabase/postgrest-js/dist/index.js"
);

config.resolver.alias["@supabase/realtime-js"] = path.resolve(
  __dirname,
  "node_modules/@supabase/realtime-js/dist/index.js"
);

config.resolver.alias["@supabase/storage-js"] = path.resolve(
  __dirname,
  "node_modules/@supabase/storage-js/dist/index.js"
);

//
// ✅ Ensure proper module resolution
//
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, "node_modules"),
];

//
// ✅ Add CSS support for web
//
config.resolver.assetExts.push("css");

//
// ✅ Web-specific configuration
//
if (process.env.EXPO_PLATFORM === "web") {
  // Add CSS loader for web
  config.transformer.assetRegistryPath =
    "react-native/Libraries/Image/AssetRegistry";

  // Ensure CSS files are treated as assets
  config.resolver.platforms = ["web", "native", "ios", "android"];
}

//
// ✅ Wrap the final config with NativeWind support
//
module.exports = withNativeWind(config, {
  input: "./global.css",
});
