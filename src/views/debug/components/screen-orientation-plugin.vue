<script setup lang="ts">
import type { PluginListenerHandle } from "@capacitor/core";
import { ScreenOrientation } from "@capacitor/screen-orientation";
import { Button, Cell, CellGroup, CollapseItem, Space } from "vant";
import { onMounted, onUnmounted, ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const result = ref("");
const currentOrientation = ref("");
let listenerHandle: PluginListenerHandle | undefined;

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

async function loadOrientation() {
  try {
    const orientation = await ScreenOrientation.orientation();
    currentOrientation.value = orientation.type;
    result.value = JSON.stringify(orientation, null, 2);
  } catch (error) {
    result.value = getErrorMessage(error);
  }
}

async function lockOrientation(orientation: "portrait" | "landscape") {
  try {
    await ScreenOrientation.lock({ orientation });
    result.value = t("debug.completed");
  } catch (error) {
    result.value = getErrorMessage(error);
  }
}

async function unlockOrientation() {
  try {
    await ScreenOrientation.unlock();
    result.value = t("debug.completed");
  } catch (error) {
    result.value = getErrorMessage(error);
  }
}

onMounted(async () => {
  try {
    listenerHandle = await ScreenOrientation.addListener(
      "screenOrientationChange",
      ({ type }) => {
        currentOrientation.value = type;
      },
    );
    await loadOrientation();
  } catch (error) {
    result.value = getErrorMessage(error);
  }
});

onUnmounted(() => {
  void listenerHandle?.remove();
});
</script>

<template>
  <CollapseItem
    :title="t('debug.screenOrientation.title')"
    name="screen-orientation"
  >
    <p
      class="mb-[var(--van-padding-md)] text-[length:var(--van-font-size-md)] text-[var(--van-text-color-2)]"
    >
      {{ t("debug.screenOrientation.description") }}
    </p>
    <Space direction="vertical" fill>
      <CellGroup inset>
        <Cell
          :title="t('debug.screenOrientation.current')"
          :value="currentOrientation || '-'"
        />
      </CellGroup>
      <Button block type="primary" @click="loadOrientation">
        {{ t("debug.screenOrientation.refresh") }}
      </Button>
      <Space wrap>
        <Button size="small" @click="lockOrientation('portrait')">
          {{ t("debug.screenOrientation.lockPortrait") }}
        </Button>
        <Button size="small" @click="lockOrientation('landscape')">
          {{ t("debug.screenOrientation.lockLandscape") }}
        </Button>
        <Button size="small" @click="unlockOrientation">
          {{ t("debug.screenOrientation.unlock") }}
        </Button>
      </Space>
      <CellGroup v-if="result" inset>
        <Cell :title="t('debug.result')" :label="result" />
      </CellGroup>
    </Space>
  </CollapseItem>
</template>
