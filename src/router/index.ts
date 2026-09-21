import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/tabbar/home",
    },
    {
      path: "/tabbar",
      component: () => import("../layouts/tabbar-layout.vue"),
      children: [
        {
          path: "",
          redirect: "/tabbar/home",
        },
        {
          path: "home",
          name: "home",
          component: () => import("../views/home-view.vue"),
        },
        {
          path: "user",
          name: "user",
          component: () => import("../views/user-view.vue"),
        },
      ],
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/tabbar/home",
    },
  ],
});

export default router;
