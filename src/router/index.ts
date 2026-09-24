import { createRouter, createWebHistory } from "vue-router";

const history = createWebHistory(import.meta.env.BASE_URL);
let navigationDirection = "forward";

history.listen((_, __, { direction }) => {
  navigationDirection = direction === "back" ? "back" : "forward";
});

const router = createRouter({
  history,
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
          component: () => import("../views/home/page.vue"),
        },
        {
          path: "user",
          name: "user",
          component: () => import("../views/user/page.vue"),
        },
      ],
    },
    {
      path: "/debug",
      name: "debug",
      component: () => import("../views/debug/page.vue"),
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/tabbar/home",
    },
  ],
});

router.beforeEach((to) => {
  to.meta.pageTransition = `app-page-${navigationDirection}`;
  navigationDirection = "forward";
});

export default router;
