import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import Vue from "@vitejs/plugin-vue";
import VueJsx from "@vitejs/plugin-vue-jsx";

import Layouts from "vite-plugin-vue-layouts";
import Pages from "vite-plugin-pages";

import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";

import Wasm from "vite-plugin-wasm-pack";

import Legacy from "@vitejs/plugin-legacy";
import Compression from "vite-plugin-compression";

import Inspect from "vite-plugin-inspect";
import { visualizer as Visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    Vue({
      reactivityTransform: true,
    }),
    VueJsx(),

    Layouts({
      layoutsDirs: "src/views/layouts",
      exclude: ["./*/**.*"],
      defaultLayout: "Default",
    }),
    Pages({
      dirs: [
        "src/views/pages",
        { dir: "src/views/docs", baseRoute: "docs" },
        { dir: "src/views/examples", baseRoute: "examples" },
      ],
      extensions: ["vue", "tsx", "md"],
      exclude: ["**/components/*.{vue,tsx,md}"],
    }),

    AutoImport({
      dirs: ["src/composables", "src/utils"],
      imports: [
        "vue",
        "vue/macros",
        "vue-router",
        "pinia",
        "@vueuse/core",
        "vue-i18n",
        "vitest",
      ],
      dts: "src/auto-imports.d.ts",
    }),
    Components({
      dirs: ["src/components"],
      extensions: ["vue", "tsx"],
      deep: true,
      resolvers: [IconsResolver()],
      dts: "src/components.d.ts",
      directoryAsNamespace: false,
      globalNamespaces: [],
      directives: true,
      allowOverrides: false,
      include: [/\.vue$/, /\.vue\?vue/, /\.tsx$/],
      exclude: [
        /[\\/]node_modules[\\/]/,
        /[\\/]\.git[\\/]/,
        /[\\/]\.nuxt[\\/]/,
      ],
    }),
    Icons({
      autoInstall: true,
    }),

    Wasm("wasm-rs"),

    Legacy(),
    Compression(),

    Inspect(),
    Visualizer({
      filename: "./node_modules/.cache/visualizer/stats.html",
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
