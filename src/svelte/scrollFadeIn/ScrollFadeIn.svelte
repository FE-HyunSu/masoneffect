<script lang="ts">
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';
  import { ScrollFadeIn } from '../../core/scrollFadeIn/index';
  import type { ScrollFadeInOptions } from '../../core/scrollFadeIn/index';

  export let direction: 'top' | 'right' | 'bottom' | 'left' = 'bottom';
  export let distance: string = '50px';
  export let duration: number = 800;
  export let threshold: number = 0.1;
  export let rootMargin: string = '0px';
  export let root: HTMLElement | null = null;
  export let triggerOnce: boolean = false;
  export let enabled: boolean = true;
  export let className: string = '';
  export let style: Record<string, any> = {};

  const dispatch = createEventDispatcher<{
    start: void;
    complete: void;
  }>();

  let container: HTMLDivElement;
  let instance: ScrollFadeIn | null = null;

  $: {
    if (instance) {
      instance.updateConfig({
        direction,
        distance,
        duration,
        threshold,
        rootMargin,
        root,
        triggerOnce,
        enabled,
        onStart: () => {
          dispatch('start');
        },
        onComplete: () => {
          dispatch('complete');
        },
      });
    }
  }

  onMount(() => {
    if (!container) return;

    const options: ScrollFadeInOptions = {
      direction,
      distance,
      duration,
      threshold,
      rootMargin,
      root,
      triggerOnce,
      enabled,
      onStart: () => {
        dispatch('start');
      },
      onComplete: () => {
        dispatch('complete');
      },
    };

    instance = new ScrollFadeIn(container, options);
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

  export function updateConfig(config: Partial<ScrollFadeInOptions>) {
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

<div bind:this={container} class={className} style={style}>
  <slot />
</div>

