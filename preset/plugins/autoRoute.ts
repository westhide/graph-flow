import Layouts from "vite-plugin-vue-layouts";
import Pages from "vite-plugin-pages";

export default [
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
];
