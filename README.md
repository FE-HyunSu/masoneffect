# MasonEffect ![npm](https://img.shields.io/npm/dy/masoneffect)

**Release version 2.0.18**

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

1. **TextToParticle** - Converts text into animated particles with morphing effects
2. **Count** - Animated number counting with intersection observer support
3. **Typing** - Typing animation effect with Korean character decomposition
4. **ScrollFadeIn** - Scroll-triggered fade-in animation effect
5. **TextSpin** - Text animation that splits text into characters and reveals them randomly with a spin effect

---

## 🚀 Quick Start

### Tree-shaking (Recommended)

```typescript
// ✅ Recommended: Import only what you need
import { TextToParticle } from 'masoneffect/textToParticle';
import { Count } from 'masoneffect/count';
```

### Framework-specific imports

```typescript
// React
import TextToParticle from 'masoneffect/react/textToParticle';
import Count from 'masoneffect/react/count';

// Vue
import TextToParticle from 'masoneffect/vue/textToParticle';
import Count from 'masoneffect/vue/count';

// Svelte
import TextToParticle from 'masoneffect/svelte/textToParticle';
import Count from 'masoneffect/svelte/count';
```

---

## 📖 Usage Examples

### TextToParticle

#### Vanilla JavaScript

```javascript
import { TextToParticle } from 'masoneffect/textToParticle';

const container = document.getElementById('my-container');
const effect = new TextToParticle(container, {
  text: 'Hello World',
  particleColor: '#00ff88',
  maxParticles: 2000,
});

effect.morph({ text: 'New Text' });
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
      />
      <button onClick={() => effectRef.current?.morph({ text: 'Morphed!' })}>
        Morph
      </button>
    </div>
  );
}
```

### Count

#### Vanilla JavaScript

```javascript
import { Count, easingFunctions } from 'masoneffect/count';

const container = document.getElementById('count-container');
const count = new Count(container, {
  targetValue: 1000,
  duration: 2000,
  easing: easingFunctions.easeOutCubic,
});

count.start();
```

#### React

```tsx
import React from 'react';
import Count from 'masoneffect/react/count';
import { easingFunctions } from 'masoneffect/react/count';

function App() {
  return (
    <Count
      targetValue={1000}
      duration={2000}
      easing={easingFunctions.easeOutCubic}
      style={{ fontSize: '3rem', fontWeight: 'bold' }}
    />
  );
}
```

### ScrollFadeIn

#### Vanilla JavaScript

```javascript
import { ScrollFadeIn } from 'masoneffect/scrollFadeIn';

const container = document.querySelector('#scroll-fade-in-container');
const scrollFadeIn = new ScrollFadeIn(container, {
  direction: 'bottom',
  distance: '50px',
  duration: 800,
});

// For internal scroll container
const scrollContainer = document.querySelector('.scroll-container');
const scrollFadeInInContainer = new ScrollFadeIn(container, {
  direction: 'bottom',
  distance: '50px',
  root: scrollContainer, // Specify scroll container element
});
```

#### React

```tsx
import React from 'react';
import { ScrollFadeIn } from 'masoneffect/react/scrollFadeIn';

function App() {
  return (
    <ScrollFadeIn direction="bottom" distance="50px" duration={800}>
      <div>Content that fades in on scroll</div>
    </ScrollFadeIn>
  );
}
```

### TextSpin

#### Vanilla JavaScript

```javascript
import { TextSpin } from 'masoneffect/textSpin';

const container = document.querySelector('#text-spin-container');
const textSpin = new TextSpin(container, {
  text: 'Hello World',
  delay: 0.2,
  duration: 0.6,
  randomDelay: 2,
});

textSpin.updateText('New Text');
```

#### React

```tsx
import React from 'react';
import { TextSpin } from 'masoneffect/react/textSpin';

function App() {
  return (
    <TextSpin
      text="Hello World"
      delay={0.2}
      duration={0.6}
      randomDelay={2}
      style={{ fontSize: '2rem', color: '#fff' }}
    />
  );
}
```

> 💡 **Note**: For Vue and Svelte examples, see [llms.txt](./llms.txt) or check the framework-specific import paths above.

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

// Available: linear, easeInQuad, easeOutQuad, easeInOutQuad, easeOutCubic
easingFunctions.easeOutCubic
```

---

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

### TextSpin

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `text` | `string` | **required** | Text to animate |
| `delay` | `number` | `0.2` | Base delay in seconds before animation starts |
| `duration` | `number` | `0.6` | Animation duration in seconds for each character |
| `randomDelay` | `number` | `2` | Random delay range in seconds (0 to randomDelay) |
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
- `reset()` - Reset animation state
- `updateText(text: string)` - Update text and restart animation
- `updateConfig(config: Partial<TextSpinOptions>)` - Update configuration
- `destroy()` - Destroy instance and cleanup

**Note**: TextSpin inherits parent styles by default. The container element will maintain the parent's font size, color, and other text styles.

---

## 🌳 Tree-shaking

MasonEffect supports Tree-shaking, allowing you to import only the effects you need:

```typescript
// ✅ Recommended: Only imports Count (smaller bundle)
import { Count } from 'masoneffect/count';

// ❌ Not recommended: Imports all effects (larger bundle)
import { Count } from 'masoneffect';
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
<script src="https://cdn.jsdelivr.net/npm/masoneffect@2.0.18/dist/index.umd.min.js"></script>
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
