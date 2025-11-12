# npm 패키지 배포 가이드

## 📋 배포 전 체크리스트

### 1. package.json 확인 및 수정

다음 항목들을 확인하고 수정하세요:

```json
{
  "name": "masoneffect",  // ✅ 패키지 이름 확인 (npm에 이미 있으면 변경 필요)
  "version": "0.1.0",     // ✅ 버전 번호 확인
  "author": "Your Name <your.email@example.com>",  // ⚠️ 수정 필요
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/masoneffect.git"  // ⚠️ 수정 필요
  },
  "homepage": "https://github.com/yourusername/masoneffect#readme",  // ⚠️ 수정 필요
  "bugs": {
    "url": "https://github.com/yourusername/masoneffect/issues"  // ⚠️ 수정 필요
  }
}
```

### 2. 패키지 이름 중복 확인

```bash
# npm에서 패키지 이름이 이미 사용 중인지 확인
npm view masoneffect

# 만약 이미 존재한다면 package.json의 "name"을 변경하세요
# 예: "masoneffect-particles", "@yourusername/masoneffect" 등
```

### 3. 빌드 테스트

```bash
# 빌드 실행
npm run build

# dist 폴더가 제대로 생성되었는지 확인
ls -la dist/
```

### 4. 배포할 파일 확인

`.npmignore` 파일에 따라 다음 파일들이 배포됩니다:
- `dist/` 폴더
- `src/` 폴더
- `README.md`
- `LICENSE`
- `package.json`

## 🚀 배포 절차

### 1단계: npm 계정 준비

```bash
# npm 로그인 (처음이면 계정 생성 필요)
npm login

# 로그인 확인
npm whoami
```

### 2단계: 배포 전 테스트 (dry-run)

```bash
# 실제로 배포하지 않고 어떤 파일이 포함될지 확인
npm publish --dry-run

# 또는
npm pack

# 생성된 .tgz 파일을 확인해보세요
```

### 3단계: 버전 관리

```bash
# Git에 커밋 (선택사항이지만 권장)
git add .
git commit -m "Prepare for npm publish v0.1.0"
git tag v0.1.0
git push origin main --tags
```

### 4단계: 배포 실행

```bash
# 공개 배포
npm publish

# 또는 스코프 패키지로 배포하려면
# npm publish --access public
```

### 5단계: 배포 확인

```bash
# 배포된 패키지 확인
npm view masoneffect

# 설치 테스트
npm install masoneffect
```

## 📦 버전 업데이트

새 버전을 배포할 때:

```bash
# 패치 버전 (0.1.0 -> 0.1.1)
npm version patch

# 마이너 버전 (0.1.0 -> 0.2.0)
npm version minor

# 메이저 버전 (0.1.0 -> 1.0.0)
npm version major

# 자동으로 버전이 올라가고 git tag도 생성됩니다
# 그 다음 배포
npm publish
```

## 🔒 스코프 패키지로 배포하기

만약 패키지 이름이 중복된다면 스코프를 사용할 수 있습니다:

```json
{
  "name": "@yourusername/masoneffect"
}
```

배포 시:
```bash
npm publish --access public
```

## ⚠️ 주의사항

1. **패키지 이름은 한 번 배포하면 변경할 수 없습니다**
2. **배포된 버전은 삭제할 수 없습니다** (24시간 내에만 unpublish 가능)
3. **버전 번호는 항상 올라가야 합니다**
4. **`.npmignore`와 `package.json`의 `files` 필드 확인**

## 🐛 문제 해결

### "You do not have permission to publish"
- npm 계정이 로그인되어 있는지 확인
- 패키지 이름이 이미 사용 중인지 확인

### "Package name too similar to existing packages"
- 패키지 이름을 변경하세요

### 빌드 에러
```bash
# node_modules 재설치
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📚 추가 리소스

- [npm 공식 문서](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [Semantic Versioning](https://semver.org/)

