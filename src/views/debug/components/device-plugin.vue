<script setup lang="ts">
import { Device } from "@capacitor/device";
import { Button, Cell, CellGroup, CollapseItem } from "vant";
import { ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const result = ref("");

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

async function loadDeviceInfo() {
  try {
    const [id, info, battery, languageCode, languageTag] = await Promise.all([
      Device.getId(),
      Device.getInfo(),
      Device.getBatteryInfo(),
      Device.getLanguageCode(),
      Device.getLanguageTag(),
    ]);

    result.value = JSON.stringify(
      { id, info, battery, languageCode, languageTag },
      null,
      2,
    );
  } catch (error) {
    result.value = getErrorMessage(error);
  }
}
</script>

<template>
  <CollapseItem :title="t('debug.device.title')" name="device">
    <p
      class="mb-[var(--van-padding-md)] text-[length:var(--van-font-size-md)] text-[var(--van-text-color-2)]"
    >
      {{ t("debug.device.description") }}
    </p>
    <Button block type="primary" @click="loadDeviceInfo">
      {{ t("debug.device.action") }}
    </Button>
    <CellGroup v-if="result" inset class="mt-[var(--van-padding-sm)]">
      <Cell :title="t('debug.result')">
        <template #label>
          <pre
            class="overflow-x-auto whitespace-pre-wrap break-words font-mono"
          >{{ result }}</pre>
        </template>
      </Cell>
    </CellGroup>
  </CollapseItem>
</template>
