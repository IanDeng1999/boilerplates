<template>
  <main class="size-full overflow-y-auto">
    <RouterView v-slot="{ Component, route }">
      <Transition :name="String(route.meta.pageTransition)">
        <component
          :is="Component"
          :key="route.matched[0]?.path ?? route.path"
          class="size-full"
        />
      </Transition>
    </RouterView>
  </main>
</template>

<style lang="less">
.app-page-forward-enter-active,
.app-page-forward-leave-active,
.app-page-back-enter-active,
.app-page-back-leave-active {
  transition:
    opacity var(--van-duration-base) var(--van-ease-out),
    transform var(--van-duration-base) var(--van-ease-out);
  will-change: opacity, transform;
}

.app-page-forward-enter-from {
  opacity: 0;
  transform: translateX(12%) scale(0.985);
}

.app-page-forward-leave-to {
  opacity: 0;
  transform: translateX(-4%) scale(0.99);
}

.app-page-back-enter-from {
  opacity: 0;
  transform: translateX(-4%) scale(0.99);
}

.app-page-back-leave-to {
  opacity: 0;
  transform: translateX(12%) scale(0.985);
}

@media (prefers-reduced-motion: reduce) {
  .app-page-forward-enter-active,
  .app-page-forward-leave-active,
  .app-page-back-enter-active,
  .app-page-back-leave-active {
    transition-duration: 0ms;
  }
}
</style>
