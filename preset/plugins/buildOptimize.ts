import Legacy from "@vitejs/plugin-legacy";
import Compression from "vite-plugin-compression";
import DTS from "vite-plugin-dts";
import { visualizer as Visualizer } from "rollup-plugin-visualizer";

export default [
  Legacy(),

  Compression(),

  DTS(),

  Visualizer({
    filename: "./node_modules/.cache/visualizer/stats.html",
    open: true,
    gzipSize: true,
    brotliSize: true,
  }),
];
