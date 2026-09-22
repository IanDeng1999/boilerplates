<script setup lang="ts">
import { StatusBar, Style } from "@capacitor/status-bar";
import { Button, Cell, CellGroup, CollapseItem, Space } from "vant";
import { ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const result = ref("");

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

async function runStatusBarAction(action: () => Promise<void>) {
  try {
    await action();
    result.value = t("debug.completed");
  } catch (error) {
    result.value = getErrorMessage(error);
  }
}

async function loadStatusBarInfo() {
  try {
    result.value = JSON.stringify(await StatusBar.getInfo(), null, 2);
  } catch (error) {
    result.value = getErrorMessage(error);
  }
}
</script>

<template>
  <CollapseItem :title="t('debug.statusBar.title')" name="status-bar">
    <p
      class="mb-[var(--van-padding-md)] text-[length:var(--van-font-size-md)] text-[var(--van-text-color-2)]"
    >
      {{ t("debug.statusBar.description") }}
    </p>
    <Space direction="vertical" fill>
      <Button block plain type="primary" @click="loadStatusBarInfo">
        {{ t("debug.statusBar.info") }}
      </Button>
      <Space wrap>
        <Button
          size="small"
          @click="runStatusBarAction(() => StatusBar.setStyle({ style: Style.Dark }))"
        >
          {{ t("debug.statusBar.dark") }}
        </Button>
        <Button
          size="small"
          @click="runStatusBarAction(() => StatusBar.setStyle({ style: Style.Light }))"
        >
          {{ t("debug.statusBar.light") }}
        </Button>
        <Button
          size="small"
          @click="runStatusBarAction(() => StatusBar.hide())"
        >
          {{ t("debug.statusBar.hide") }}
        </Button>
        <Button
          size="small"
          @click="runStatusBarAction(() => StatusBar.show())"
        >
          {{ t("debug.statusBar.show") }}
        </Button>
      </Space>
      <CellGroup v-if="result" inset>
        <Cell :title="t('debug.result')" :label="result" />
      </CellGroup>
    </Space>
  </CollapseItem>
</template>
