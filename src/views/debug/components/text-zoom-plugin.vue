<script setup lang="ts">
import { TextZoom } from "@capacitor/text-zoom";
import { Button, Cell, CellGroup, CollapseItem, Space } from "vant";
import { ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const result = ref("");

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

async function loadZoomLevels() {
  try {
    const [current, preferred] = await Promise.all([
      TextZoom.get(),
      TextZoom.getPreferred(),
    ]);
    result.value = JSON.stringify({ current, preferred }, null, 2);
  } catch (error) {
    result.value = getErrorMessage(error);
  }
}

async function setZoom(value: number) {
  try {
    await TextZoom.set({ value });
    await loadZoomLevels();
  } catch (error) {
    result.value = getErrorMessage(error);
  }
}

async function usePreferredZoom() {
  try {
    const { value } = await TextZoom.getPreferred();
    await TextZoom.set({ value });
    await loadZoomLevels();
  } catch (error) {
    result.value = getErrorMessage(error);
  }
}
</script>

<template>
  <CollapseItem :title="t('debug.textZoom.title')" name="text-zoom">
    <p
      class="mb-[var(--van-padding-md)] text-[length:var(--van-font-size-md)] text-[var(--van-text-color-2)]"
    >
      {{ t("debug.textZoom.description") }}
    </p>
    <Space direction="vertical" fill>
      <Button block type="primary" @click="loadZoomLevels">
        {{ t("debug.textZoom.read") }}
      </Button>
      <Space wrap>
        <Button size="small" @click="setZoom(0.8)">80%</Button>
        <Button size="small" @click="setZoom(1)">100%</Button>
        <Button size="small" @click="setZoom(1.2)">120%</Button>
        <Button size="small" @click="setZoom(1.5)">150%</Button>
      </Space>
      <Button block plain type="primary" @click="usePreferredZoom">
        {{ t("debug.textZoom.usePreferred") }}
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
    </Space>
  </CollapseItem>
</template>
