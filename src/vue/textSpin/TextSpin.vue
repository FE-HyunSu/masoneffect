<template>
  <div ref="container" :class="className" :style="style"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { TextSpin } from '../../core/textSpin/index';
import type { TextSpinOptions } from '../../core/textSpin/index';

interface Props extends Omit<TextSpinOptions, 'onStart' | 'onComplete'> {
  className?: string;
  style?: Record<string, any>;
  onStart?: () => void;
  onComplete?: () => void;
}

const props = withDefaults(defineProps<Props>(), {
  text: '',
  delay: 0.2,
  duration: 0.6,
  randomDelay: 2,
  threshold: 0.1,
  rootMargin: '0px',
  root: null,
  triggerOnce: false,
  enabled: true,
  className: '',
  style: () => ({}),
  onStart: null,
  onComplete: null,
});

const emit = defineEmits<{
  start: [];
  complete: [];
}>();

const container = ref<HTMLElement | null>(null);
let instance: TextSpin | null = null;

const init = () => {
  if (!container.value) return;

  const options: TextSpinOptions = {
    text: props.text,
    delay: props.delay,
    duration: props.duration,
    randomDelay: props.randomDelay,
    threshold: props.threshold,
    rootMargin: props.rootMargin,
    root: props.root,
    triggerOnce: props.triggerOnce,
    enabled: props.enabled,
    onStart: () => {
      if (props.onStart) props.onStart();
      emit('start');
    },
    onComplete: () => {
      if (props.onComplete) props.onComplete();
      emit('complete');
    },
  };

  instance = new TextSpin(container.value, options);
};

onMounted(() => {
  init();
});

onBeforeUnmount(() => {
  if (instance) {
    instance.destroy();
    instance = null;
  }
});

// props 변경 감지
watch(
  () => [
    props.text,
    props.delay,
    props.duration,
    props.randomDelay,
    props.threshold,
    props.rootMargin,
    props.root,
    props.triggerOnce,
    props.enabled,
    props.onStart,
    props.onComplete,
  ],
  () => {
    if (instance) {
      instance.updateConfig({
        text: props.text,
        delay: props.delay,
        duration: props.duration,
        randomDelay: props.randomDelay,
        threshold: props.threshold,
        rootMargin: props.rootMargin,
        root: props.root,
        triggerOnce: props.triggerOnce,
        enabled: props.enabled,
        onStart: props.onStart || undefined,
        onComplete: props.onComplete || undefined,
      });
    }
  },
  { deep: true }
);

// 외부에서 사용할 수 있는 메서드 노출
defineExpose({
  start: () => {
    if (instance) instance.start();
  },
  stop: () => {
    if (instance) instance.stop();
  },
  reset: () => {
    if (instance) instance.reset();
  },
  updateText: (text: string) => {
    if (instance) instance.updateText(text);
  },
  updateConfig: (config: Partial<TextSpinOptions>) => {
    if (instance) instance.updateConfig(config);
  },
  destroy: () => {
    if (instance) {
      instance.destroy();
      instance = null;
    }
  },
});
</script>

