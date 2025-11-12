#!/usr/bin/env node

/**
 * npm 배포 전 체크 스크립트
 * npm run precheck 실행
 */

const fs = require('fs');
const path = require('path');

const errors = [];
const warnings = [];

// package.json 확인
const packagePath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

// 1. author 확인
if (!packageJson.author || packageJson.author.trim() === '') {
  warnings.push('⚠️  package.json의 "author" 필드가 비어있습니다.');
}

// 2. repository 확인
if (!packageJson.repository || !packageJson.repository.url) {
  warnings.push('⚠️  package.json의 "repository" 필드가 비어있습니다.');
}

// 3. dist 폴더 확인
const distPath = path.join(__dirname, '..', 'dist');
if (!fs.existsSync(distPath)) {
  errors.push('❌ dist 폴더가 없습니다. "npm run build"를 실행하세요.');
} else {
  const distFiles = fs.readdirSync(distPath);
  if (distFiles.length === 0) {
    errors.push('❌ dist 폴더가 비어있습니다. "npm run build"를 실행하세요.');
  } else {
    console.log('✅ dist 폴더 확인 완료:', distFiles.length, '개 파일');
  }
}

// 4. LICENSE 확인
const licensePath = path.join(__dirname, '..', 'LICENSE');
if (!fs.existsSync(licensePath)) {
  warnings.push('⚠️  LICENSE 파일이 없습니다.');
}

// 5. README 확인
const readmePath = path.join(__dirname, '..', 'README.md');
if (!fs.existsSync(readmePath)) {
  warnings.push('⚠️  README.md 파일이 없습니다.');
}

// 결과 출력
console.log('\n📦 npm 배포 전 체크 결과\n');

if (warnings.length > 0) {
  console.log('경고:');
  warnings.forEach(w => console.log('  ' + w));
  console.log('');
}

if (errors.length > 0) {
  console.log('에러:');
  errors.forEach(e => console.log('  ' + e));
  console.log('');
  console.log('❌ 배포를 진행할 수 없습니다. 위 항목들을 수정해주세요.\n');
  process.exit(1);
}

if (warnings.length === 0 && errors.length === 0) {
  console.log('✅ 모든 체크를 통과했습니다!\n');
  console.log('다음 명령어로 배포할 수 있습니다:');
  console.log('  npm publish --dry-run  # 테스트');
  console.log('  npm publish            # 실제 배포\n');
} else if (errors.length === 0) {
  console.log('✅ 필수 항목은 모두 준비되었습니다.');
  console.log('경고 항목은 선택사항이지만, 배포 전에 확인하는 것을 권장합니다.\n');
}

