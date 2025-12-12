# AI Agent Setup Guide for MasonEffect

This document is optimized for AI agents (Cursor, GitHub Copilot, ChatGPT, Claude, etc.) to automatically detect environment and configure MasonEffect package correctly.

## Quick Reference

```json
{
  "package": "masoneffect",
  "install": "npm install masoneffect",
  "treeShaking": true,
  "frameworks": ["react", "vue", "svelte", "vanilla"],
  "typescript": true,
  "importPaths": {
    "react": "masoneffect/react/{effect}",
    "vue": "masoneffect/vue/{effect}",
    "svelte": "masoneffect/svelte/{effect}",
    "vanilla": "masoneffect/{effect}"
  },
  "effects": {
    "textToParticle": {
      "path": "{framework}/textToParticle",
      "keywords": ["text", "particle", "morph", "title", "banner", "hero"],
      "useCase": "Convert text to animated particles"
    },
    "count": {
      "path": "{framework}/count",
      "keywords": ["number", "count", "counter", "stat", "statistic", "animate number"],
      "useCase": "Animated number counting"
    }
  }
}
```

## Environment Detection

### Framework Detection

**Detection Logic:**
1. Check `package.json` dependencies
2. Priority order: react > vue > svelte > vanilla

```javascript
function detectFramework() {
  const pkg = require('./package.json');
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };
  
  if (deps.react || deps['react-dom']) return 'react';
  if (deps.vue) return 'vue';
  if (deps.svelte) return 'svelte';
  return 'vanilla';
}
```

**Detection Rules:**
- `react` or `react-dom` in dependencies → `react`
- `vue` in dependencies → `vue`
- `svelte` in dependencies → `svelte`
- None of above → `vanilla`

### TypeScript Detection

```javascript
function detectTypeScript() {
  const fs = require('fs');
  return fs.existsSync('./tsconfig.json') || 
         require('./package.json').devDependencies?.typescript;
}
```

**Detection Rules:**
- `tsconfig.json` exists → TypeScript
- `typescript` in devDependencies → TypeScript

### Build Tool Detection

```javascript
function detectBuildTool() {
  const fs = require('fs');
  const pkg = require('./package.json');
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };
  
  if (deps.next) return 'next';
  if (fs.existsSync('./vite.config.js') || fs.existsSync('./vite.config.ts') || deps.vite) return 'vite';
  if (fs.existsSync('./webpack.config.js') || deps.webpack) return 'webpack';
  return 'unknown';
}
```

## Effect Recommendation

### Keyword Matching

```javascript
function recommendEffect(userRequest) {
  const request = userRequest.toLowerCase();
  
  // TextToParticle keywords
  const textParticleKeywords = ['text', 'particle', 'morph', 'title', 'banner', 'hero', '글자', '텍스트', '파티클', '모핑'];
  if (textParticleKeywords.some(kw => request.includes(kw))) {
    return 'textToParticle';
  }
  
  // Count keywords
  const countKeywords = ['number', 'count', 'counter', 'stat', 'statistic', '숫자', '카운트', '통계'];
  if (countKeywords.some(kw => request.includes(kw))) {
    return 'count';
  }
  
  return 'textToParticle'; // default
}
```

### Use Cases

**TextToParticle:**
- Hero section titles
- Loading screens
- Banner text
- Interactive text effects
- Text morphing animations

**Count:**
- Statistics display
- Number counters
- Animated numbers
- Scroll-triggered counters
- Performance metrics

## Framework-Specific Setup

### React

**Detection:** `react` or `react-dom` in package.json

**Import Path:**
```typescript
// TextToParticle
import { TextToParticle } from 'masoneffect/react/textToParticle';
import type { TextToParticleRef } from 'masoneffect/react/textToParticle';

// Count
import { Count } from 'masoneffect/react/count';
import type { CountRef } from 'masoneffect/react/count';
```

**Template:**
```tsx
import React, { useRef } from 'react';
import { TextToParticle } from 'masoneffect/react/textToParticle';
import type { TextToParticleRef } from 'masoneffect/react/textToParticle';

function App() {
  const ref = useRef<TextToParticleRef>(null);
  
  return (
    <div style={{ width: '100%', height: '400px' }}>
      <TextToParticle
        ref={ref}
        text="Hello World"
        particleColor="#fff"
        fontSize={80}
      />
    </div>
  );
}
```

**Notes:**
- Use `useRef` for ref
- Props are camelCase
- TypeScript types available

### Vue 3

**Detection:** `vue` in package.json (version 3.x)

