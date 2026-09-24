import { App as CapacitorApp } from "@capacitor/app";
import { defineCustomElements } from "@ionic/pwa-elements/loader";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { createApp } from "vue";
import App from "./app.vue";
import { i18n } from "./i18n";
import router from "./router";
import { useAppStore } from "./stores/app";
import { useLogStore } from "./stores/log";
import "vant/lib/index.css";
import "./styles/variables.css";
import "./styles/tailwind.css";

void defineCustomElements(window);

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(pinia);
app.use(i18n);
app.use(router);
const logStore = useLogStore(pinia);
void CapacitorApp.addListener("backButton", ({ canGoBack }) => {
  if (canGoBack) {
    router.back();
    return;
  }

  void CapacitorApp.exitApp();
});
logStore.info("APP Startup");
useAppStore(pinia).initialize();
app.mount("#app");
