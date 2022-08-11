import { PluginOption } from "vite";
import Inspect from "vite-plugin-inspect";
import { visualizer as Visualizer } from "rollup-plugin-visualizer";

export default <PluginOption[]>[
  Inspect(),

  Visualizer({
    filename: "./node_modules/.cache/visualizer/stats.html",
    open: true,
    gzipSize: true,
    brotliSize: true,
  }),
];