**Import Path:**
```typescript
// TextToParticle
import { TextToParticle } from 'masoneffect/vue/textToParticle';
import type { TextToParticleRef } from 'masoneffect/vue/textToParticle';

// Count
import { Count } from 'masoneffect/vue/count';
import type { CountRef } from 'masoneffect/vue/count';
```

**Template:**
```vue
<script setup lang="ts">
import { ref } from 'vue';
import { TextToParticle } from 'masoneffect/vue/textToParticle';
import type { TextToParticleRef } from 'masoneffect/vue/textToParticle';

const textRef = ref<TextToParticleRef | null>(null);
</script>

<template>
  <div style="width: 100%; height: 400px;">
    <TextToParticle
      ref="textRef"
      text="Hello World"
      particle-color="#fff"
      :font-size="80"
    />
  </div>
</template>
```

**Notes:**
- Use `ref()` for ref
- Props are kebab-case in template
- Use `<script setup lang="ts">` for TypeScript

### Svelte

**Detection:** `svelte` in package.json

**Import Path:**
```typescript
// TextToParticle
import { TextToParticle } from 'masoneffect/svelte/textToParticle';
import type { TextToParticleRef } from 'masoneffect/svelte/textToParticle';

// Count
import { Count } from 'masoneffect/svelte/count';
import type { CountRef } from 'masoneffect/svelte/count';
```

**Template:**
```svelte
<script lang="ts">
import { TextToParticle } from 'masoneffect/svelte/textToParticle';
import type { TextToParticleRef } from 'masoneffect/svelte/textToParticle';

let textRef: TextToParticleRef | null = null;
</script>

<div style="width: 100%; height: 400px;">
  <TextToParticle
    bind:this={textRef}
    text="Hello World"
    particleColor="#fff"
    fontSize={80}
  />
</div>
```

**Notes:**
- Use `bind:this={ref}` for ref binding
- Props are camelCase
- Use `<script lang="ts">` for TypeScript

### Vanilla JavaScript

**Detection:** No React, Vue, or Svelte in package.json

**Import Path:**
```javascript
// TextToParticle
import { TextToParticle } from 'masoneffect/textToParticle';

// Count
import { Count } from 'masoneffect/count';
```

**Template:**
```javascript
import { TextToParticle } from 'masoneffect/textToParticle';

const container = document.querySelector('#container');
const effect = new TextToParticle(container, {
  text: 'Hello World',
  particleColor: '#fff',
  fontSize: 80,
});

// Change text
effect.morph({ text: 'New Text' });

// Cleanup
effect.destroy();
```

**Notes:**
- Use `new` keyword for instantiation
- Pass DOM element as first argument
- Call `destroy()` for cleanup

## Complete Code Templates

### React + TypeScript + TextToParticle

```tsx
import React, { useRef } from 'react';
import { TextToParticle } from 'masoneffect/react/textToParticle';
import type { TextToParticleRef } from 'masoneffect/react/textToParticle';

function App() {
  const ref = useRef<TextToParticleRef>(null);
  
  const handleMorph = () => {
    ref.current?.morph({ text: 'Morphed!' });
  };
  
  return (
    <div style={{ width: '100%', height: '400px', background: '#000' }}>
      <TextToParticle
        ref={ref}
        text="Hello World"
        particleColor="#00ff88"
        fontSize={80}
        maxParticles={2000}
        onReady={(instance) => {
          console.log('Ready!', instance);
        }}
      />
      <button onClick={handleMorph}>Morph</button>
    </div>
  );
}
```

### React + TypeScript + Count

```tsx
import React, { useRef } from 'react';
import { Count } from 'masoneffect/react/count';
import type { CountRef } from 'masoneffect/react/count';
import { easingFunctions } from 'masoneffect/react/count';

function App() {
  const ref = useRef<CountRef>(null);
  
  return (
    <Count
      ref={ref}
      targetValue={1000}
      duration={2000}
      easing={easingFunctions.easeOutCubic}
    />
  );
}
```

### Vue 3 + Composition API + TextToParticle

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { TextToParticle } from 'masoneffect/vue/textToParticle';
import type { TextToParticleRef } from 'masoneffect/vue/textToParticle';

const textRef = ref<TextToParticleRef | null>(null);

function handleMorph() {
  textRef.value?.morph({ text: 'Morphed!' });
}
</script>

<template>
  <div style="width: 100%; height: 400px; background: #000;">
    <TextToParticle
      ref="textRef"
      text="Hello World"
      particle-color="#00ff88"
      :font-size="80"
      :max-particles="2000"
    />
    <button @click="handleMorph">Morph</button>
  </div>
