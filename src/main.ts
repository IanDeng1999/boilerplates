import { App as CapacitorApp } from "@capacitor/app";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { createApp } from "vue";
import App from "./app.vue";
import { i18n } from "./i18n";
import router from "./router";
import { useAppStore } from "./stores/app";
import "vant/lib/index.css";
import "./styles/variables.css";
import "./styles/tailwind.css";

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(pinia);
app.use(i18n);
app.use(router);
void CapacitorApp.addListener("backButton", ({ canGoBack }) => {
  if (canGoBack) {
    router.back();
    return;
  }

  void CapacitorApp.exitApp();
});
useAppStore(pinia).initialize();
app.mount("#app");
