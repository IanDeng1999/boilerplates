<script setup lang="ts">
import { Toast } from "@capacitor/toast";
import { Button, Cell, CellGroup, CollapseItem, Space } from "vant";
import { ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const result = ref("");

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

async function showToast(
  duration: "short" | "long",
  position: "top" | "center" | "bottom",
) {
  try {
    await Toast.show({
      text: t("debug.toast.message"),
      duration,
      position,
    });
    result.value = t("debug.completed");
  } catch (error) {
    result.value = getErrorMessage(error);
  }
}
</script>

<template>
  <CollapseItem :title="t('debug.toast.title')" name="toast">
    <p
      class="mb-[var(--van-padding-md)] text-[length:var(--van-font-size-md)] text-[var(--van-text-color-2)]"
    >
      {{ t("debug.toast.description") }}
    </p>
    <Space direction="vertical" fill>
      <Button block type="primary" @click="showToast('short', 'bottom')">
        {{ t("debug.toast.shortBottom") }}
      </Button>
      <Button block plain type="primary" @click="showToast('long', 'center')">
        {{ t("debug.toast.longCenter") }}
      </Button>
      <CellGroup v-if="result" inset>
        <Cell :title="t('debug.result')" :label="result" />
      </CellGroup>
    </Space>
  </CollapseItem>
</template>
