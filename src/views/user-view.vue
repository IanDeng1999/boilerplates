<script setup lang="ts">
import { storeToRefs } from "pinia";
import { Cell, CellGroup, Switch } from "vant";
import { useI18n } from "vue-i18n";
import { useAppStore } from "../stores/app";

const appStore = useAppStore();
const { isDark, locale } = storeToRefs(appStore);
const { t } = useI18n();
</script>

<template>
  <div class="tab-page">
    <h2 class="section-title">{{ t("profile.preferences") }}</h2>
    <CellGroup inset>
      <Cell
        :title="t('profile.darkMode')"
        icon="setting-o"
        clickable
        @click="appStore.toggleTheme"
      >
        <template #right-icon>
          <Switch
            :model-value="isDark"
            size="22px"
            @click.stop
            @update:model-value="appStore.toggleTheme"
          />
        </template>
      </Cell>
      <Cell
        :title="t('profile.language')"
        :value="t(locale === 'zh-CN' ? 'common.chinese' : 'common.english')"
        icon="font-o"
        is-link
        clickable
        @click="appStore.toggleLocale"
      />
    </CellGroup>
  </div>
</template>
