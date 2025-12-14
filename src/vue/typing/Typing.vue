<template>
  <div ref="containerRef" :class="className" :style="style"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { Typing } from '../../core/typing/index.js';
import type { TypingOptions } from '../../core/typing/index.js';

export interface TypingRef {
  start: () => void;
  stop: () => void;
  reset: () => void;
  setText: (text: string) => void;
  destroy: () => void;
}

interface Props extends Omit<TypingOptions, 'onUpdate' | 'onComplete'> {
  className?: string;
  style?: string | Record<string, string>;
  onUpdate?: (text: string) => void;
  onComplete?: () => void;
}

const props = withDefaults(defineProps<Props>(), {
  speed: 50,
  delay: 0,
  enabled: true,
  threshold: 0.2,
  rootMargin: '0px 0px -100px 0px',
  triggerOnce: false,
  showCursor: true,
  cursorChar: '|',
});

const containerRef = ref<HTMLElement | null>(null);
const instanceRef = ref<Typing | null>(null);

onMounted(() => {
  if (!containerRef.value) return;

  const options: TypingOptions = {
    text: props.text,
    speed: props.speed,
    delay: props.delay,
    enabled: props.enabled,
    threshold: props.threshold,
    rootMargin: props.rootMargin,
    triggerOnce: props.triggerOnce,
    showCursor: props.showCursor,
    cursorChar: props.cursorChar,
    onUpdate: props.onUpdate,
    onComplete: props.onComplete,
  };

  instanceRef.value = new Typing(containerRef.value, options);
});

onUnmounted(() => {
  if (instanceRef.value) {
    instanceRef.value.destroy();
    instanceRef.value = null;
  }
});

// text 변경 감지
watch(() => props.text, (newText) => {
  if (instanceRef.value && newText !== instanceRef.value['originalText']) {
    instanceRef.value.setText(newText);
  }
});

// ref를 통해 메서드 노출
defineExpose({
  start: () => instanceRef.value?.start(),
  stop: () => instanceRef.value?.stop(),
  reset: () => instanceRef.value?.reset(),
  setText: (text: string) => instanceRef.value?.setText(text),
  destroy: () => {
    if (instanceRef.value) {
      instanceRef.value.destroy();
      instanceRef.value = null;
    }
  },
});
</script>

