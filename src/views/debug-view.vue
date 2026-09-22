<script setup lang="ts">
import { Capacitor } from "@capacitor/core";
import { Button, Cell, CellGroup, NavBar, showToast } from "vant";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
</script>

<template>
  <main>
    <NavBar
      :title="t('debug.title')"
      left-arrow
      fixed
      placeholder
      safe-area-inset-top
      @click-left="router.back()"
    />

    <CellGroup inset :title="t('debug.environment')">
      <Cell :title="t('debug.route')" :value="route.fullPath" />
      <Cell :title="t('debug.platform')" :value="Capacitor.getPlatform()" />
      <Cell
        :title="t('debug.nativePlatform')"
        :value="t(Capacitor.isNativePlatform() ? 'debug.yes' : 'debug.no')"
      />
    </CellGroup>

    <div class="p-[var(--van-padding-md)]">
      <Button type="primary" block @click="showToast(t('debug.toastMessage'))">
        {{ t("debug.testToast") }}
      </Button>
    </div>
  </main>
</template>
