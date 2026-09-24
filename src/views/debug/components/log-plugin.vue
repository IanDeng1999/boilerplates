<script setup lang="ts">
import { Button, CollapseItem, Space } from "vant";
import { useI18n } from "vue-i18n";
import { useLogStore } from "../../../stores/log";

const { t } = useI18n();
const logStore = useLogStore();

function writeDebugLog() {
  logStore.debug(t("debug.logs.debugMessage"), { source: "debug" });
}

function writeInfoLog() {
  logStore.info(t("debug.logs.infoMessage"), { source: "debug" });
}

function writeWarnLog() {
  logStore.warn(t("debug.logs.warnMessage"), { source: "debug" });
}

function writeErrorLog() {
  logStore.error(
    t("debug.logs.errorMessage"),
    new Error(t("debug.logs.errorDetail")),
  );
}
</script>

<template>
  <CollapseItem :title="t('debug.logs.title')" name="logs">
    <p
      class="mb-[var(--van-padding-md)] text-[length:var(--van-font-size-md)] text-[var(--van-text-color-2)]"
    >
      {{ t("debug.logs.description") }}
    </p>
    <Space wrap>
      <Button size="small" type="primary" @click="writeDebugLog">
        {{ t("debug.logs.debug") }}
      </Button>
      <Button size="small" type="success" @click="writeInfoLog">
        {{ t("debug.logs.info") }}
      </Button>
      <Button size="small" type="warning" @click="writeWarnLog">
        {{ t("debug.logs.warn") }}
      </Button>
      <Button size="small" type="danger" @click="writeErrorLog">
        {{ t("debug.logs.error") }}
      </Button>
    </Space>
  </CollapseItem>
</template>
