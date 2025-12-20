# MasonEffect ![npm](https://img.shields.io/npm/dy/masoneffect)

**Release version 2.0.11**

A collection of animation effects library. Supports React, Vue, Svelte, and vanilla JavaScript with **Tree-shaking** support.

> 🤖 **For AI Agents**: If you are an AI agent (Cursor, GitHub Copilot, ChatGPT, etc.) setting up this package, please read **[llms.txt](./llms.txt)** first for automatic environment detection and configuration.

## ✨ Features

- 🎯 **Tree-shaking Support**: Import only the effects you need
- 🎨 **Multiple Effects**: Various animation effects in one package
- 🔧 **Framework Agnostic**: Works with React, Vue, Svelte, and vanilla JS
- 📦 **TypeScript**: Full TypeScript support
- ⚡ **Optimized**: Automatic code splitting and optimization

## 📦 Installation

```bash
npm install masoneffect
```

### 🤖 AI Agent Guide

**⚠️ IMPORTANT FOR AI AGENTS**: Before using this package, read **[llms.txt](./llms.txt)** (primary AI guide) for:
- Automatic environment detection (framework, TypeScript, build tool)
- Framework-specific setup guides
- Effect recommendation logic based on user requests
- Complete code templates for all frameworks
- Tree-shaking optimization rules

This guide is optimized for AI agents to automatically configure MasonEffect correctly in any project.

## 🎯 Available Effects

### 1. TextToParticle
Converts text into animated particles with morphing effects.

### 2. Count
Animated number counting with intersection observer support.

### 3. Typing
Typing animation effect with Korean character decomposition.

### 4. ScrollFadeIn
Scroll-triggered fade-in animation effect with IntersectionObserver and Page Visibility API support.

---

## 🚀 Quick Start

### Tree-shaking (Recommended)

Import only the effects you need:

```typescript
// ✅ Recommended: Import only what you need
import { TextToParticle } from 'masoneffect/textToParticle';
import { Count } from 'masoneffect/count';
```

### Legacy Import (Backward Compatible)

```typescript
// ⚠️ Not recommended: Imports all effects
import { TextToParticle, Count } from 'masoneffect';
```

---

## 📖 Usage

### TextToParticle Effect

#### Vanilla JavaScript

```javascript
import { TextToParticle } from 'masoneffect/textToParticle';

const container = document.getElementById('my-container');
const effect = new TextToParticle(container, {
  text: 'Hello World',
  particleColor: '#00ff88',
  maxParticles: 2000,
});

// Change text
effect.morph({ text: 'New Text' });

// Multi-line text support
effect.morph({ text: 'Line 1\nLine 2\nLine 3' });

// Return particles to initial position
effect.scatter();
```

#### React

```tsx
import React, { useRef } from 'react';
import TextToParticle from 'masoneffect/react/textToParticle';
import type { TextToParticleRef } from 'masoneffect/react/textToParticle';

function App() {
  const effectRef = useRef<TextToParticleRef>(null);

  return (
    <div style={{ width: '100%', height: '70vh', background: '#000' }}>
      <TextToParticle
        ref={effectRef}
        text="Hello React"
        particleColor="#00ff88"
        maxParticles={2000}
        onReady={(instance) => {
          console.log('Ready!', instance);
        }}
      />
      <button onClick={() => effectRef.current?.morph({ text: 'Morphed!' })}>
        Morph
      </button>
    </div>
  );
}
```

#### Vue 3

```vue
<script setup>
import TextToParticle from 'masoneffect/vue/textToParticle';

const effectRef = ref(null);
</script>

<template>
  <div style="width: 100%; height: 70vh; background: #000">
    <TextToParticle
      ref="effectRef"
      text="Hello Vue"
      particle-color="#00ff88"
      :max-particles="2000"
    />
    <button @click="effectRef?.morph({ text: 'Morphed!' })">Morph</button>
  </div>
</template>
```

#### Svelte

```svelte
<script lang="ts">
  import TextToParticle from 'masoneffect/svelte/textToParticle';

  let effectRef: TextToParticle | null = null;
</script>

<div style="width: 100%; height: 70vh; background: #000">
  <TextToParticle
    bind:this={effectRef}
    text="Hello Svelte"
    particleColor="#00ff88"
    maxParticles={2000}
  />
  <button on:click={() => effectRef?.morph({ text: 'Morphed!' })}>
    Morph
  </button>
</div>
```

