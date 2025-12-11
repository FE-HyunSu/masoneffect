<script lang="ts">
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';
  import { Count } from '../../core/count/index';
  import type { CountOptions } from '../../core/count/index';

  export let targetValue: number = 0;
  export let duration: number = 2000;
  export let startValue: number = 0;
  export let enabled: boolean = true;
  export let easing: (t: number) => number = (t) => t;
  export let threshold: number = 0.2;
  export let rootMargin: string = '0px 0px -100px 0px';
  export let triggerOnce: boolean = false;
  export let className: string = '';
  export let style: Record<string, any> = {};

  const dispatch = createEventDispatcher<{
    update: number;
    complete: void;
  }>();

  let container: HTMLDivElement;
  let instance: Count | null = null;

  $: {
    if (instance) {
      instance.updateConfig({
        targetValue,
        duration,
        startValue,
        enabled,
        easing,
        threshold,
        rootMargin,
        triggerOnce,
        onUpdate: (value) => {
          dispatch('update', value);
        },
        onComplete: () => {
          dispatch('complete');
        },
      });
    }
  }

  onMount(() => {
    if (!container) return;

    const options: CountOptions = {
      targetValue,
      duration,
      startValue,
      enabled,
      easing,
      threshold,
      rootMargin,
      triggerOnce,
      onUpdate: (value) => {
        dispatch('update', value);
      },
      onComplete: () => {
        dispatch('complete');
      },
    };

    instance = new Count(container, options);
  });

  onDestroy(() => {
    if (instance) {
      instance.destroy();
      instance = null;
    }
  });

  export function start() {
    if (instance) {
      instance.start();
    }
  }

  export function stop() {
    if (instance) {
      instance.stop();
    }
  }

  export function reset() {
    if (instance) {
      instance.reset();
    }
  }

  export function getValue(): number {
    if (instance) {
      return instance.getValue();
    }
    return 0;
  }

  export function updateConfig(config: Partial<CountOptions>) {
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

