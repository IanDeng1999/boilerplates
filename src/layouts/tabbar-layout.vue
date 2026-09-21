<script setup lang="ts">
import { Tabbar, TabbarItem } from "vant";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

<template>
  <main class="tabbar-content">
    <RouterView />
  </main>

  <Tabbar route fixed safe-area-inset-bottom>
    <TabbarItem replace to="/tabbar/home" icon="home-o">{{
      t("nav.home")
    }}</TabbarItem>
    <TabbarItem replace to="/tabbar/user" icon="user-o">{{
      t("nav.profile")
    }}</TabbarItem>
  </Tabbar>
</template>