</template>
```

### Vue 3 + Composition API + Count

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Count } from 'masoneffect/vue/count';
import type { CountRef } from 'masoneffect/vue/count';
import { easingFunctions } from 'masoneffect/vue/count';

const countRef = ref<CountRef | null>(null);
</script>

<template>
  <Count
    ref="countRef"
    :target-value="1000"
    :duration="2000"
    :easing="easingFunctions.easeOutCubic"
  />
</template>
```

### Svelte + TypeScript + TextToParticle

```svelte
<script lang="ts">
import { TextToParticle } from 'masoneffect/svelte/textToParticle';
import type { TextToParticleRef } from 'masoneffect/svelte/textToParticle';

let textRef: TextToParticleRef | null = null;

function handleMorph() {
  textRef?.morph({ text: 'Morphed!' });
}
</script>

<div style="width: 100%; height: 400px; background: #000;">
  <TextToParticle
    bind:this={textRef}
    text="Hello World"
    particleColor="#00ff88"
    fontSize={80}
    maxParticles={2000}
  />
  <button on:click={handleMorph}>Morph</button>
</div>
```

### Vanilla JS + TextToParticle

```javascript
import { TextToParticle } from 'masoneffect/textToParticle';

const container = document.querySelector('#container');
const effect = new TextToParticle(container, {
  text: 'Hello World',
  particleColor: '#00ff88',
  fontSize: 80,
  maxParticles: 2000,
  onReady: (instance) => {
    console.log('Ready!', instance);
  },
});

// Change text
effect.morph({ text: 'New Text' });

// Cleanup
effect.destroy();
```

### Vanilla JS + Count

```javascript
import { Count } from 'masoneffect/count';
import { easingFunctions } from 'masoneffect/count';

const container = document.querySelector('#count-container');
const count = new Count(container, {
  targetValue: 1000,
  duration: 2000,
  easing: easingFunctions.easeOutCubic,
  threshold: 0.5,
  triggerOnce: true,
  onComplete: () => {
    console.log('Count animation completed!');
  },
});
```

## AI Agent Checklist

### Pre-Installation
- [ ] Check if `package.json` exists
- [ ] Detect framework (react/vue/svelte/vanilla)
- [ ] Detect TypeScript usage
- [ ] Detect build tool (vite/webpack/next)

### Installation
- [ ] Use correct package manager (npm/yarn/pnpm)
- [ ] Install: `npm install masoneffect`
- [ ] Use direct import paths for tree-shaking

### Code Generation
- [ ] Use framework-specific import path
- [ ] Import TypeScript types if TypeScript project
- [ ] Use correct prop naming (camelCase for React/Svelte, kebab-case for Vue)
- [ ] Provide complete working example

## Critical Rules

### 1. Tree-Shaking: Always Use Direct Import Paths

❌ **Wrong** (imports all effects):
```typescript
import { TextToParticle, Count } from 'masoneffect';
```

✅ **Correct** (imports only needed effect):
```typescript
import { TextToParticle } from 'masoneffect/react/textToParticle';
import { Count } from 'masoneffect/react/count';
```

### 2. Framework-Specific Import Paths

```typescript
// React
import { TextToParticle } from 'masoneffect/react/textToParticle';

// Vue
import { TextToParticle } from 'masoneffect/vue/textToParticle';

// Svelte
import { TextToParticle } from 'masoneffect/svelte/textToParticle';

// Vanilla
import { TextToParticle } from 'masoneffect/textToParticle';
```

### 3. TypeScript Types

- ✅ Types are included in all import paths
- ✅ No need for `@types/masoneffect`
- ✅ Use `import type` for type-only imports

## Auto-Setup Function

```javascript
function autoSetupMasonEffect(userRequest) {
  // 1. Detect environment
  const framework = detectFramework();
  const typescript = detectTypeScript();
  const buildTool = detectBuildTool();
  
  // 2. Recommend effect
  const effect = recommendEffect(userRequest);
  
  // 3. Generate import path
  const importPath = framework === 'vanilla' 
    ? `masoneffect/${effect}`
    : `masoneffect/${framework}/${effect}`;
  
  // 4. Generate code
  const code = generateCode(framework, effect, typescript);
  
  return {
    framework,
    typescript,
    effect,
    importPath,
    code
  };
}
```

## Summary

When AI agent uses MasonEffect:

1. **Detect Environment**: Check package.json for framework, TypeScript, build tool
2. **Recommend Effect**: Analyze user request to recommend appropriate effect
3. **Generate Import**: Use framework-specific direct import path
4. **Generate Code**: Provide complete working example based on framework
5. **Optimize**: Use tree-shaking by importing only needed effects

Follow this guide to correctly configure and use MasonEffect in any project.
