<template>
  <div ref="container" :class="className" :style="defaultStyle"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue';
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
let resizeObserver: ResizeObserver | null = null;
let tempResizeObserver: ResizeObserver | null = null;
let initTimeout: number | null = null;

// 기본 스타일: 컨테이너가 크기를 가지도록 함
const defaultStyle = computed(() => ({
  width: '100%',
  height: '100%',
  minHeight: 300,
  position: 'relative',
  ...props.style,
}));

const init = () => {
  if (!container.value) return;

  // 이미 인스턴스가 있으면 생성하지 않음 (Vue의 경우 중복 마운트 방지)
  if (instance) {
    return;
  }

  // 컨테이너에 이미 canvas가 있으면 제거 (중복 방지)
  const existingCanvas = container.value.querySelector('canvas');
  if (existingCanvas) {
    existingCanvas.remove();
  }

  // 컨테이너 크기 확인 (getBoundingClientRect 사용)
  const rect = container.value.getBoundingClientRect();
  const hasValidSize = rect.width > 0 && rect.height > 0;

  // 크기가 없으면 ResizeObserver로 대기하거나 재시도
  if (!hasValidSize) {
    // ResizeObserver가 있으면 그것을 사용, 없으면 재시도
    if (typeof ResizeObserver !== 'undefined') {
      let resizeCheckCount = 0;
      const maxResizeChecks = 20; // 최대 1초 대기 (50ms * 20)

      // 기존 tempResizeObserver가 있으면 정리
      if (tempResizeObserver) {
        tempResizeObserver.disconnect();
        tempResizeObserver = null;
      }

      tempResizeObserver = new ResizeObserver(() => {
        resizeCheckCount++;
        const newRect = container.value?.getBoundingClientRect();
        if (newRect && newRect.width > 0 && newRect.height > 0) {
          if (tempResizeObserver) {
            tempResizeObserver.disconnect();
            tempResizeObserver = null;
          }
          init();
        } else if (resizeCheckCount >= maxResizeChecks) {
          // 최대 대기 시간 초과 시 fallback으로 진행
          if (tempResizeObserver) {
            tempResizeObserver.disconnect();
            tempResizeObserver = null;
          }
          init();
        }
      });
      tempResizeObserver.observe(container.value);
      return;
    } else {
      // ResizeObserver가 없으면 재시도
      initTimeout = window.setTimeout(init, 50);
      return;
    }
  }

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

  // ResizeObserver로 컨테이너 크기 변경 감지
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => {
      if (instance) {
        instance.resize();
      }
    });
    resizeObserver.observe(container.value);
  }
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
  // 다음 프레임에 초기화 (DOM이 완전히 렌더링된 후)
  requestAnimationFrame(init);
});

onBeforeUnmount(() => {
  // cleanup: 모든 리소스 정리
  if (initTimeout) {
    clearTimeout(initTimeout);
    initTimeout = null;
  }
  if (tempResizeObserver) {
    tempResizeObserver.disconnect();
    tempResizeObserver = null;
  }
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
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

