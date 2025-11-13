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

// 텍스트와 함께 다른 속성도 변경
effect.morph({
  text: 'New Text',
  particleColor: '#ff00ff',
  maxParticles: 3000,
});

// 파티클을 초기 위치로 돌아가기
effect.scatter();
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

**⚠️ 주의**: React 컴포넌트 사용 시 컨테이너에 명시적인 크기를 지정해야 합니다. 자세한 내용은 [React 문제 해결 가이드](./REACT_TROUBLESHOOTING.md)를 참고하세요.

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

### 옵션

| 옵션 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `text` | `string` | `'mason effect'` | 표시할 텍스트 |
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

#### `morph(textOrOptions?: string | Partial<MasonEffectOptions>)`
텍스트 형태로 파티클을 모핑합니다.

**문자열 사용:**
```javascript
effect.morph('New Text');
```

**객체 사용 (텍스트와 함께 다른 속성도 변경):**
```javascript
effect.morph({
  text: 'New Text',
  particleColor: '#ff00ff',
  maxParticles: 3000,
  pointSize: 1.0,
  ease: 0.08,
});
```

#### `scatter()`
파티클을 초기 위치로 돌아가게 합니다. 각 파티클이 처음 생성되었을 때의 위치로 복귀합니다.

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
- 💾 프로덕션 빌드 시 자동 난독화 및 최적화
- 🔄 초기 위치로 복귀하는 scatter 효과

## 개발

```bash
# 의존성 설치
npm install

# 개발 모드 (watch)
npm run dev

# 빌드 (프로덕션용 min 파일 생성)
npm run build

# 예제 테스트 서버
npm run serve
```

## 빌드 결과물

빌드를 실행하면 다음 파일들이 생성됩니다:

- **개발용**: `dist/index.js`, `dist/index.esm.js` (소스맵 포함)
- **프로덕션용**: `dist/index.min.js`, `dist/index.esm.min.js` (난독화 및 최적화)
- **React 컴포넌트**: `dist/react/MasonEffect.min.js` (난독화)

npm으로 설치하면 자동으로 min 파일이 사용됩니다. 자세한 내용은 [빌드 가이드](./BUILD.md)를 참고하세요.

## 라이선스

MIT
