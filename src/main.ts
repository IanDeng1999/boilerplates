import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { createApp } from "vue";
import { i18n } from "./i18n";
import App from "./main-app.vue";
import router from "./router";
import { useAppStore } from "./stores/app";
import "vant/lib/index.css";
import "./style.css";

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(pinia);
app.use(i18n);
app.use(router);
useAppStore(pinia).initialize();
app.mount("#app");
