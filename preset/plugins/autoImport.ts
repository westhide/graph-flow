import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";

export default [
  AutoImport({
    dirs: ["src/composables", "src/stores", "src/utils"],
    imports: [
      "vue",
      "vue/macros",
      "vue-router",
      "pinia",
      "@vueuse/core",
      "vue-i18n",
      "vitest",
      // TODO: auto import nest tsx components
    ],
    dts: "src/auto-imports.d.ts",
  }),

  Components({
    dirs: ["src/components"],
    extensions: ["vue", "tsx"],
    deep: true,
    resolvers: [IconsResolver()],
    dts: "src/components.d.ts",
    directoryAsNamespace: true,
    globalNamespaces: [],
    directives: true,
    allowOverrides: false,
    include: [/\.vue$/, /\.vue\?vue/, /\.tsx$/],
    exclude: [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/, /[\\/]\.nuxt[\\/]/],
  }),

  Icons({
    autoInstall: true,
  }),
];
