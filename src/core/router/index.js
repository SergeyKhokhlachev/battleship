import { createRouter, createWebHistory } from "vue-router";
import GameStart from "@views/GameStart";
import GameCreate from "@views/GameCreate";
import GamePlay from "@views/GamePlay";

const routes = [
  {
    path: "/",
    name: "start",
    component: GameStart,
  },
  {
    path: "/create",
    name: "create",
    component: GameCreate,
  },
  {
    path: "/play",
    name: "play",
    component: GamePlay,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
