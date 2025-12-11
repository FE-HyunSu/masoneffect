<template>
  <div ref="container" :class="className" :style="style"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { Count } from '../../core/count/index';
import type { CountOptions } from '../../core/count/index';

interface Props extends Partial<CountOptions> {
  className?: string;
  style?: Record<string, any>;
}

const props = withDefaults(defineProps<Props>(), {
  targetValue: 0,
  duration: 2000,
  startValue: 0,
  enabled: true,
  easing: () => (t: number) => t,
  threshold: 0.2,
  rootMargin: '0px 0px -100px 0px',
  triggerOnce: false,
  className: '',
  style: () => ({}),
  onUpdate: null,
  onComplete: null,
});

const emit = defineEmits<{
  update: [value: number];
  complete: [];
}>();

const container = ref<HTMLElement | null>(null);
let instance: Count | null = null;

const init = () => {
  if (!container.value) return;

  const options: CountOptions = {
    targetValue: props.targetValue,
    duration: props.duration,
    startValue: props.startValue,
    enabled: props.enabled,
    easing: props.easing,
    threshold: props.threshold,
    rootMargin: props.rootMargin,
    triggerOnce: props.triggerOnce,
    onUpdate: (value) => {
      if (props.onUpdate) props.onUpdate(value);
      emit('update', value);
    },
    onComplete: () => {
      if (props.onComplete) props.onComplete();
      emit('complete');
    },
  };

  instance = new Count(container.value, options);
};

// props 변경 감지
watch(
  () => [
    props.targetValue,
    props.duration,
    props.startValue,
    props.enabled,
    props.easing,
    props.threshold,
    props.rootMargin,
    props.triggerOnce,
  ],
  () => {
    if (instance) {
      instance.updateConfig({
        targetValue: props.targetValue,
        duration: props.duration,
        startValue: props.startValue,
        enabled: props.enabled,
        easing: props.easing,
        threshold: props.threshold,
        rootMargin: props.rootMargin,
        triggerOnce: props.triggerOnce,
        onUpdate: (value) => {
          if (props.onUpdate) props.onUpdate(value);
          emit('update', value);
        },
        onComplete: () => {
          if (props.onComplete) props.onComplete();
          emit('complete');
        },
      });
    }
  }
);

onMounted(() => {
  init();
});

onBeforeUnmount(() => {
  if (instance) {
    instance.destroy();
    instance = null;
  }
});

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
  getValue: () => {
    if (instance) return instance.getValue();
    return 0;
  },
  updateConfig: (config: Partial<CountOptions>) => {
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

