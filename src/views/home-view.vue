<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

<template>
  <div class="tab-page">
    <header class="page-header">
      <p>{{ t("home.eyebrow") }}</p>
      <h1>{{ t("home.title") }}</h1>
    </header>
  </div>
</template>
