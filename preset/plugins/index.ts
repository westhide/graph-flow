import VuePlugins from "./vue";
import AutoRoute from "./autoRoute";
import AutoImport from "./autoImport";
// import Wasm from "./wasm";
import SSL from "./ssl";
import BuildOptimize from "./buildOptimize";
import DevPlugins from "./dev";

export default [
  VuePlugins,
  AutoRoute,
  AutoImport,
  // Wasm,
  SSL,
  BuildOptimize,
  DevPlugins,
];
