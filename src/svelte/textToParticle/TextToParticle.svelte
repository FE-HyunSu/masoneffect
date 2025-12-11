<script lang="ts">
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';
  import { TextToParticle } from '../../core/index';
  import type { TextToParticleOptions } from '../../core/index';

  export let text: string = 'mason effect';
  export let densityStep: number = 2;
  export let maxParticles: number = 3200;
  export let pointSize: number = 0.5;
  export let ease: number = 0.05;
  export let repelRadius: number = 150;
  export let repelStrength: number = 1;
  export let particleColor: string = '#fff';
  export let fontFamily: string = 'Inter, system-ui, Arial';
  export let fontSize: number | null = null;
  export let width: number | null = null;
  export let height: number | null = null;
  export let devicePixelRatio: number | null = null;
  export let className: string = '';
  export let style: Record<string, any> = {};

  const dispatch = createEventDispatcher<{
    ready: TextToParticle;
    update: TextToParticle;
  }>();

  let container: HTMLDivElement;
  let instance: TextToParticle | null = null;

  $: {
    if (instance) {
      instance.updateConfig({
        text,
        densityStep,
        maxParticles,
        pointSize,
        ease,
        repelRadius,
        repelStrength,
        particleColor,
        fontFamily,
        fontSize,
        width,
        height,
        devicePixelRatio,
      });
    }
  }

  onMount(() => {
    if (!container) return;

    const options: TextToParticleOptions = {
      text,
      densityStep,
      maxParticles,
      pointSize,
      ease,
      repelRadius,
      repelStrength,
      particleColor,
      fontFamily,
      fontSize,
      width,
      height,
      devicePixelRatio,
      onReady: (inst) => {
        dispatch('ready', inst);
      },
      onUpdate: (inst) => {
        dispatch('update', inst);
      },
    };

    instance = new TextToParticle(container, options);
  });

  onDestroy(() => {
    if (instance) {
      instance.destroy();
      instance = null;
    }
  });

  export function morph(textOrOptions?: string | Partial<TextToParticleOptions>) {
    if (instance) {
      instance.morph(textOrOptions);
    }
  }

  export function scatter() {
    if (instance) {
      instance.scatter();
    }
  }

  export function updateConfig(config: Partial<TextToParticleOptions>) {
    if (instance) {
      instance.updateConfig(config);
    }
  }

  export function destroy() {
    if (instance) {
      instance.destroy();
      instance = null;
    }
  }
</script>

<div bind:this={container} class={className} style={style}></div>

