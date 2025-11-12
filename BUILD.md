# 빌드 가이드

## 빌드 결과물

빌드를 실행하면 다음 파일들이 생성됩니다:

### 코어 라이브러리
- `dist/index.js` - 개발용 (CJS, 소스맵 포함)
- `dist/index.esm.js` - 개발용 (ESM, 소스맵 포함)
- `dist/index.umd.js` - 개발용 (UMD, 소스맵 포함)
- **`dist/index.min.js`** - 프로덕션용 (CJS, 난독화)
- **`dist/index.esm.min.js`** - 프로덕션용 (ESM, 난독화) ⭐ 기본 제공
- **`dist/index.umd.min.js`** - 프로덕션용 (UMD, 난독화)
- `dist/index.d.ts` - TypeScript 타입 정의

### React 컴포넌트
- `dist/react/MasonEffect.js` - 개발용 (ESM, 소스맵 포함)
- `dist/react/MasonEffect.cjs` - 개발용 (CJS, 소스맵 포함)
- **`dist/react/MasonEffect.min.js`** - 프로덕션용 (ESM, 난독화) ⭐ 기본 제공
- **`dist/react/MasonEffect.min.cjs`** - 프로덕션용 (CJS, 난독화) ⭐ 기본 제공
- `dist/react/MasonEffect.d.ts` - TypeScript 타입 정의

## 난독화 옵션

프로덕션 빌드(min 파일)에는 다음 난독화 옵션이 적용됩니다:

- ✅ 변수명/함수명 난독화 (최상위 레벨 포함)
- ✅ 클래스명 난독화
- ✅ 공백/줄바꿈 제거
- ✅ 주석 제거
- ✅ 3회 압축 패스 (더 강력한 최적화)
- ✅ Unsafe 최적화 옵션 활성화
- ✅ 소스맵 제거

## 파일 크기 비교

- 개발용: ~9KB
- 프로덕션용 (min): ~5.7KB (약 37% 감소)

## 사용 방법

npm으로 설치하면 자동으로 min 파일이 사용됩니다:

```javascript
// 자동으로 min 파일 로드
import { MasonEffect } from 'masoneffect';
```

개발용 파일이 필요한 경우 직접 경로를 지정할 수 있습니다:

```javascript
// 개발용 파일 사용
import { MasonEffect } from 'masoneffect/dist/index.esm.js';
```

