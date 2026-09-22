<script setup lang="ts">
import { Share } from "@capacitor/share";
import { Button, Cell, CellGroup, CollapseItem, Space } from "vant";
import { ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const result = ref("");

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

async function checkShareSupport() {
  try {
    const { value } = await Share.canShare();
    result.value = t(value ? "debug.available" : "debug.unavailable");
  } catch (error) {
    result.value = getErrorMessage(error);
  }
}

async function shareContent() {
  try {
    const shareResult = await Share.share({
      title: t("debug.share.contentTitle"),
      text: t("debug.share.contentText"),
      url: window.location.origin,
      dialogTitle: t("debug.share.dialogTitle"),
    });
    result.value = shareResult.activityType ?? t("debug.completed");
  } catch (error) {
    result.value = getErrorMessage(error);
  }
}
</script>

<template>
  <CollapseItem :title="t('debug.share.title')" name="share">
    <p
      class="mb-[var(--van-padding-md)] text-[length:var(--van-font-size-md)] text-[var(--van-text-color-2)]"
    >
      {{ t("debug.share.description") }}
    </p>
    <Space direction="vertical" fill>
      <Button block plain type="primary" @click="checkShareSupport">
        {{ t("debug.share.check") }}
      </Button>
      <Button block type="primary" @click="shareContent">
        {{ t("debug.share.action") }}
      </Button>
      <CellGroup v-if="result" inset>
        <Cell :title="t('debug.result')" :label="result" />
      </CellGroup>
    </Space>
  </CollapseItem>
</template>
