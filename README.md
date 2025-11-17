# MasonEffect ![npm](https://img.shields.io/npm/dw/masoneffect)

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
effect.morph('New Text');

// Change text along with other properties
effect.morph({
  text: 'New Text',
  particleColor: '#ff00ff',
  maxParticles: 3000,
});

// Return particles to initial position
effect.scatter();
```

#### Using CDN (UMD)

```html
<script src="https://cdn.jsdelivr.net/npm/masoneffect@0.1.15/dist/index.umd.min.js"></script>
<script>
  const container = document.getElementById('my-container');
  const effect = new MasonEffect(container, {
    text: 'Hello World',
    particleColor: '#00ff88',
    maxParticles: 2000,
  });

  // Change text
  effect.morph({ text: 'New Text' });

  // Return particles to initial position
  effect.scatter();
</script>
```

### React

```jsx
import React, { useRef } from 'react';
import MasonEffect from 'masoneffect/react';

function App() {
  const effectRef = useRef(null);

  return (
    <div style={{ width: '100%', height: '70vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, position: 'relative' }}>
        <MasonEffect
          ref={effectRef}
          text="Hello React"
          particleColor="#00ff88"
          maxParticles={2000}
          onReady={(instance) => {
            console.log('Ready!', instance);
          }}
        />
      </div>
      <div style={{ padding: '20px', display: 'flex', gap: '10px' }}>
        <button onClick={() => effectRef.current?.morph('New Text')}>
          Morph
        </button>
        <button onClick={() => effectRef.current?.morph({
          text: 'Hello',
          particleColor: '#ff00ff',
          maxParticles: 3000
        })}>
          Morph with Options
        </button>
        <button onClick={() => effectRef.current?.scatter()}>
          Scatter
        </button>
      </div>
    </div>
  );
}
```

**⚠️ Note**: When using the React component, you must specify an explicit size for the container. For more details, see the [React Troubleshooting Guide](./REACT_TROUBLESHOOTING.md).

### Vue 3

```vue
<template>
  <div style="width: 100%; height: 70vh">
    <MasonEffect
      ref="effectRef"
      text="Hello Vue"
      particle-color="#00ff88"
      :max-particles="2000"
      @ready="onReady"
    />
    <button @click="handleMorph">Morph</button>
    <button @click="handleMorphWithOptions">Morph with Options</button>
    <button @click="handleScatter">Scatter</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import MasonEffect from 'masoneffect/vue';

const effectRef = ref(null);

const handleMorph = () => {
  effectRef.value?.morph('New Text');
};

const handleMorphWithOptions = () => {
  effectRef.value?.morph({
    text: 'Hello',
    particleColor: '#ff00ff',
    maxParticles: 3000,
  });
};

const handleScatter = () => {
  effectRef.value?.scatter();
};

const onReady = (instance) => {
  console.log('Ready!', instance);
};
</script>
```

## API

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `text` | `string` | `'mason effect'` | Text to display |
| `densityStep` | `number` | `2` | Particle sampling density (smaller = denser) |
| `maxParticles` | `number` | `3200` | Maximum number of particles |
| `pointSize` | `number` | `0.5` | Particle point size |
| `ease` | `number` | `0.05` | Movement acceleration |
| `repelRadius` | `number` | `150` | Mouse repel radius |
| `repelStrength` | `number` | `1` | Mouse repel strength |
| `particleColor` | `string` | `'#fff'` | Particle color |
| `fontFamily` | `string` | `'Inter, system-ui, Arial'` | Font family |
| `fontSize` | `number \| null` | `null` | Font size (auto if null) |
| `width` | `number \| null` | `null` | Canvas width (container size if null) |
| `height` | `number \| null` | `null` | Canvas height (container size if null) |
| `devicePixelRatio` | `number \| null` | `null` | Device pixel ratio (auto if null) |
| `debounceDelay` | `number` | `150` | Debounce delay in milliseconds for resize, morph, and updateConfig (set to 0 to disable) |
| `onReady` | `function` | `null` | Initialization complete callback |
| `onUpdate` | `function` | `null` | Update callback |

### Methods

#### `morph(textOrOptions?: string | Partial<MasonEffectOptions>)`
Morphs particles into text form. This method is debounced to prevent excessive calls (default: 150ms delay).

**Using string:**
```javascript
effect.morph('New Text');
```

**Using object (change text along with other properties):**
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
- 🔧 Supports React, Vue, and vanilla JS (including CDN)
- 🎯 Includes TypeScript type definitions
- 💾 Automatic obfuscation and optimization in production builds
- 🔄 Scatter effect that returns to initial position
- 👁️ **IntersectionObserver**: Automatically pauses animation when not visible (saves resources)
- ⏱️ **Debouncing**: Prevents excessive calls on resize, morph, and updateConfig methods
- 🎛️ **Configurable debounce delay**: Adjust or disable debouncing via `debounceDelay` option

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

- **Development**: `dist/index.js`, `dist/index.esm.js`, `dist/index.umd.js` (with source maps)
- **Production**: `dist/index.min.js`, `dist/index.esm.min.js`, `dist/index.umd.min.js` (obfuscated and optimized)
- **React component**: `dist/react/MasonEffect.min.js` (obfuscated)

When installed via npm, min files are automatically used. The UMD files (`index.umd.min.js`) can be used directly in browsers via CDN or script tags. For more details, see the [Build Guide](./BUILD.md).

## License

MIT
