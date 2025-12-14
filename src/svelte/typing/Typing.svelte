<script lang="ts">
import { onMount, onDestroy } from 'svelte';
import { Typing } from '../../core/typing/index.js';
import type { TypingOptions } from '../../core/typing/index.js';

export interface TypingRef {
  start: () => void;
  stop: () => void;
  reset: () => void;
  setText: (text: string) => void;
  destroy: () => void;
}

interface Props {
  text: string;
  speed?: number;
  delay?: number;
  enabled?: boolean;
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  showCursor?: boolean;
  cursorChar?: string;
  className?: string;
  style?: string;
  onUpdate?: (text: string) => void;
  onComplete?: () => void;
}

let {
  text,
  speed = 50,
  delay = 0,
  enabled = true,
  threshold = 0.2,
  rootMargin = '0px 0px -100px 0px',
  triggerOnce = false,
  showCursor = true,
  cursorChar = '|',
  className = '',
  style = '',
  onUpdate,
  onComplete,
}: Props = $props();

let containerRef: HTMLDivElement | null = null;
let instanceRef: Typing | null = null;

onMount(() => {
  if (!containerRef) return;

  const options: TypingOptions = {
    text,
    speed,
    delay,
    enabled,
    threshold,
    rootMargin,
    triggerOnce,
    showCursor,
    cursorChar,
    onUpdate,
    onComplete,
  };

  instanceRef = new Typing(containerRef, options);
});

onDestroy(() => {
  if (instanceRef) {
    instanceRef.destroy();
    instanceRef = null;
  }
});

// text 변경 감지
$effect(() => {
  if (instanceRef && text !== instanceRef['originalText']) {
    instanceRef.setText(text);
  }
});

// ref를 통해 메서드 노출
export function start() {
  instanceRef?.start();
}

export function stop() {
  instanceRef?.stop();
}

export function reset() {
  instanceRef?.reset();
}

export function setText(newText: string) {
  instanceRef?.setText(newText);
}

export function destroy() {
  if (instanceRef) {
    instanceRef.destroy();
    instanceRef = null;
  }
}
</script>

<div bind:this={containerRef} class={className} style={style}></div>

