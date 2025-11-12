# React 사용 시 문제 해결

## 문제: MasonEffect가 표시되지 않음

### 원인
React 컴포넌트가 마운트될 때 컨테이너의 크기가 0이거나 아직 렌더링되지 않아서 발생할 수 있습니다.

### 해결 방법

#### 1. 컨테이너에 명시적인 크기 지정 (권장)

```jsx
<div style={{ width: '100%', height: '500px' }}>
  <MasonEffect text="Hello" />
</div>
```

또는

```jsx
<div style={{ width: '100%', height: '70vh' }}>
  <MasonEffect text="Hello" />
</div>
```

#### 2. height prop 사용

```jsx
<MasonEffect 
  text="Hello" 
  height={500}  // 명시적으로 높이 지정
/>
```

#### 3. style prop으로 크기 지정

```jsx
<MasonEffect 
  text="Hello"
  style={{ width: '100%', height: '500px' }}
/>
```

### 자동 해결 기능

최신 버전에서는 다음 기능이 자동으로 적용됩니다:

- ✅ 컨테이너 크기가 0이면 자동으로 대기 후 재시도
- ✅ ResizeObserver로 컨테이너 크기 변경 감지
- ✅ 기본 스타일 적용 (width: 100%, height: 100%, minHeight: 400px)

### 완전한 예제

```jsx
import React, { useRef } from 'react';
import MasonEffect from 'masoneffect/react';

function App() {
  const effectRef = useRef(null);

  return (
    <div style={{ 
      width: '100%', 
      height: '70vh', 
      background: '#000',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* 컨테이너에 명시적인 크기 지정 */}
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
    </div>
  );
}

export default App;
```

### 디버깅

브라우저 콘솔에서 다음을 확인하세요:

```javascript
// onReady 콜백이 호출되는지 확인
<MasonEffect 
  onReady={(instance) => {
    console.log('MasonEffect 초기화 완료:', instance);
    console.log('캔버스 크기:', instance.canvas.width, instance.canvas.height);
  }}
/>
```

만약 `onReady`가 호출되지 않는다면, 컨테이너 크기 문제일 가능성이 높습니다.

