# 🚀 빠른 배포 가이드

## 1단계: package.json 수정 (필수)

`package.json` 파일을 열어서 다음 항목들을 수정하세요:

```json
{
  "author": "Your Name <your.email@example.com>",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/masoneffect.git"
  },
  "homepage": "https://github.com/yourusername/masoneffect#readme",
  "bugs": {
    "url": "https://github.com/yourusername/masoneffect/issues"
  }
}
```

## 2단계: 패키지 이름 확인

```bash
# masoneffect 이름이 이미 사용 중인지 확인
npm view masoneffect

# 만약 이미 있다면 package.json의 "name"을 변경하세요
# 예: "masoneffect-particles" 또는 "@yourusername/masoneffect"
```

## 3단계: 배포 전 체크

```bash
# 빌드
npm run build

# 배포 전 체크 (자동으로 실행됨)
npm run precheck
```

## 4단계: npm 로그인

```bash
# npm 계정이 없다면 https://www.npmjs.com/signup 에서 생성
npm login
```

## 5단계: 테스트 배포

```bash
# 실제로 배포하지 않고 테스트
npm publish --dry-run
```

## 6단계: 실제 배포

```bash
# 배포 실행
npm publish
```

## 7단계: 확인

```bash
# 배포 확인
npm view masoneffect

# 설치 테스트
npm install masoneffect
```

---

## 📝 버전 업데이트

새 버전 배포:

```bash
npm version patch  # 0.1.0 -> 0.1.1
npm publish
```

---

## ⚠️ 중요 사항

1. **패키지 이름은 한 번 배포하면 변경 불가**
2. **배포된 버전은 삭제 불가** (24시간 내에만 unpublish 가능)
3. **버전 번호는 항상 올라가야 함**

자세한 내용은 `PUBLISH.md`를 참고하세요.

