<script setup lang="ts">
import { storeToRefs } from "pinia";
import { Cell, CellGroup, NavBar, Switch } from "vant";
import { useI18n } from "vue-i18n";
import { useAppStore } from "../../stores/app";

const appStore = useAppStore();
const { isDark, locale } = storeToRefs(appStore);
const { t } = useI18n();
</script>

<template>
  <main>
    <NavBar :title="t('profile.title')" fixed placeholder safe-area-inset-top />
    <CellGroup inset :title="t('profile.preferences')">
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

    <CellGroup inset :title="t('profile.development')">
      <Cell
        :title="t('profile.debug')"
        icon="setting-o"
        is-link
        clickable
        to="/debug"
      />
      <Cell
        :title="t('profile.log')"
        icon="description-o"
        is-link
        clickable
        to="/log"
      />
    </CellGroup>
  </main>
</template>
