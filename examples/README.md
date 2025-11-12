# 예제 실행 방법

## CORS 문제 해결

브라우저에서 ES 모듈을 직접 로드할 때는 CORS 정책 때문에 로컬 파일을 직접 열 수 없습니다. 다음 방법 중 하나를 사용하세요.

## 방법 1: 개발 서버 사용 (권장)

```bash
# 프로젝트 루트에서 실행
npm run serve

# 또는
npm run dev:example
```

그 다음 브라우저에서 `http://localhost:8080/examples/vanilla.html` 접속

## 방법 2: 빌드된 파일 사용

```bash
# 먼저 빌드
npm run build

# 그 다음 vanilla-build.html 사용
# 로컬 서버 없이도 작동합니다 (빌드된 파일은 상대 경로로 로드 가능)
```

## 방법 3: 다른 HTTP 서버 사용

### Python
```bash
# Python 3
python -m http.server 8080

# Python 2
python -m SimpleHTTPServer 8080
```

### Node.js (http-server)
```bash
npx http-server . -p 8080 --cors
```

### VS Code Live Server
VS Code의 Live Server 확장을 사용할 수도 있습니다.

## 파일 설명

- `vanilla.html` - 소스 파일을 직접 사용 (개발 서버 필요)
- `vanilla-build.html` - 빌드된 파일 사용 (빌드 후 사용)
- `react-example.jsx` - React 사용 예제
- `vue-example.vue` - Vue 사용 예제

