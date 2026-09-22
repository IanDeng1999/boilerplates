<script setup lang="ts">
import { AppLauncher } from "@capacitor/app-launcher";
import { Button, Cell, CellGroup, CollapseItem, Field, Space } from "vant";
import { ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const url = ref("https://capacitorjs.com");
const result = ref("");

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

async function canOpenUrl() {
  try {
    result.value = JSON.stringify(
      await AppLauncher.canOpenUrl({ url: url.value }),
      null,
      2,
    );
  } catch (error) {
    result.value = getErrorMessage(error);
  }
}

async function openUrl() {
  try {
    result.value = JSON.stringify(
      await AppLauncher.openUrl({ url: url.value }),
      null,
      2,
    );
  } catch (error) {
    result.value = getErrorMessage(error);
  }
}
</script>

<template>
  <CollapseItem :title="t('debug.appLauncher.title')" name="app-launcher">
    <p
      class="mb-[var(--van-padding-md)] text-[length:var(--van-font-size-md)] text-[var(--van-text-color-2)]"
    >
      {{ t("debug.appLauncher.description") }}
    </p>
    <Space direction="vertical" fill>
      <Field
        v-model="url"
        clearable
        :label="t('debug.appLauncher.urlLabel')"
        :placeholder="t('debug.appLauncher.urlPlaceholder')"
      />
      <Space wrap>
        <Button size="small" plain type="primary" @click="canOpenUrl">
          {{ t("debug.appLauncher.check") }}
        </Button>
        <Button size="small" type="primary" @click="openUrl">
          {{ t("debug.appLauncher.open") }}
        </Button>
      </Space>
      <CellGroup v-if="result" inset>
        <Cell :title="t('debug.result')" :label="result" />
      </CellGroup>
    </Space>
  </CollapseItem>
</template>
