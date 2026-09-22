<script setup lang="ts">
import { App } from "@capacitor/app";
import type { PluginListenerHandle } from "@capacitor/core";
import { Button, Cell, CellGroup, CollapseItem, Space } from "vant";
import { onMounted, onUnmounted, ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const result = ref("");
const events = ref<string[]>([]);
const listenerHandles: PluginListenerHandle[] = [];

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function recordEvent(name: string, data?: object) {
  events.value = [
    JSON.stringify(data ? { name, data } : { name }),
    ...events.value,
  ].slice(0, 6);
}

async function loadAppInfo() {
  try {
    const [info, state, launchUrl, language] = await Promise.all([
      App.getInfo(),
      App.getState(),
      App.getLaunchUrl(),
      App.getAppLanguage(),
    ]);

    result.value = JSON.stringify(
      { info, state, launchUrl: launchUrl ?? null, language },
      null,
      2,
    );
  } catch (error) {
    result.value = getErrorMessage(error);
  }
}

async function minimizeApp() {
  try {
    await App.minimizeApp();
    result.value = t("debug.completed");
  } catch (error) {
    result.value = getErrorMessage(error);
  }
}

onMounted(async () => {
  try {
    listenerHandles.push(
      await App.addListener("appStateChange", (state) => {
        recordEvent("appStateChange", state);
      }),
      await App.addListener("pause", () => {
        recordEvent("pause");
      }),
      await App.addListener("resume", () => {
        recordEvent("resume");
      }),
      await App.addListener("appUrlOpen", ({ url }) => {
        recordEvent("appUrlOpen", { url });
      }),
      await App.addListener("appRestoredResult", (restoredResult) => {
        recordEvent("appRestoredResult", restoredResult);
      }),
    );
  } catch (error) {
    result.value = getErrorMessage(error);
  }
});

onUnmounted(() => {
  for (const handle of listenerHandles) {
    void handle.remove();
  }
});
</script>

<template>
  <CollapseItem :title="t('debug.app.title')" name="app">
    <p
      class="mb-[var(--van-padding-md)] text-[length:var(--van-font-size-md)] text-[var(--van-text-color-2)]"
    >
      {{ t("debug.app.description") }}
    </p>
    <Space direction="vertical" fill>
      <Button block type="primary" @click="loadAppInfo">
        {{ t("debug.app.info") }}
      </Button>
      <Button block plain type="primary" @click="minimizeApp">
        {{ t("debug.app.minimize") }}
      </Button>
      <CellGroup v-if="result" inset>
        <Cell :title="t('debug.result')">
          <template #label>
            <pre
              class="overflow-x-auto whitespace-pre-wrap break-words font-mono"
            >{{ result }}</pre>
          </template>
        </Cell>
      </CellGroup>
      <CellGroup v-if="events.length" inset>
        <Cell :title="t('debug.app.events')">
          <template #label>
            <pre
              class="overflow-x-auto whitespace-pre-wrap break-words font-mono"
            >{{ events.join("\n") }}</pre>
          </template>
        </Cell>
      </CellGroup>
    </Space>
  </CollapseItem>
</template>
