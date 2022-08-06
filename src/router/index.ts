import { createRouter, createWebHistory } from "vue-router";
import { setupLayouts } from "virtual:generated-layouts";
import generatedRoutes from "virtual:generated-pages";

const routes = setupLayouts(generatedRoutes);

const router = createRouter({
  routes,
  history: createWebHistory(),
});

router.beforeEach(() => {
  useNProgress().start();
});

router.afterEach(() => {
  useNProgress().done();
});

export default router;
