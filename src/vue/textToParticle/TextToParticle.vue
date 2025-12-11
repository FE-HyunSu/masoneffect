<template>
  <div ref="container" :class="className" :style="style"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { TextToParticle } from '../../core/index';
import type { TextToParticleOptions } from '../../core/index';

interface Props extends Partial<TextToParticleOptions> {
  className?: string;
  style?: Record<string, any>;
}

const props = withDefaults(defineProps<Props>(), {
  text: 'mason effect',
  densityStep: 2,
  maxParticles: 3200,
  pointSize: 0.5,
  ease: 0.05,
  repelRadius: 150,
  repelStrength: 1,
  particleColor: '#fff',
  fontFamily: 'Inter, system-ui, Arial',
  fontSize: null,
  width: null,
  height: null,
  devicePixelRatio: null,
  className: '',
  style: () => ({}),
  onReady: null,
  onUpdate: null,
});

const emit = defineEmits<{
  ready: [instance: TextToParticle];
  update: [instance: TextToParticle];
}>();

const container = ref<HTMLElement | null>(null);
let instance: TextToParticle | null = null;

const init = () => {
  if (!container.value) return;

  const options: TextToParticleOptions = {
    text: props.text,
    densityStep: props.densityStep,
    maxParticles: props.maxParticles,
    pointSize: props.pointSize,
    ease: props.ease,
    repelRadius: props.repelRadius,
    repelStrength: props.repelStrength,
    particleColor: props.particleColor,
    fontFamily: props.fontFamily,
    fontSize: props.fontSize,
    width: props.width,
    height: props.height,
    devicePixelRatio: props.devicePixelRatio,
    onReady: (inst) => {
      if (props.onReady) props.onReady(inst);
      emit('ready', inst);
    },
    onUpdate: (inst) => {
      if (props.onUpdate) props.onUpdate(inst);
      emit('update', inst);
    },
  };

  instance = new TextToParticle(container.value, options);
};

// props 변경 감지
watch(
  () => [
    props.text,
    props.densityStep,
    props.maxParticles,
    props.pointSize,
    props.ease,
    props.repelRadius,
    props.repelStrength,
    props.particleColor,
    props.fontFamily,
    props.fontSize,
    props.width,
    props.height,
    props.devicePixelRatio,
  ],
  () => {
    if (instance) {
      instance.updateConfig({
        text: props.text,
        densityStep: props.densityStep,
        maxParticles: props.maxParticles,
        pointSize: props.pointSize,
        ease: props.ease,
        repelRadius: props.repelRadius,
        repelStrength: props.repelStrength,
        particleColor: props.particleColor,
        fontFamily: props.fontFamily,
        fontSize: props.fontSize,
        width: props.width,
        height: props.height,
        devicePixelRatio: props.devicePixelRatio,
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
  morph: (textOrOptions?: string | Partial<TextToParticleOptions>) => {
    if (instance) instance.morph(textOrOptions);
  },
  scatter: () => {
    if (instance) instance.scatter();
  },
  updateConfig: (config: Partial<TextToParticleOptions>) => {
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

