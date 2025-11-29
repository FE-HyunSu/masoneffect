# MasonEffect ![npm](https://img.shields.io/npm/dy/masoneffect)

**Release version 1.0.27**

A library that provides particle morphing effects. It can be used with React, Vue, and vanilla JavaScript.

## Installation

```bash
npm install masoneffect
```

## Usage

### Vanilla JavaScript

#### Using npm (ES modules)

```javascript
import { MasonEffect } from 'masoneffect';

const container = document.getElementById('my-container');
const effect = new MasonEffect(container, {
  text: 'Hello World',
  particleColor: '#00ff88',
  maxParticles: 2000,
});

// Change text
effect.morph({ text: 'New Text' });

// Multi-line text support (use \n for line breaks)
effect.morph({ text: 'Line 1\nLine 2\nLine 3' });

// Change text along with other properties
effect.morph({
  text: 'New Text',
  particleColor: '#ff00ff',
  maxParticles: 3000,
  pointSize: 1.0,
});

// Return particles to initial position
effect.scatter();
```

#### Using CDN (UMD)

```html
<script src="https://cdn.jsdelivr.net/npm/masoneffect@1.0.27/dist/index.umd.min.js"></script>
<script>
  const container = document.getElementById('my-container');
  const effect = new MasonEffect(container, {
    text: 'Hello World',
    particleColor: '#00ff88',
    maxParticles: 2000,
    onReady: (instance) => {
      console.log('MasonEffect ready!', instance);
    }
  });

  // Change text
  effect.morph({ text: 'Morphed!' });

  // Multi-line text support
  effect.morph({ text: 'Line 1\nLine 2\nLine 3' });

  // Return particles to initial position
  effect.scatter();

  // Change text with random selection
  const texts = ['Hello', 'World', 'Mason', 'Effect', 'Particles'];
  const randomText = texts[Math.floor(Math.random() * texts.length)];
  effect.morph({ text: randomText });
</script>
```

### React

```tsx
import React, { useRef } from 'react';
import MasonEffect from 'masoneffect/react';
import type { MasonEffectRef } from 'masoneffect/react';

function App() {
  const effectRef = useRef<MasonEffectRef>(null);

  const handleMorph = () => {
    // Change text
    effectRef.current?.morph({ text: 'Morphed!' });
  };

  const handleScatter = () => {
    // Return particles to initial position
    effectRef.current?.scatter();
  };

  const handleChangeText = () => {
    const texts = ['Hello', 'World', 'Mason', 'Effect', 'Particles', 'Line 1\nLine 2'];
    const randomText = texts[Math.floor(Math.random() * texts.length)];
    effectRef.current?.morph({ text: randomText });
  };

  const handleChangeWithOptions = () => {
    // Change text along with other properties
    effectRef.current?.morph({
      text: 'New Text',
      particleColor: '#ff00ff',
      maxParticles: 3000,
      pointSize: 1.0,
    });
  };

  return (
    <div style={{ width: '100%', height: '70vh', background: '#000', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, position: 'relative', minHeight: 400 }}>
        <MasonEffect
          ref={effectRef}
          text="Hello React"
          particleColor="#00ff88"
          maxParticles={2000}
          onReady={(instance) => {
            console.log('Ready!', instance);
          }}
        />
        {/* Multi-line text example */}
        {/* <MasonEffect text="Line 1\nLine 2\nLine 3" /> */}
      </div>
      <div style={{ padding: '20px', display: 'flex', gap: '10px' }}>
        <button onClick={handleMorph}>Morph</button>
        <button onClick={handleScatter}>Scatter</button>
        <button onClick={handleChangeText}>Change Text</button>
        <button onClick={handleChangeWithOptions}>Change with Options</button>
      </div>
    </div>
  );
}

export default App;
```

**⚠️ Note**: When using the React component, you must specify an explicit size for the container. For more details, see the [React Troubleshooting Guide](./REACT_TROUBLESHOOTING.md).

### Vue 3

```vue
<script setup>
import { ref } from 'vue';
import MasonEffect from 'masoneffect/vue';

const effectRef = ref(null);

const handleMorph = () => {
  effectRef.value?.morph();
};

const handleScatter = () => {
  effectRef.value?.scatter();
};

const handleChangeText = () => {
  const texts = ['Hello', 'World', 'Mason', 'Effect', 'Line 1\nLine 2'];
  const randomText = texts[Math.floor(Math.random() * texts.length)];
  effectRef.value?.morph({ text: randomText });
};

const onReady = (instance) => {
  console.log('Ready!', instance);
};
</script>

<template>
  <div style="width: 100%; height: 70vh; background: #000">
    <MasonEffect
      ref="effectRef"
      text="Hello Vue"
      :particle-color="'#00ff88'"
      :max-particles="2000"
      @ready="onReady"
    />
    <!-- Multi-line text example -->
    <!-- <MasonEffect text="Line 1\nLine 2\nLine 3" /> -->
    <div style="padding: 20px; display: flex; gap: 10px">
      <button @click="handleMorph">Morph</button>
      <button @click="handleScatter">Scatter</button>
      <button @click="handleChangeText">Change Text</button>
    </div>
  </div>
</template>
```

