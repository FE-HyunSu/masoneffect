# MasonEffect

파티클 모핑 효과를 제공하는 라이브러리입니다. React, Vue, 그리고 바닐라 JavaScript에서 사용할 수 있습니다.

## 설치

```bash
npm install masoneffect
```

## 사용법

### 바닐라 JavaScript

```javascript
import { MasonEffect } from 'masoneffect';

const container = document.getElementById('my-container');
const effect = new MasonEffect(container, {
  text: 'Hello World',
  particleColor: '#00ff88',
  maxParticles: 2000,
});

// 텍스트 변경
effect.morph('New Text');

// 파티클 흩어지기
effect.scatter();
```

### React

```jsx
import React, { useRef } from 'react';
import MasonEffect from 'masoneffect/react';

function App() {
  const effectRef = useRef(null);

  return (
    <div style={{ width: '100%', height: '70vh' }}>
      <MasonEffect
        ref={effectRef}
        text="Hello React"
        particleColor="#00ff88"
        maxParticles={2000}
        onReady={(instance) => {
          console.log('Ready!', instance);
        }}
      />
      <button onClick={() => effectRef.current?.morph('New Text')}>
        Morph
      </button>
      <button onClick={() => effectRef.current?.scatter()}>
        Scatter
      </button>
    </div>
  );
}
```

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

const handleScatter = () => {
  effectRef.value?.scatter();
};

const onReady = (instance) => {
  console.log('Ready!', instance);
};
</script>
```

## API

### 옵션

| 옵션 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `text` | `string` | `'mason crawler'` | 표시할 텍스트 |
| `densityStep` | `number` | `2` | 파티클 샘플링 밀도 (작을수록 촘촘함) |
| `maxParticles` | `number` | `3200` | 최대 파티클 수 |
| `pointSize` | `number` | `0.5` | 파티클 점 크기 |
| `ease` | `number` | `0.05` | 이동 가속도 |
| `repelRadius` | `number` | `150` | 마우스 반발 범위 |
| `repelStrength` | `number` | `1` | 마우스 반발 세기 |
| `particleColor` | `string` | `'#fff'` | 파티클 색상 |
| `fontFamily` | `string` | `'Inter, system-ui, Arial'` | 폰트 패밀리 |
| `fontSize` | `number \| null` | `null` | 폰트 크기 (null이면 자동) |
| `width` | `number \| null` | `null` | 캔버스 너비 (null이면 컨테이너 크기) |
| `height` | `number \| null` | `null` | 캔버스 높이 (null이면 컨테이너 크기) |
| `devicePixelRatio` | `number \| null` | `null` | 디바이스 픽셀 비율 (null이면 자동) |
| `onReady` | `function` | `null` | 초기화 완료 콜백 |
| `onUpdate` | `function` | `null` | 업데이트 콜백 |

### 메서드

#### `morph(text?: string)`
텍스트 형태로 파티클을 모핑합니다. 텍스트를 전달하면 해당 텍스트로 변경됩니다.

#### `scatter()`
파티클을 무작위로 흩어지게 합니다.

#### `updateConfig(config: Partial<MasonEffectOptions>)`
설정을 업데이트합니다.

#### `destroy()`
인스턴스를 파괴하고 리소스를 정리합니다.

## 특징

- 🎨 텍스트를 파티클로 변환하는 모핑 효과
- 🖱️ 마우스 인터랙션 지원 (반발/흡입)
- 📱 반응형 디자인
- ⚡ 고성능 Canvas 렌더링
- 🔧 React, Vue, 바닐라 JS 모두 지원
- 🎯 TypeScript 타입 정의 포함

## 개발

```bash
# 의존성 설치
npm install

# 개발 모드
npm run dev

# 빌드
npm run build
```

## 라이선스

MIT
