import Vue from "@vitejs/plugin-vue";
import VueJsx from "@vitejs/plugin-vue-jsx";

export default [
  Vue({
    reactivityTransform: true,
  }),
  VueJsx(),
];
