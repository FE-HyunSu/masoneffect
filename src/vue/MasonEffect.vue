<template>
  <div ref="container" :class="className" :style="style"></div>
</template>

<script>
import { defineComponent, ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { MasonEffect } from '../core/index.js';

export default defineComponent({
  name: 'MasonEffect',
  props: {
    text: {
      type: String,
      default: 'mason crawler',
    },
    densityStep: {
      type: Number,
      default: 2,
    },
    maxParticles: {
      type: Number,
      default: 3200,
    },
    pointSize: {
      type: Number,
      default: 0.5,
    },
    ease: {
      type: Number,
      default: 0.05,
    },
    repelRadius: {
      type: Number,
      default: 150,
    },
    repelStrength: {
      type: Number,
      default: 1,
    },
    particleColor: {
      type: String,
      default: '#fff',
    },
    fontFamily: {
      type: String,
      default: 'Inter, system-ui, Arial',
    },
    fontSize: {
      type: Number,
      default: null,
    },
    width: {
      type: Number,
      default: null,
    },
    height: {
      type: Number,
      default: null,
    },
    devicePixelRatio: {
      type: Number,
      default: null,
    },
    className: {
      type: String,
      default: '',
    },
    style: {
      type: Object,
      default: () => ({}),
    },
    onReady: {
      type: Function,
      default: null,
    },
    onUpdate: {
      type: Function,
      default: null,
    },
  },
  emits: ['ready', 'update'],
  setup(props, { expose, emit }) {
    const container = ref(null);
    let instance = null;

    const init = () => {
      if (!container.value) return;

      const options = {
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

      instance = new MasonEffect(container.value, options);
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
    expose({
      morph: (text) => {
        if (instance) instance.morph(text);
      },
      scatter: () => {
        if (instance) instance.scatter();
      },
      updateConfig: (config) => {
        if (instance) instance.updateConfig(config);
      },
      destroy: () => {
        if (instance) {
          instance.destroy();
          instance = null;
        }
      },
    });

    return {
      container,
    };
  },
});
</script>

