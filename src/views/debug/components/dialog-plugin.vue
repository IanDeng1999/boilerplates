<script setup lang="ts">
import { Dialog } from "@capacitor/dialog";
import { Button, Cell, CellGroup, CollapseItem, Space } from "vant";
import { ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const result = ref("");

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

async function showAlert() {
  try {
    await Dialog.alert({
      title: t("debug.dialog.alertTitle"),
      message: t("debug.dialog.alertMessage"),
      buttonTitle: t("debug.dialog.ok"),
    });
    result.value = t("debug.completed");
  } catch (error) {
    result.value = getErrorMessage(error);
  }
}

async function showConfirm() {
  try {
    const confirmResult = await Dialog.confirm({
      title: t("debug.dialog.confirmTitle"),
      message: t("debug.dialog.confirmMessage"),
      okButtonTitle: t("debug.dialog.ok"),
      cancelButtonTitle: t("debug.dialog.cancel"),
    });
    result.value = JSON.stringify(confirmResult, null, 2);
  } catch (error) {
    result.value = getErrorMessage(error);
  }
}

async function showPrompt() {
  try {
    const promptResult = await Dialog.prompt({
      title: t("debug.dialog.promptTitle"),
      message: t("debug.dialog.promptMessage"),
      okButtonTitle: t("debug.dialog.ok"),
      cancelButtonTitle: t("debug.dialog.cancel"),
      inputPlaceholder: t("debug.dialog.promptPlaceholder"),
      inputText: t("debug.dialog.promptDefaultValue"),
    });
    result.value = JSON.stringify(promptResult, null, 2);
  } catch (error) {
    result.value = getErrorMessage(error);
  }
}
</script>

<template>
  <CollapseItem :title="t('debug.dialog.title')" name="dialog">
    <p
      class="mb-[var(--van-padding-md)] text-[length:var(--van-font-size-md)] text-[var(--van-text-color-2)]"
    >
      {{ t("debug.dialog.description") }}
    </p>
    <Space direction="vertical" fill>
      <Button block type="primary" @click="showAlert">
        {{ t("debug.dialog.alert") }}
      </Button>
      <Button block plain type="primary" @click="showConfirm">
        {{ t("debug.dialog.confirm") }}
      </Button>
      <Button block plain type="primary" @click="showPrompt">
        {{ t("debug.dialog.prompt") }}
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
