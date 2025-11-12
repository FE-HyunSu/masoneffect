# 빠른 시작 가이드

## 1. 프로젝트 설정

먼저 의존성을 설치하세요:

```bash
npm install
```

## 2. 개발 모드

개발 중에는 watch 모드로 빌드할 수 있습니다:

```bash
npm run dev
```

## 3. 빌드

배포용 빌드:

```bash
npm run build
```

## 4. 다음 단계

### 바닐라 JS에서 테스트

**방법 1: 개발 서버 사용 (권장)**
```bash
npm run serve
# 브라우저에서 http://localhost:8080/examples/vanilla.html 접속
```

**방법 2: 빌드된 파일 사용**
```bash
npm run build
# examples/vanilla-build.html 파일 사용 (로컬 서버 없이도 작동)
```

⚠️ **주의**: `vanilla.html`은 소스 파일을 직접 import하므로 로컬 서버가 필요합니다. 브라우저에서 직접 열면 CORS 에러가 발생합니다.

### React에서 테스트

React 프로젝트에서:

```bash
npm install masoneffect
```

그리고 `examples/react-example.jsx`를 참고하세요.

### Vue에서 테스트

Vue 프로젝트에서:

```bash
npm install masoneffect
```

그리고 `examples/vue-example.vue`를 참고하세요.

## 5. npm 배포 전 체크리스트

- [ ] `package.json`의 버전 번호 확인
- [ ] `README.md` 확인 및 업데이트
- [ ] `npm run build` 실행하여 빌드 확인
- [ ] `npm test` (테스트가 있다면)
- [ ] `npm publish --dry-run` 으로 배포 전 확인

