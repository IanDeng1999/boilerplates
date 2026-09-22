<script setup lang="ts">
import type { PluginListenerHandle } from "@capacitor/core";
import { Keyboard, KeyboardResize, KeyboardStyle } from "@capacitor/keyboard";
import { Button, Cell, CellGroup, CollapseItem, Field, Space } from "vant";
import { onMounted, onUnmounted, ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const inputValue = ref("");
const result = ref("");
const events = ref<string[]>([]);
const listenerHandles: PluginListenerHandle[] = [];

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function recordEvent(name: string, keyboardHeight?: number) {
  const event =
    keyboardHeight === undefined ? { name } : { name, keyboardHeight };
  events.value = [JSON.stringify(event), ...events.value].slice(0, 6);
}

async function runKeyboardAction(action: () => Promise<void>) {
  try {
    await action();
    result.value = t("debug.completed");
  } catch (error) {
    result.value = getErrorMessage(error);
  }
}

async function loadResizeMode() {
  try {
    result.value = JSON.stringify(await Keyboard.getResizeMode(), null, 2);
  } catch (error) {
    result.value = getErrorMessage(error);
  }
}

onMounted(async () => {
  try {
    listenerHandles.push(
      await Keyboard.addListener("keyboardWillShow", ({ keyboardHeight }) => {
        recordEvent("keyboardWillShow", keyboardHeight);
      }),
      await Keyboard.addListener("keyboardDidShow", ({ keyboardHeight }) => {
        recordEvent("keyboardDidShow", keyboardHeight);
      }),
      await Keyboard.addListener("keyboardWillHide", () => {
        recordEvent("keyboardWillHide");
      }),
      await Keyboard.addListener("keyboardDidHide", () => {
        recordEvent("keyboardDidHide");
      }),
    );
  } catch (error) {
    result.value = getErrorMessage(error);
  }
});

onUnmounted(() => {
  for (const handle of listenerHandles) {
    void handle.remove();
  }
});
</script>

<template>
  <CollapseItem :title="t('debug.keyboard.title')" name="keyboard">
    <p
      class="mb-[var(--van-padding-md)] text-[length:var(--van-font-size-md)] text-[var(--van-text-color-2)]"
    >
      {{ t("debug.keyboard.description") }}
    </p>
    <Space direction="vertical" fill>
      <Field
        v-model="inputValue"
        clearable
        :label="t('debug.keyboard.inputLabel')"
        :placeholder="t('debug.keyboard.inputPlaceholder')"
      />
      <Space wrap>
        <Button
          size="small"
          type="primary"
          @click="runKeyboardAction(() => Keyboard.show())"
        >
          {{ t("debug.keyboard.show") }}
        </Button>
        <Button size="small" @click="runKeyboardAction(() => Keyboard.hide())">
          {{ t("debug.keyboard.hide") }}
        </Button>
      </Space>

      <p
        class="text-[length:var(--van-font-size-sm)] text-[var(--van-text-color-2)]"
      >
        {{ t("debug.keyboard.iosControls") }}
      </p>
      <Space wrap>
        <Button
          size="small"
          @click="runKeyboardAction(() => Keyboard.setAccessoryBarVisible({ isVisible: true }))"
        >
          {{ t("debug.keyboard.showAccessoryBar") }}
        </Button>
        <Button
          size="small"
          @click="runKeyboardAction(() => Keyboard.setAccessoryBarVisible({ isVisible: false }))"
        >
          {{ t("debug.keyboard.hideAccessoryBar") }}
        </Button>
        <Button
          size="small"
          @click="runKeyboardAction(() => Keyboard.setScroll({ isDisabled: false }))"
        >
          {{ t("debug.keyboard.enableScroll") }}
        </Button>
        <Button
          size="small"
          @click="runKeyboardAction(() => Keyboard.setScroll({ isDisabled: true }))"
        >
          {{ t("debug.keyboard.disableScroll") }}
        </Button>
      </Space>

      <p
        class="text-[length:var(--van-font-size-sm)] text-[var(--van-text-color-2)]"
      >
        {{ t("debug.keyboard.style") }}
      </p>
      <Space wrap>
        <Button
          size="small"
          @click="runKeyboardAction(() => Keyboard.setStyle({ style: KeyboardStyle.Default }))"
        >
          {{ t("debug.keyboard.defaultStyle") }}
        </Button>
        <Button
          size="small"
          @click="runKeyboardAction(() => Keyboard.setStyle({ style: KeyboardStyle.Light }))"
        >
          {{ t("debug.keyboard.lightStyle") }}
        </Button>
        <Button
          size="small"
          @click="runKeyboardAction(() => Keyboard.setStyle({ style: KeyboardStyle.Dark }))"
        >
          {{ t("debug.keyboard.darkStyle") }}
        </Button>
      </Space>

      <p
        class="text-[length:var(--van-font-size-sm)] text-[var(--van-text-color-2)]"
      >
        {{ t("debug.keyboard.resizeMode") }}
      </p>
      <Space wrap>
        <Button size="small" @click="loadResizeMode">
          {{ t("debug.keyboard.getResizeMode") }}
        </Button>
        <Button
          size="small"
          @click="runKeyboardAction(() => Keyboard.setResizeMode({ mode: KeyboardResize.Native }))"
        >
          Native
        </Button>
        <Button
          size="small"
          @click="runKeyboardAction(() => Keyboard.setResizeMode({ mode: KeyboardResize.Body }))"
        >
          Body
        </Button>
        <Button
          size="small"
          @click="runKeyboardAction(() => Keyboard.setResizeMode({ mode: KeyboardResize.None }))"
        >
          None
        </Button>
      </Space>

      <CellGroup v-if="result" inset>
        <Cell :title="t('debug.result')" :label="result" />
      </CellGroup>
      <CellGroup v-if="events.length" inset>
        <Cell :title="t('debug.keyboard.events')">
          <template #label>
            <pre
              class="overflow-x-auto whitespace-pre-wrap break-words font-mono"
            >{{ events.join("\n") }}</pre>
          </template>
        </Cell>
      </CellGroup>
    </Space>
  </CollapseItem>
</template>