### Svelte

```svelte
<script>
  import MasonEffect from 'masoneffect/svelte';
  import { createEventDispatcher } from 'svelte';

  let effectRef;

  const handleMorph = () => {
    effectRef?.morph({ text: 'Morphed!' });
  };

  const handleScatter = () => {
    effectRef?.scatter();
  };

  const handleChangeText = () => {
    const texts = ['Hello', 'World', 'Mason', 'Effect', 'Line 1\nLine 2'];
    const randomText = texts[Math.floor(Math.random() * texts.length)];
    effectRef?.morph({ text: randomText });
  };

  const onReady = (instance) => {
    console.log('Ready!', instance);
  };
</script>

<div style="width: 100%; height: 70vh; background: #000">
  <MasonEffect
    bind:this={effectRef}
    text="Hello Svelte"
    particleColor="#00ff88"
    maxParticles={2000}
    on:ready={onReady}
  />
  <div style="padding: 20px; display: flex; gap: 10px">
    <button on:click={handleMorph}>Morph</button>
    <button on:click={handleScatter}>Scatter</button>
    <button on:click={handleChangeText}>Change Text</button>
  </div>
</div>
```

**Note**: In Svelte, you can access component methods using `bind:this`. The component exposes `morph()`, `scatter()`, `updateConfig()`, and `destroy()` methods.

## API

### Options

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
| `fontSize` | `number \| null` | `null` | Font size (auto-adjusts to fit container if null, responsive to screen size) |
| `width` | `number \| null` | `null` | Canvas width (container size if null) |
| `height` | `number \| null` | `null` | Canvas height (container size if null) |
| `devicePixelRatio` | `number \| null` | `null` | Device pixel ratio (auto if null) |
| `debounceDelay` | `number` | `150` | Debounce delay in milliseconds for resize, morph, and updateConfig (set to 0 to disable) |
| `onReady` | `function` | `null` | Initialization complete callback |
| `onUpdate` | `function` | `null` | Update callback |

### Methods

#### `morph(textOrOptions?: string | Partial<MasonEffectOptions>)`
Morphs particles into text form. This method is debounced to prevent excessive calls (default: 150ms delay).

**Using string (legacy support):**
```javascript
effect.morph('New Text');
```

**Using object (recommended - change text along with other properties):**
```javascript
effect.morph({
  text: 'New Text',
  particleColor: '#ff00ff',
  maxParticles: 3000,
  pointSize: 1.0,
  ease: 0.08,
});
```

**Note**: Multiple rapid calls will be debounced, and only the last call will be executed after the delay period.

#### `scatter()`
Returns particles to their initial position. Each particle returns to the position where it was first created.

#### `updateConfig(config: Partial<MasonEffectOptions>)`
Updates the configuration. This method is debounced to prevent excessive calls (default: 150ms delay).

#### `destroy()`
Destroys the instance and cleans up resources.

## Features

- 🎨 Morphing effect that converts text into particles
- 🖱️ Mouse interaction support (repel/attract)
- 📱 Responsive design
- ⚡ High-performance Canvas rendering
- 🔧 Supports React, Vue, Svelte, and vanilla JS (including CDN)
- 🎯 Includes TypeScript type definitions
- 💾 Automatic obfuscation and optimization in production builds
- 🔄 Scatter effect that returns to initial position
- 👁️ **IntersectionObserver**: Automatically pauses animation when not visible (saves resources)
- ⏱️ **Debouncing**: Prevents excessive calls on resize, morph, and updateConfig methods
- 🎛️ **Configurable debounce delay**: Adjust or disable debouncing via `debounceDelay` option
- 📝 **Multi-line text support**: Use `\n` to create line breaks in text
- 🔤 **Auto font size adjustment**: Automatically adjusts font size to fit within the container (responsive to screen size)

## Development

```bash
# Install dependencies
npm install

# Development mode (watch)
npm run dev

# Build (generate production min files)
npm run build

# Example test server
npm run serve
```

## Build Output

Running the build will generate the following files:

- **Core library**: `dist/index.mjs` (ESM), `dist/index.cjs` (CommonJS), `dist/index.d.ts` (TypeScript types)
- **React component**: `dist/react/index.mjs`, `dist/react/index.cjs`, `dist/react/index.d.ts`
- **Vue component**: `dist/vue/index.mjs`, `dist/vue/index.cjs`, `dist/vue/index.d.ts`
- **Svelte component**: `dist/svelte/index.mjs`, `dist/svelte/index.cjs`, `dist/svelte/index.d.ts`
- **UMD build**: `dist/index.umd.min.js` (for CDN usage)

When installed via npm, the appropriate module format is automatically selected based on your bundler. The UMD files (`index.umd.min.js`) can be used directly in browsers via CDN or script tags.

## License

MIT
