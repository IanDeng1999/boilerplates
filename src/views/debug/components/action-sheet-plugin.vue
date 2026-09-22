<script setup lang="ts">
import { ActionSheet, ActionSheetButtonStyle } from "@capacitor/action-sheet";
import { Button, Cell, CellGroup, CollapseItem } from "vant";
import { ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const result = ref("");

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

async function showActionSheet() {
  try {
    const actionSheetResult = await ActionSheet.showActions({
      title: t("debug.actionSheet.dialogTitle"),
      message: t("debug.actionSheet.message"),
      cancelable: true,
      options: [
        { title: t("debug.actionSheet.upload") },
        { title: t("debug.actionSheet.share") },
        {
          title: t("debug.actionSheet.remove"),
          style: ActionSheetButtonStyle.Destructive,
        },
        {
          title: t("debug.actionSheet.cancel"),
          style: ActionSheetButtonStyle.Cancel,
        },
      ],
    });

    result.value = JSON.stringify(actionSheetResult, null, 2);
  } catch (error) {
    result.value = getErrorMessage(error);
  }
}
</script>

<template>
  <CollapseItem :title="t('debug.actionSheet.title')" name="action-sheet">
    <p
      class="mb-[var(--van-padding-md)] text-[length:var(--van-font-size-md)] text-[var(--van-text-color-2)]"
    >
      {{ t("debug.actionSheet.description") }}
    </p>
    <Button block type="primary" @click="showActionSheet">
      {{ t("debug.actionSheet.action") }}
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
