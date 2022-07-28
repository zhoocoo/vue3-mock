import { createRouter, createWebHistory } from "vue-router";
import watchBase from "@/views/watch/base.vue";

const router = () => {
  const router = createRouter({
    history: createWebHistory(),
    routes: [
      { path: "/", redirect: "/watch" },
      { path: "/watch", component: () => Promise.resolve(watchBase) },
    ],
  });
  return router;
};

export default router;
