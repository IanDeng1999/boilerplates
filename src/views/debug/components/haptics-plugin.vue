<script setup lang="ts">
import { Haptics, ImpactStyle, NotificationType } from "@capacitor/haptics";
import { Button, Cell, CellGroup, CollapseItem, Space } from "vant";
import { ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const result = ref("");

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

async function runHapticsAction(action: () => Promise<void>) {
  try {
    await action();
    result.value = t("debug.completed");
  } catch (error) {
    result.value = getErrorMessage(error);
  }
}
</script>

<template>
  <CollapseItem :title="t('debug.haptics.title')" name="haptics">
    <p
      class="mb-[var(--van-padding-md)] text-[length:var(--van-font-size-md)] text-[var(--van-text-color-2)]"
    >
      {{ t("debug.haptics.description") }}
    </p>
    <Space direction="vertical" fill>
      <p
        class="text-[length:var(--van-font-size-sm)] text-[var(--van-text-color-2)]"
      >
        {{ t("debug.haptics.impact") }}
      </p>
      <Space wrap>
        <Button
          size="small"
          @click="runHapticsAction(() => Haptics.impact({ style: ImpactStyle.Light }))"
        >
          {{ t("debug.haptics.light") }}
        </Button>
        <Button
          size="small"
          @click="runHapticsAction(() => Haptics.impact({ style: ImpactStyle.Medium }))"
        >
          {{ t("debug.haptics.medium") }}
        </Button>
        <Button
          size="small"
          @click="runHapticsAction(() => Haptics.impact({ style: ImpactStyle.Heavy }))"
        >
          {{ t("debug.haptics.heavy") }}
        </Button>
      </Space>

      <p
        class="text-[length:var(--van-font-size-sm)] text-[var(--van-text-color-2)]"
      >
        {{ t("debug.haptics.notification") }}
      </p>
      <Space wrap>
        <Button
          size="small"
          @click="runHapticsAction(() => Haptics.notification({ type: NotificationType.Success }))"
        >
          {{ t("debug.haptics.success") }}
        </Button>
        <Button
          size="small"
          @click="runHapticsAction(() => Haptics.notification({ type: NotificationType.Warning }))"
        >
          {{ t("debug.haptics.warning") }}
        </Button>
        <Button
          size="small"
          @click="runHapticsAction(() => Haptics.notification({ type: NotificationType.Error }))"
        >
          {{ t("debug.haptics.error") }}
        </Button>
      </Space>

      <Button
        block
        plain
        type="primary"
        @click="runHapticsAction(() => Haptics.vibrate({ duration: 500 }))"
      >
        {{ t("debug.haptics.vibrate") }}
      </Button>

      <p
        class="text-[length:var(--van-font-size-sm)] text-[var(--van-text-color-2)]"
      >
        {{ t("debug.haptics.selection") }}
      </p>
      <Space wrap>
        <Button
          size="small"
          @click="runHapticsAction(() => Haptics.selectionStart())"
        >
          {{ t("debug.haptics.selectionStart") }}
        </Button>
        <Button
          size="small"
          @click="runHapticsAction(() => Haptics.selectionChanged())"
        >
          {{ t("debug.haptics.selectionChanged") }}
        </Button>
        <Button
          size="small"
          @click="runHapticsAction(() => Haptics.selectionEnd())"
        >
          {{ t("debug.haptics.selectionEnd") }}
        </Button>
      </Space>

      <CellGroup v-if="result" inset>
        <Cell :title="t('debug.result')" :label="result" />
      </CellGroup>
    </Space>
  </CollapseItem>
</template>
