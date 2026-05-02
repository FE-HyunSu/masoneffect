# MasonEffect의 주요 장점

## 1. 🌳 Tree Shaking 지원

필요한 효과만 선택적으로 import하여 번들 크기를 최소화합니다.

```typescript
// ✅ 사용하는 효과만 번들에 포함
import { TextToParticle } from 'masoneffect/textToParticle';
import { Count } from 'masoneffect/count';

// ❌ 사용하지 않는 효과는 자동으로 제거됨
```

- **개별 export 경로**: 각 효과가 독립적인 경로로 제공되어 번들러가 정확히 필요한 코드만 포함
- **자동 최적화**: Webpack, Vite, Rollup 등 모든 모던 번들러에서 자동으로 미사용 코드 제거
- **작은 번들 크기**: 전체 패키지를 설치해도 실제 사용하는 효과만 번들에 포함

---

## 2. ⚡ 렌더링 최적화

성능을 고려한 최적화된 렌더링 로직을 제공합니다.

- **IntersectionObserver 활용**: 요소가 뷰포트에 보일 때만 애니메이션 실행
- **Page Visibility API**: 브라우저 탭이 숨겨지면 자동으로 애니메이션 일시정지
- **requestAnimationFrame**: 부드러운 60fps 애니메이션 보장
- **ResizeObserver**: 컨테이너 크기 변경 시 자동 리사이징
- **Debouncing**: 리사이즈, 업데이트 등 빈번한 이벤트 최적화

---

## 3. 📦 의존성 없는 패키지

프레임워크 의존성 없이 순수 JavaScript로 구현된 핵심 로직.

- **Zero Runtime Dependencies**: 외부 라이브러리 의존성 없음
- **경량 패키지**: 불필요한 의존성으로 인한 번들 크기 증가 방지
- **안정성**: 의존성 업데이트로 인한 breaking change 걱정 없음
- **빠른 설치**: npm install 시간 단축

---

## 4. 🔧 범용 호환성

React, Vue, Svelte, Vanilla JavaScript 모든 환경에서 동일한 API로 사용 가능.

```typescript
// React
import TextToParticle from 'masoneffect/react/textToParticle';

// Vue
import TextToParticle from 'masoneffect/vue/textToParticle';

// Svelte
import TextToParticle from 'masoneffect/svelte/textToParticle';

// Vanilla JS
import { TextToParticle } from 'masoneffect/textToParticle';
```

- **프레임워크별 래퍼 제공**: 각 프레임워크의 관례에 맞는 컴포넌트 제공
- **일관된 API**: 프레임워크를 바꿔도 동일한 옵션과 메서드 사용
- **타입 안정성**: TypeScript로 모든 프레임워크에서 완전한 타입 지원
- **유연한 마이그레이션**: 프로젝트 프레임워크 변경 시 코드 수정 최소화

---

## 5. 🤖 AI 기반 지원

AI 에이전트를 위한 자동 환경 감지 및 설정 가이드 제공.

- **llms.txt 가이드**: AI 에이전트가 자동으로 환경을 감지하고 올바른 설정 적용
- **context7.json 메타데이터**: 구조화된 프로젝트 정보(효과별 키워드, 사용 사례, import 경로)로 AI 에이전트의 정확한 이해 및 추천 지원
- **자동 프레임워크 감지**: package.json을 분석하여 React/Vue/Svelte 자동 인식
- **효과 추천 로직**: 사용자 요청 키워드 기반으로 적절한 효과 자동 추천
- **코드 템플릿**: 프레임워크별 완성된 코드 템플릿 제공
- **원클릭 통합**: AI 에이전트가 자동으로 필요한 코드 생성 및 통합

---

## 요약

MasonEffect는 **최소한의 번들 크기**, **최적화된 성능**, **안정적인 의존성**, **넓은 호환성**, 그리고 **AI 친화적인 개발 경험**을 제공하는 현대적인 애니메이션 라이브러리입니다.

