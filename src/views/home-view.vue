<template>
  <main>
    <NavBar :title="t('home.title')" fixed placeholder safe-area-inset-top />
  </main>
</template>

<script setup lang="ts">
import { NavBar } from "vant";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>
