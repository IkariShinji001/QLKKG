import { createRouter, createWebHistory } from "vue-router";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: () => import("../views/HomeView.vue"),
    },
    {
      path: "/clients",
      name: "Clients",
      component: () => import("../views/ClientView.vue"),
    },
    {
      path: "/products",
      name: "Products",
      component: () => import("../views/ProductView.vue"),
    },
  ],
});

export default router;
