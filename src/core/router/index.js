import { createRouter, createWebHistory } from "vue-router";
import StartView from "@views/StartView";
import CharacterCreate from "@views/CharacterCreate";

const routes = [
  {
    path: "/",
    name: "start",
    component: StartView,
  },
  {
    path: "/create",
    name: "create",
    component: CharacterCreate,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
