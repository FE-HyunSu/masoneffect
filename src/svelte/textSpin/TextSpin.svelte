<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { TextSpin } from '../../core/textSpin/index';
  import type { TextSpinOptions } from '../../core/textSpin/index';

  export let text: string = '';
  export let delay: number = 0.2;
  export let duration: number = 0.6;
  export let randomDelay: number = 2;
  export let threshold: number = 0.1;
  export let rootMargin: string = '0px';
  export let root: HTMLElement | null = null;
  export let triggerOnce: boolean = false;
  export let enabled: boolean = true;
  export let className: string = '';
  export let style: Record<string, any> = {};
  export let onStart: (() => void) | null = null;
  export let onComplete: (() => void) | null = null;

  let container: HTMLDivElement;
  let instance: TextSpin | null = null;

  // Props 변경 감지 (Reactive statement)
  $: {
    if (instance) {
      instance.updateConfig({
        text,
        delay,
        duration,
        randomDelay,
        threshold,
        rootMargin,
        root,
        triggerOnce,
        enabled,
        onStart: onStart || undefined,
        onComplete: onComplete || undefined,
      });
    }
  }

  onMount(() => {
    if (!container) return;

    const options: TextSpinOptions = {
      text,
      delay,
      duration,
      randomDelay,
      threshold,
      rootMargin,
      root,
      triggerOnce,
      enabled,
      onStart: onStart || undefined,
      onComplete: onComplete || undefined,
    };

    instance = new TextSpin(container, options);
  });

  onDestroy(() => {
    if (instance) {
      instance.destroy();
      instance = null;
    }
  });

  // 외부에서 사용할 수 있는 메서드 노출
  export function start() {
    if (instance) instance.start();
  }

  export function stop() {
    if (instance) instance.stop();
  }

  export function reset() {
    if (instance) instance.reset();
  }

  export function updateText(newText: string) {
    if (instance) instance.updateText(newText);
  }

  export function updateConfig(config: Partial<TextSpinOptions>) {
    if (instance) instance.updateConfig(config);
  }

  export function destroy() {
    if (instance) {
      instance.destroy();
      instance = null;
    }
  }
</script>

<div bind:this={container} class={className} style={style}></div>

