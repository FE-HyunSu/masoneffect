# MasonEffect 라이브러리 개발기

## 📋 목차
1. [개요](#개요)
2. [핵심 로직](#핵심-로직)
3. [주요 기능](#주요-기능)
4. [기술적 구현](#기술적-구현)
5. [프레임워크 통합](#프레임워크-통합)

---

## 개요

MasonEffect는 텍스트를 파티클로 변환하여 모핑 효과를 만드는 라이브러리입니다. Canvas API를 활용하여 고성능 애니메이션을 구현했습니다.

### 주요 특징
- 🎨 텍스트를 파티클로 변환하는 모핑 효과
- 🖱️ 마우스 인터랙션 (반발/흡입)
- 📱 반응형 디자인
- ⚡ 고성능 Canvas 렌더링
- 🔧 React, Vue, 바닐라 JS 지원

---

## 핵심 로직

### 1. 전체 아키텍처

```
┌─────────────────────────────────────────┐
│         MasonEffect 클래스              │
├─────────────────────────────────────────┤
│  • Canvas 초기화 및 리사이즈 관리        │
│  • 파티클 생성 및 관리                   │
│  • 애니메이션 루프                       │
│  • 이벤트 처리 (마우스, 리사이즈)        │
└─────────────────────────────────────────┘
         │
         ├─── React 래퍼
         ├─── Vue 래퍼
         └─── 바닐라 JS
```

### 2. 초기화 과정

```javascript
1. 컨테이너 요소 확인
2. Canvas 생성 및 컨테이너에 추가
3. 오프스크린 Canvas 생성 (텍스트 렌더링용)
4. 설정값 초기화
5. 리사이즈 및 파티클 초기화
6. 애니메이션 루프 시작
```

### 3. 파티클 구조

```javascript
{
  x, y:      현재 위치
  vx, vy:    속도
  tx, ty:    목표 위치
  initialX, initialY: 초기 위치 (scatter 시 사용)
  j:         진동 위상 (생동감 부여)
}
```

---

## 주요 기능

### 1. 텍스트 → 파티클 변환 (buildTargets)

**과정:**
1. 오프스크린 Canvas에 텍스트 렌더링
2. 픽셀 데이터 추출 (ImageData)
3. 밝은 픽셀만 샘플링하여 좌표 배열 생성
4. 파티클 수 제한 (maxParticles)
5. 각 파티클에 목표 좌표 할당

**핵심 코드:**
```javascript
// 픽셀 샘플링
for (let y = 0; y < this.H; y += step) {
  for (let x = 0; x < this.W; x += step) {
    const i = (y * this.W + x) * 4;
    if (img[i] + img[i+1] + img[i+2] > 600) {
      targets.push({ x, y });
    }
  }
}
```

### 2. 파티클 애니메이션 (update)

**물리 시뮬레이션:**
- **목표로 당기는 힘**: `(tx - x) * ease`
- **마우스 반발/흡입**: 거리 기반 힘 계산
- **진동 효과**: `cos/sin` 함수로 미세한 움직임
- **속도 업데이트**: 가속도 기반

**핵심 코드:**
```javascript
// 목표로 당기는 힘
let ax = (p.tx - p.x) * this.config.ease;
let ay = (p.ty - p.y) * this.config.ease;

// 마우스 반발/흡입
if (mouse.x || mouse.y) {
  const dx = p.x - mouse.x;
  const dy = p.y - mouse.y;
  const d2 = dx*dx + dy*dy;
  const r = this.config.repelRadius * this.DPR;
  if (d2 < r*r) {
    const d = Math.sqrt(d2) + 0.0001;
    const f = (mouse.down ? -1 : 1) * this.config.repelStrength * (1 - d/r);
    ax += (dx/d) * f * 6.0;
    ay += (dy/d) * f * 6.0;
  }
}

// 속도와 위치 업데이트
p.vx = (p.vx + ax) * Math.random();
p.vy = (p.vy + ay) * Math.random();
p.x += p.vx;
p.y += p.vy;
```

### 3. Morph (텍스트 모핑)

**동작:**
1. 텍스트 변경 (문자열 또는 객체)
2. `buildTargets()` 호출하여 새로운 목표 좌표 생성
3. 파티클이 새로운 텍스트 형태로 이동

**특징:**
- 문자열만 전달: 텍스트만 변경
- 객체 전달: 텍스트와 함께 다른 속성도 변경 가능
- null/undefined: 현재 텍스트로 재빌드

### 4. Scatter (초기 위치 복귀)

**동작:**
1. 각 파티클의 `initialX`, `initialY` 확인
2. 목표 좌표를 초기 위치로 설정
3. 파티클이 초기 위치로 이동

**초기 위치 저장:**
- `makeParticle()`: 파티클 생성 시 초기 위치 저장
- `initParticles()`: 초기화 시 초기 위치 저장

---

## 기술적 구현

### 1. 고해상도 대응

```javascript
// Device Pixel Ratio 고려
this.DPR = Math.min(window.devicePixelRatio || 1, 1.8);
this.W = Math.floor(width * this.DPR);
this.H = Math.floor(height * this.DPR);

// Canvas 크기와 스타일 크기 분리
canvas.width = W;   // 실제 픽셀 크기
canvas.height = H;
canvas.style.width = width + 'px';   // 화면 표시 크기
canvas.style.height = height + 'px';
```

### 2. 성능 최적화

- **픽셀 샘플링**: `densityStep`으로 샘플링 간격 조절
- **파티클 수 제한**: `maxParticles`로 최대 개수 제한
- **랜덤 감속**: `Math.random()`을 곱하여 자연스러운 감속
- **requestAnimationFrame**: 브라우저 최적화된 애니메이션 루프

### 3. 반응형 처리

```javascript
// ResizeObserver로 컨테이너 크기 변경 감지
const resizeObserver = new ResizeObserver(() => {
  instance.resize();
});
resizeObserver.observe(container);
```

### 4. 마우스 인터랙션

- **반발**: 마우스 이동 시 파티클이 멀어짐
- **흡입**: 마우스 클릭 시 파티클이 가까워짐
- **거리 기반 힘**: 가까울수록 강한 힘 적용

---

## 프레임워크 통합

### React 통합

**주요 고려사항:**
1. 컴포넌트 마운트 시 컨테이너 크기가 0일 수 있음
2. `requestAnimationFrame`으로 초기화 지연
3. `ResizeObserver`로 크기 변경 감지
4. `useImperativeHandle`로 메서드 노출

**핵심 코드:**
```typescript
useEffect(() => {
  const initEffect = () => {
    const rect = container.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      requestAnimationFrame(initEffect);
      return;
    }
    instanceRef.current = new MasonEffect(container, options);
  };
  requestAnimationFrame(initEffect);
}, []);
```

### Vue 통합

**주요 고려사항:**
1. `setup()` 함수에서 인스턴스 관리
2. `expose()`로 메서드 노출
3. `watch()`로 props 변경 감지
4. `onBeforeUnmount()`에서 정리

### 바닐라 JS

**직접 사용:**
```javascript
const effect = new MasonEffect(container, options);
effect.morph('New Text');
effect.scatter();
```

---

## 빌드 및 배포

### 빌드 전략

1. **코어 라이브러리**: CJS, ESM, UMD 형식으로 빌드
2. **React 컴포넌트**: 별도 빌드 (React 외부 의존성)
3. **Vue 컴포넌트**: 소스 파일 그대로 제공 (Vue 프로젝트에서 컴파일)

### 난독화

- **Terser 플러그인**: 변수명/함수명 난독화
- **3회 압축 패스**: 더 강력한 최적화
- **Unsafe 최적화**: 성능 향상
- **소스맵 제거**: 프로덕션 빌드에서 제거

---

## 핵심 알고리즘

### 1. 텍스트 픽셀 샘플링

**목적**: 텍스트를 파티클의 목표 좌표로 변환

**과정:**
1. 오프스크린 Canvas에 텍스트 렌더링
2. `getImageData()`로 픽셀 데이터 추출
3. 밝은 픽셀만 필터링 (RGB 합 > 600)
4. `densityStep` 간격으로 샘플링

```javascript
// 픽셀 데이터에서 밝은 픽셀만 추출
const img = offCtx.getImageData(0, 0, W, H).data;
for (let y = 0; y < H; y += step) {
  for (let x = 0; x < W; x += step) {
    const i = (y * W + x) * 4;
    // RGB 합이 600 이상이면 밝은 픽셀
    if (img[i] + img[i+1] + img[i+2] > 600) {
      targets.push({ x, y });
    }
  }
}
```

**최적화:**
- `densityStep`: 샘플링 간격 조절 (작을수록 촘촘함)
- `maxParticles`: 최대 파티클 수 제한

### 2. 물리 시뮬레이션

**목적**: 자연스러운 파티클 움직임 구현

**힘의 합성:**
1. **목표로 당기는 힘** (기본)
2. **마우스 반발/흡입 힘** (인터랙션)
3. **진동 효과** (생동감)

```javascript
// 1. 목표로 당기는 힘 (기본)
let ax = (p.tx - p.x) * ease;
let ay = (p.ty - p.y) * ease;

// 2. 마우스 힘 추가
if (mouse.x || mouse.y) {
  const dx = p.x - mouse.x;
  const dy = p.y - mouse.y;
  const distance = Math.sqrt(dx*dx + dy*dy);
  const force = repelStrength * (1 - distance / repelRadius);
  ax += (dx / distance) * force * 6.0;
  ay += (dy / distance) * force * 6.0;
}

// 3. 진동 효과 추가
ax += Math.cos(phase) * 0.05;
ay += Math.sin(phase * 1.3) * 0.05;

// 4. 속도와 위치 업데이트
vx = (vx + ax) * random();  // 랜덤 감속
vy = (vy + ay) * random();
x += vx;
y += vy;
```

**특징:**
- `ease`: 목표로 당기는 힘의 세기 (0.05 = 부드러움)
- `Math.random()` 곱하기: 자연스러운 감속 효과
- 진동 위상(`j`): 각 파티클마다 다른 위상으로 생동감 부여

### 3. 마우스 힘 계산

**거리 기반 힘 공식:**
```javascript
distance = sqrt((px - mx)² + (py - my)²)
force = strength * (1 - distance / radius)
```

**동작:**
- `distance < radius`: 힘 적용
- `distance = 0`: 최대 힘
- `distance = radius`: 힘 0
- `mouse.down`: 음수 힘 (흡입)
- `mouse.move`: 양수 힘 (반발)

---

## 성능 최적화 기법

### 1. 오프스크린 Canvas 활용
텍스트 렌더링을 메인 Canvas와 분리하여 성능 향상
```javascript
// 오프스크린 Canvas에 텍스트 렌더링
offCanvas.width = W;
offCanvas.height = H;
offCtx.fillText(text, x, y);

// 픽셀 데이터만 추출
const img = offCtx.getImageData(0, 0, W, H).data;
```

### 2. 픽셀 샘플링 최적화
`densityStep`으로 샘플링 간격 조절
- `densityStep = 1`: 모든 픽셀 (느림, 고품질)
- `densityStep = 2`: 2픽셀마다 (기본값, 균형)
- `densityStep = 4`: 4픽셀마다 (빠름, 저품질)

### 3. 파티클 수 제한
`maxParticles`로 최대 개수 제한하여 성능 보장
```javascript
while (targets.length > maxParticles) {
  targets.splice(Math.floor(Math.random() * targets.length), 1);
}
```

### 4. 랜덤 감속
`Math.random()`을 곱하여 자연스러운 감속과 성능의 균형
```javascript
p.vx = (p.vx + ax) * Math.random();  // 0~1 사이 랜덤 감속
```

### 5. DPR 제한
고해상도 디바이스에서도 성능 유지
```javascript
DPR = Math.min(devicePixelRatio, 1.8);  // 최대 1.8로 제한
```

### 6. requestAnimationFrame
브라우저 최적화된 애니메이션 루프 사용
```javascript
function animate() {
  update();
  requestAnimationFrame(animate);
}
```

---

## 배운 점

### 1. Canvas API 활용
- 오프스크린 Canvas로 텍스트 렌더링 분리
- `getImageData()`로 픽셀 데이터 추출
- DPR 고려한 고해상도 대응

### 2. 물리 시뮬레이션
- 간단한 힘 기반 물리로 자연스러운 움직임
- 여러 힘의 합성으로 복잡한 동작 구현
- 랜덤 요소로 자연스러운 감속

### 3. 프레임워크 통합
- React: `useImperativeHandle`, `ResizeObserver` 활용
- Vue: `expose()`, `watch()` 활용
- 각 프레임워크의 생명주기에 맞춘 초기화

### 4. 성능 최적화
- 샘플링 간격 조절로 성능과 품질의 균형
- 파티클 수 제한으로 성능 보장
- DPR 제한으로 고해상도 디바이스 대응

### 5. 타입 안정성
- TypeScript로 타입 정의 제공
- 인터페이스로 API 명확화
- IDE 자동완성 지원

### 6. 빌드 및 배포
- Rollup으로 다양한 형식 빌드 (CJS, ESM, UMD)
- 난독화 및 최적화 자동화
- npm 패키지 배포 준비

---

## 데이터 플로우

### 초기화 플로우
```
사용자 입력 (container, options)
    ↓
MasonEffect 생성
    ↓
Canvas 생성 및 추가
    ↓
resize() 호출
    ↓
buildTargets() → 텍스트 → 픽셀 → 좌표 배열
    ↓
initParticles() → 파티클 생성 및 초기 위치 저장
    ↓
애니메이션 루프 시작
```

### 애니메이션 플로우
```
requestAnimationFrame
    ↓
update()
    ↓
각 파티클에 대해:
  - 목표로 당기는 힘 계산
  - 마우스 힘 계산 (있는 경우)
  - 진동 효과 추가
  - 속도 및 위치 업데이트
    ↓
파티클 그리기
    ↓
다음 프레임 예약
```

### Morph 플로우
```
morph(textOrOptions) 호출
    ↓
텍스트/설정 업데이트
    ↓
buildTargets() → 새로운 목표 좌표 생성
    ↓
파티클이 새로운 목표로 이동
```

### Scatter 플로우
```
scatter() 호출
    ↓
각 파티클의 initialX, initialY 확인
    ↓
목표 좌표를 초기 위치로 설정
    ↓
파티클이 초기 위치로 이동
```

---

## 코드 구조

### 클래스 구조
```javascript
class MasonEffect {
  // 초기화
  constructor(container, options)
  init()
  resize()
  
  // 파티클 관리
  makeParticle()
  initParticles()
  buildTargets()
  
  // 애니메이션
  update()
  animate()
  start()
  stop()
  
  // 인터랙션
  morph(textOrOptions)
  scatter()
  updateConfig(config)
  
  // 이벤트
  setupEventListeners()
  handleMouseMove()
  handleResize()
  
  // 정리
  destroy()
}
```

---

## 향후 개선 방향

- [ ] 파티클 간 연결선 그리기 옵션
- [ ] 다양한 모핑 패턴 (이미지, SVG 등)
- [ ] 파티클 색상 그라데이션
- [ ] 성능 모니터링 도구
- [ ] 더 많은 인터랙션 옵션
- [ ] 터치 이벤트 지원
- [ ] 파티클 크기 애니메이션

