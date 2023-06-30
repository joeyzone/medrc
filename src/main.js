import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import App from "./App.vue";
import { createRouter } from "./router.js";
import { store } from "./store/index.ts";

const app = createApp(App);

app.use(store).use(createRouter()).use(ElementPlus);
app.mount("#app");
