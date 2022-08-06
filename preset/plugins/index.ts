import VuePlugins from "./vue";
import AutoRoute from "./autoRoute";
import AutoImport from "./autoImport";
import Wasm from "./wasm";
import BuildOptimize from "./buildOptimize";
import DevPlugins from "./dev";

export default [
  ...VuePlugins,
  ...AutoRoute,
  ...AutoImport,
  ...Wasm,
  ...BuildOptimize,
  ...DevPlugins,
];