---

### Count Effect

#### Vanilla JavaScript

```javascript
import { Count, easingFunctions } from 'masoneffect/count';

const container = document.getElementById('count-container');
const count = new Count(container, {
  targetValue: 1000,
  duration: 2000,
  startValue: 0,
  easing: easingFunctions.easeOutCubic,
  onUpdate: (value) => {
    console.log(value);
  },
  onComplete: () => {
    console.log('Complete!');
  }
});

// Start animation
count.start();

// Reset
count.reset();
```

#### React

```tsx
import React, { useRef } from 'react';
import Count from 'masoneffect/react/count';
import { easingFunctions } from 'masoneffect/react/count';
import type { CountRef } from 'masoneffect/react/count';

function App() {
  const countRef = useRef<CountRef>(null);

  return (
    <div>
      <Count
        ref={countRef}
        targetValue={1000}
        duration={2000}
        easing={easingFunctions.easeOutCubic}
        onUpdate={(value) => console.log(value)}
        onComplete={() => console.log('Complete!')}
        style={{ fontSize: '3rem', fontWeight: 'bold' }}
      />
      <button onClick={() => countRef.current?.reset()}>Reset</button>
      <button onClick={() => countRef.current?.start()}>Start</button>
    </div>
  );
}
```

#### Vue 3

```vue
<script setup>
import Count from 'masoneffect/vue/count';
import { easingFunctions } from 'masoneffect/vue/count';
</script>

<template>
  <div>
    <Count
      :target-value="1000"
      :duration="2000"
      :easing="easingFunctions.easeOutCubic"
      @update="(value) => console.log(value)"
      @complete="() => console.log('Complete!')"
      style="font-size: 3rem; font-weight: bold"
    />
  </div>
</template>
```

#### Svelte

```svelte
<script lang="ts">
  import Count from 'masoneffect/svelte/count';
  import { easingFunctions } from 'masoneffect/svelte/count';
</script>

<div>
  <Count
    targetValue={1000}
    duration={2000}
    easing={easingFunctions.easeOutCubic}
    on:update={(e) => console.log(e.detail)}
    on:complete={() => console.log('Complete!')}
    style="font-size: 3rem; font-weight: bold"
  />
</div>
```

### ScrollFadeIn Effect

#### Vanilla JavaScript

```javascript
import { ScrollFadeIn } from 'masoneffect/scrollFadeIn';

const container = document.querySelector('#scroll-fade-in-container');
// For viewport-based scrolling (default)
const scrollFadeIn = new ScrollFadeIn(container, {
  direction: 'bottom',
  distance: '50px',
  duration: 800,
  threshold: 0.1,
  rootMargin: '0px',
  triggerOnce: false,
  onStart: () => console.log('Animation started'),
  onComplete: () => console.log('Animation completed'),
});

// For internal scroll container
const scrollContainer = document.querySelector('.scroll-container');
const scrollFadeInInContainer = new ScrollFadeIn(container, {
  direction: 'bottom',
  distance: '50px',
  root: scrollContainer, // Specify scroll container element
  threshold: 0.1,
});

// Methods
scrollFadeIn.start();
scrollFadeIn.stop();
scrollFadeIn.reset();
scrollFadeIn.updateConfig({ distance: '100px' });
scrollFadeIn.destroy();
```

#### React

```tsx
import React, { useRef } from 'react';
import { ScrollFadeIn } from 'masoneffect/react/scrollFadeIn';
import type { ScrollFadeInRef } from 'masoneffect/react/scrollFadeIn';

function App() {
  const scrollFadeInRef = useRef<ScrollFadeInRef>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      {/* For viewport-based scrolling (default) */}
      <ScrollFadeIn
        ref={scrollFadeInRef}
        direction="bottom"
        distance="50px"
        duration={800}
        threshold={0.1}
        onStart={() => console.log('Started')}
        onComplete={() => console.log('Completed')}
        style={{ padding: '20px' }}
      >
        <div>Content that fades in on scroll</div>
      </ScrollFadeIn>
      
      {/* For internal scroll container */}
      <div ref={scrollContainerRef} style={{ height: '400px', overflow: 'auto' }}>
        <ScrollFadeIn root={scrollContainerRef.current} direction="bottom" distance="50px">
          <div>Content that fades in when scrolled within container</div>
        </ScrollFadeIn>
      </div>
      
      <button onClick={() => scrollFadeInRef.current?.reset()}>Reset</button>
    </div>
  );
}
```

