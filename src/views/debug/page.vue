<script setup lang="ts">
import { Collapse, NavBar } from "vant";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import ActionSheetPlugin from "./components/action-sheet-plugin.vue";
import DevicePlugin from "./components/device-plugin.vue";
import DialogPlugin from "./components/dialog-plugin.vue";
import HapticsPlugin from "./components/haptics-plugin.vue";
import KeyboardPlugin from "./components/keyboard-plugin.vue";
import ScreenOrientationPlugin from "./components/screen-orientation-plugin.vue";
import SharePlugin from "./components/share-plugin.vue";
import SplashScreenPlugin from "./components/splash-screen-plugin.vue";
import StatusBarPlugin from "./components/status-bar-plugin.vue";
import TextZoomPlugin from "./components/text-zoom-plugin.vue";
import ToastPlugin from "./components/toast-plugin.vue";

const { t } = useI18n();
const activePlugins = ref<string[]>([]);
</script>

<template>
  <main>
    <NavBar :title="t('debug.title')" fixed placeholder safe-area-inset-top />
    <div class="px-[var(--van-padding-md)] pb-[var(--van-padding-md)]">
      <Collapse v-model="activePlugins" :border="false">
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
