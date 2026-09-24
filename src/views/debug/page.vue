<script setup lang="ts">
import { Collapse, NavBar } from "vant";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import ActionSheetPlugin from "./components/action-sheet-plugin.vue";
import AppLauncherPlugin from "./components/app-launcher-plugin.vue";
import AppPlugin from "./components/app-plugin.vue";
import DevicePlugin from "./components/device-plugin.vue";
import DialogPlugin from "./components/dialog-plugin.vue";
import HapticsPlugin from "./components/haptics-plugin.vue";
import KeyboardPlugin from "./components/keyboard-plugin.vue";
import LogPlugin from "./components/log-plugin.vue";
import PreferencesPlugin from "./components/preferences-plugin.vue";
import ScreenOrientationPlugin from "./components/screen-orientation-plugin.vue";
import SharePlugin from "./components/share-plugin.vue";
import SplashScreenPlugin from "./components/splash-screen-plugin.vue";
import StatusBarPlugin from "./components/status-bar-plugin.vue";
import TextZoomPlugin from "./components/text-zoom-plugin.vue";
import ToastPlugin from "./components/toast-plugin.vue";

const { t } = useI18n();
const router = useRouter();
const activePlugins = ref<string[]>([]);
</script>

<template>
  <main>
    <NavBar
      :title="t('debug.title')"
      fixed
      placeholder
      safe-area-inset-top
      left-arrow
      @click-left="router.back"
    />
    <div class="px-[var(--van-padding-md)] pb-[var(--van-padding-md)]">
      <Collapse v-model="activePlugins" :border="false">
        <AppPlugin />
        <AppLauncherPlugin />
        <LogPlugin />
        <PreferencesPlugin />
        <SharePlugin />
        <DevicePlugin />
        <StatusBarPlugin />
        <SplashScreenPlugin />
        <ToastPlugin />
        <DialogPlugin />
        <KeyboardPlugin />
        <HapticsPlugin />
        <ScreenOrientationPlugin />
        <TextZoomPlugin />
        <ActionSheetPlugin />
      </Collapse>
    </div>
  </main>
</template>
