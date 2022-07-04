import { createWebHashHistory, createRouter } from "vue-router";

const routes = [
  {
    path: "/",
    alias: "/",
    name: "home",
    component: () => import("./components/Home"),
  },
  {
    path: "/tutorials/:id",
    name: "tutorial-details",
    component: () => import("./components/Tutorial"),
  },
  {
    path: "/add",
    name: "add",
    component: () => import("./components/Add"),
  },
  {
    path: "/addStation",
    name: "addStation",
    component: () => import("./components/AddStation"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
