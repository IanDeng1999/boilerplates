<script setup lang="ts">
import { storeToRefs } from "pinia";
import { Button, Cell, CellGroup, Empty, NavBar, Tag } from "vant";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import type { LogLevel } from "../../shared/log/types";
import { useLogStore } from "../../stores/log";

const { t } = useI18n();
const router = useRouter();
const logStore = useLogStore();
const { entries } = storeToRefs(logStore);
const countText = computed(() =>
  t("log.count", { count: entries.value.length }),
);
const displayEntries = computed(() =>
  entries.value.map((entry) => ({
    ...entry,
    formattedExtra: formatExtra(entry.extra),
  })),
);

function getTagType(level: LogLevel) {
  const types = {
    debug: "primary",
    info: "success",
    warn: "warning",
    error: "danger",
  } as const;

  return types[level];
}

function formatExtra(extra: unknown) {
  if (extra === undefined) {
    return "";
  }

  try {
    return JSON.stringify(extra, null, 2);
  } catch {
    return String(extra);
  }
}
</script>

<template>
  <main>
    <NavBar
      :title="t('log.title')"
      fixed
      placeholder
      safe-area-inset-top
      left-arrow
      @click-left="router.back"
    >
      <template #right>
        <Button size="small" type="danger" plain @click="logStore.clear">
          {{ t("log.clear") }}
        </Button>
      </template>
    </NavBar>

    <Empty
      v-if="!entries.length"
      :description="t('log.empty')"
      class="pt-[var(--van-padding-xl)]"
    />
    <CellGroup v-else inset :title="countText">
      <Cell v-for="entry in displayEntries" :key="entry.id" center>
        <template #title>
          <div class="flex items-center gap-[var(--van-padding-xs)]">
            <Tag :type="getTagType(entry.level)">{{ entry.level }}</Tag>
            <span class="break-all">{{ entry.message }}</span>
          </div>
        </template>
        <template #label>
          <div class="mt-[var(--van-padding-xs)]">
            <div>{{ entry.timestamp }}</div>
            <pre
              v-if="entry.extra !== undefined"
              class="mt-[var(--van-padding-xs)] overflow-x-auto whitespace-pre-wrap break-words font-mono text-[length:var(--van-font-size-sm)] text-[var(--van-text-color-2)]"
            >{{ entry.formattedExtra }}</pre>
          </div>
        </template>
      </Cell>
    </CellGroup>
  </main>
</template>
