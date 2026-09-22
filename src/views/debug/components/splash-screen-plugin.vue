<script setup lang="ts">
import { SplashScreen } from "@capacitor/splash-screen";
import { Button, Cell, CellGroup, CollapseItem, Space } from "vant";
import { ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const result = ref("");

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

async function runSplashScreenAction(action: () => Promise<void>) {
  try {
    await action();
    result.value = t("debug.completed");
  } catch (error) {
    result.value = getErrorMessage(error);
  }
}
</script>

<template>
  <CollapseItem :title="t('debug.splashScreen.title')" name="splash-screen">
    <p
      class="mb-[var(--van-padding-md)] text-[length:var(--van-font-size-md)] text-[var(--van-text-color-2)]"
    >
      {{ t("debug.splashScreen.description") }}
    </p>
    <Space direction="vertical" fill>
      <Button
        block
        type="primary"
        @click="
          runSplashScreenAction(() =>
            SplashScreen.show({ showDuration: 2000, autoHide: true }),
          )
        "
      >
        {{ t("debug.splashScreen.show") }}
      </Button>
      <Button
        block
        plain
        type="primary"
        @click="runSplashScreenAction(() => SplashScreen.hide())"
      >
        {{ t("debug.splashScreen.hide") }}
      </Button>
      <CellGroup v-if="result" inset>
        <Cell :title="t('debug.result')" :label="result" />
      </CellGroup>
    </Space>
  </CollapseItem>
</template>
