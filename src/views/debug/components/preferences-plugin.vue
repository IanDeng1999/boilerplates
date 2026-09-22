<script setup lang="ts">
import { Preferences } from "@capacitor/preferences";
import { Button, Cell, CellGroup, CollapseItem, Field, Space } from "vant";
import { ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const key = ref("debug.preference");
const value = ref("Capacitor");
const result = ref("");

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

async function runPreferenceAction(action: () => Promise<unknown>) {
  try {
    const actionResult = await action();
    result.value =
      actionResult === undefined
        ? t("debug.completed")
        : JSON.stringify(actionResult, null, 2);
  } catch (error) {
    result.value = getErrorMessage(error);
  }
}
</script>

<template>
  <CollapseItem :title="t('debug.preferences.title')" name="preferences">
    <p
      class="mb-[var(--van-padding-md)] text-[length:var(--van-font-size-md)] text-[var(--van-text-color-2)]"
    >
      {{ t("debug.preferences.description") }}
    </p>
    <Space direction="vertical" fill>
      <Field
        v-model="key"
        clearable
        :label="t('debug.preferences.keyLabel')"
        :placeholder="t('debug.preferences.keyPlaceholder')"
      />
      <Field
        v-model="value"
        clearable
        :label="t('debug.preferences.valueLabel')"
        :placeholder="t('debug.preferences.valuePlaceholder')"
      />
      <Space wrap>
        <Button
          size="small"
          type="primary"
          @click="runPreferenceAction(() => Preferences.set({ key, value }))"
        >
          {{ t("debug.preferences.set") }}
        </Button>
        <Button
          size="small"
          @click="runPreferenceAction(() => Preferences.get({ key }))"
        >
          {{ t("debug.preferences.get") }}
        </Button>
        <Button
          size="small"
          @click="runPreferenceAction(() => Preferences.remove({ key }))"
        >
          {{ t("debug.preferences.remove") }}
        </Button>
        <Button
          size="small"
          plain
          type="primary"
          @click="runPreferenceAction(() => Preferences.keys())"
        >
          {{ t("debug.preferences.keys") }}
        </Button>
      </Space>
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
