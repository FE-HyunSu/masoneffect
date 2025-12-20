<template>
  <div ref="container" :class="className" :style="style">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { ScrollFadeIn } from '../../core/scrollFadeIn/index';
import type { ScrollFadeInOptions } from '../../core/scrollFadeIn/index';

interface Props extends Partial<ScrollFadeInOptions> {
  className?: string;
  style?: Record<string, any>;
}

const props = withDefaults(defineProps<Props>(), {
  direction: 'bottom',
  distance: '50px',
  duration: 800,
  easing: () => (t: number) => t,
  threshold: 0.1,
  rootMargin: '0px',
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
let instance: ScrollFadeIn | null = null;

const init = () => {
  if (!container.value) return;

  const options: ScrollFadeInOptions = {
    direction: props.direction,
    distance: props.distance,
    duration: props.duration,
    easing: props.easing,
    threshold: props.threshold,
    rootMargin: props.rootMargin,
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

  instance = new ScrollFadeIn(container.value, options);
};

// props 변경 감지
watch(
  () => [
    props.direction,
    props.distance,
    props.duration,
    props.easing,
    props.threshold,
    props.rootMargin,
    props.triggerOnce,
    props.enabled,
  ],
  () => {
    if (instance) {
      instance.updateConfig({
        direction: props.direction,
        distance: props.distance,
        duration: props.duration,
        easing: props.easing,
        threshold: props.threshold,
        rootMargin: props.rootMargin,
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
  updateConfig: (config: Partial<ScrollFadeInOptions>) => {
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