#### Vue 3

```vue
<script setup>
import { ScrollFadeIn } from 'masoneffect/vue/scrollFadeIn';
</script>

<template>
  <ScrollFadeIn
    direction="bottom"
    distance="50px"
    :duration="800"
    :threshold="0.1"
    @start="() => console.log('Started')"
    @complete="() => console.log('Completed')"
    style="padding: 20px"
  >
    <div>Content that fades in on scroll</div>
  </ScrollFadeIn>
</template>
```

#### Svelte

```svelte
<script lang="ts">
  import { ScrollFadeIn } from 'masoneffect/svelte/scrollFadeIn';
</script>

<ScrollFadeIn
  direction="bottom"
  distance="50px"
  duration={800}
  threshold={0.1}
  on:start={() => console.log('Started')}
  on:complete={() => console.log('Completed')}
  style="padding: 20px"
>
  <div>Content that fades in on scroll</div>
</ScrollFadeIn>
```

---

## 📚 API Reference

### TextToParticle

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `text` | `string` | `'mason effect'` | Text to display (use `\n` for line breaks) |
| `densityStep` | `number` | `2` | Particle sampling density (smaller = denser) |
| `maxParticles` | `number` | `3200` | Maximum number of particles |
| `pointSize` | `number` | `0.5` | Particle point size |
| `ease` | `number` | `0.05` | Movement acceleration |
| `repelRadius` | `number` | `150` | Mouse repel radius |
| `repelStrength` | `number` | `1` | Mouse repel strength |
| `particleColor` | `string` | `'#fff'` | Particle color |
| `fontFamily` | `string` | `'Inter, system-ui, Arial'` | Font family |
| `fontSize` | `number \| null` | `null` | Font size (auto-adjusts if null) |
| `width` | `number \| null` | `null` | Canvas width (container size if null) |
| `height` | `number \| null` | `null` | Canvas height (container size if null) |
| `devicePixelRatio` | `number \| null` | `null` | Device pixel ratio (auto if null) |
| `debounceDelay` | `number` | `150` | Debounce delay in milliseconds |
| `onReady` | `function` | `null` | Initialization complete callback |
| `onUpdate` | `function` | `null` | Update callback |

#### Methods

- `morph(textOrOptions?: string | Partial<TextToParticleOptions>)` - Morph particles into text
- `scatter()` - Return particles to initial position
- `updateConfig(config: Partial<TextToParticleOptions>)` - Update configuration
- `destroy()` - Destroy instance and cleanup

---

### Count

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `targetValue` | `number` | **required** | Target number to count to |
| `duration` | `number` | `2000` | Animation duration in milliseconds |
| `startValue` | `number` | `0` | Starting number |
| `enabled` | `boolean` | `true` | Enable/disable animation |
| `easing` | `function` | `linear` | Easing function |
| `threshold` | `number` | `0.2` | IntersectionObserver threshold |
| `rootMargin` | `string` | `'0px 0px -100px 0px'` | IntersectionObserver rootMargin |
| `triggerOnce` | `boolean` | `false` | Trigger animation only once |
| `onUpdate` | `function` | `null` | Update callback (receives current value) |
| `onComplete` | `function` | `null` | Animation complete callback |

#### Methods

- `start()` - Start animation
- `stop()` - Stop animation
- `reset()` - Reset to start value
- `getValue()` - Get current value
- `updateConfig(config: Partial<CountOptions>)` - Update configuration
- `destroy()` - Destroy instance and cleanup

#### Easing Functions

```typescript
import { easingFunctions } from 'masoneffect/count';

// Available easing functions:
easingFunctions.linear
easingFunctions.easeInQuad
easingFunctions.easeOutQuad
easingFunctions.easeInOutQuad
easingFunctions.easeOutCubic
```

