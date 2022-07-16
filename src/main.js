import { createApp } from "vue";
import App from "./App.vue";
import router from "@router";
import store from "@store";

// common style
import "@style/style.scss";

// directive
import VueClickAway from "vue3-click-away";

// axios
import axios from "axios";
import VueAxios from "vue-axios";

createApp(App)
  .use(store)
  .use(router)
  .use(VueAxios, axios)
  .use(VueClickAway)
  .mount("#app");
