import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { Notify, Quasar } from "quasar";
import "@quasar/extras/material-icons/material-icons.css";
import "quasar/src/css/index.sass";
import router from "./router/index";

const myApp = createApp(App);

myApp.use(Quasar, {
  plugins: {
    Notify,
  },
});

myApp.use(router).mount("#app");
