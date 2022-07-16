import { createRouter, createWebHistory } from "vue-router";
import StartView from "@views/StartView";
import GameCreate from "@views/GameCreate";

const routes = [
  {
    path: "/",
    name: "start",
    component: StartView,
  },
  {
    path: "/create",
    name: "create",
    component: GameCreate,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
