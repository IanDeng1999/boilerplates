<script setup lang="ts">
import { Tabbar, TabbarItem } from "vant";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

<template>
  <div class="size-full flex flex-col">
    <div class="flex-1 min-h-0 overflow-y-auto">
      <RouterView />
    </div>

    <Tabbar route placeholder fixed safe-area-inset-bottom>
      <TabbarItem to="/tabbar/home" icon="home-o">{{
        t("nav.home")
      }}</TabbarItem>
      <TabbarItem to="/tabbar/user" icon="user-o">{{
        t("nav.profile")
      }}</TabbarItem>
    </Tabbar>
  </div>
</template>