### ScrollFadeIn

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `direction` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'` | Animation direction |
| `distance` | `string` | `'50px'` | Animation distance (supports px, rem, em, %, vh, vw) |
| `duration` | `number` | `800` | Animation duration in milliseconds |
| `threshold` | `number` | `0.1` | IntersectionObserver threshold |
| `rootMargin` | `string` | `'0px'` | IntersectionObserver rootMargin |
| `root` | `HTMLElement \| null` | `null` | IntersectionObserver root element (for internal scroll containers) |
| `triggerOnce` | `boolean` | `false` | Trigger animation only once |
| `enabled` | `boolean` | `true` | Enable/disable animation |
| `onStart` | `function` | `null` | Animation start callback |
| `onComplete` | `function` | `null` | Animation complete callback |

#### Methods

- `start()` - Start animation
- `stop()` - Stop animation
- `reset()` - Reset to initial position
- `updateConfig(config: Partial<ScrollFadeInOptions>)` - Update configuration
- `destroy()` - Destroy instance and cleanup

---

## 🌳 Tree-shaking

MasonEffect supports Tree-shaking, allowing you to import only the effects you need:

```typescript
// ✅ Recommended: Only imports Count (smaller bundle)
import { Count } from 'masoneffect/count';

// ❌ Not recommended: Imports all effects (larger bundle)
import { Count } from 'masoneffect';
```

### Framework-specific imports

```typescript
// React
import Count from 'masoneffect/react/count';
import TextToParticle from 'masoneffect/react/textToParticle';

// Vue
import Count from 'masoneffect/vue/count';
import TextToParticle from 'masoneffect/vue/textToParticle';

// Svelte
import Count from 'masoneffect/svelte/count';
import TextToParticle from 'masoneffect/svelte/textToParticle';
```

---

## 🔄 Backward Compatibility

For backward compatibility, the old API still works:

```typescript
// Old API (still works)
import { MasonEffect } from 'masoneffect';
import MasonEffect from 'masoneffect/react';

// MasonEffect is an alias for TextToParticle
const effect = new MasonEffect(container, { text: 'Hello' });
```

However, we recommend using the new Tree-shaking-friendly imports for better performance.

---

## 🎨 Features

### TextToParticle
- 🎨 Morphing effect that converts text into particles
- 🖱️ Mouse interaction support (repel/attract)
- 📱 Responsive design
- ⚡ High-performance Canvas rendering
- 👁️ IntersectionObserver: Automatically pauses when not visible
- ⏱️ Debouncing: Prevents excessive calls
- 📝 Multi-line text support
- 🔤 Auto font size adjustment

### Count
- 🔢 Animated number counting
- 👁️ IntersectionObserver: Starts when element is visible
- 🎯 Multiple easing functions
- ⚡ Smooth animations with requestAnimationFrame
- 🔄 Reset and restart support

### Typing
- ⌨️ Typing animation effect
- 🇰🇷 Korean character decomposition (jamo support)
- 👁️ IntersectionObserver: Starts when element is visible
- ⚡ Smooth character-by-character animation
- 🎨 Customizable cursor and speed

### Slide
- 🎬 Slide-in animation effect
- 📐 Direction control (top, right, bottom, left)
- 📏 Flexible distance units (px, rem, em, %, vh, vw)
- 👁️ IntersectionObserver: Starts when element is visible
- 🎯 Multiple easing functions
- ⚡ Smooth animations with requestAnimationFrame
- 🔄 Reset and restart support

---

## 🛠️ Development

```bash
# Install dependencies
npm install

# Development mode (watch)
npm run dev

# Build (generate production files)
npm run build

# Example test server
npm run serve
```

---

## 📦 CDN Usage (UMD)

```html
<script src="https://cdn.jsdelivr.net/npm/masoneffect@2.0.11/dist/index.umd.min.js"></script>
<script>
  // TextToParticle (MasonEffect alias for backward compatibility)
  const container = document.getElementById('my-container');
  const effect = new MasonEffect(container, {
    text: 'Hello World',
    particleColor: '#00ff88',
  });
</script>
```

**Note**: CDN version includes all effects. For Tree-shaking, use npm package.

---

## 📄 License

MIT

---

## 🔗 Links

- [GitHub Repository](https://github.com/fe-hyunsu/masoneffect)
- [Homepage](https://masoneffect.com)
- [Issues](https://github.com/fe-hyunsu/masoneffect/issues)
