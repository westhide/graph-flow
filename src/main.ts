import { createApp } from "vue";

import App from "./App.vue";

import "./styles/index.less";

import router from "./router";
import store from "./stores";
import i18n from "./locales";

const app = createApp(App);

app.use(router);
app.use(store);
app.use(i18n);

app.mount("#app");
