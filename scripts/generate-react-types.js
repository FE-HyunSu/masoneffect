/**
 * React 타입 정의 파일 생성 스크립트
 * dist/react/index.d.ts를 올바르게 생성
 */

const fs = require('fs');
const path = require('path');

const content = `export { default } from './MasonEffect';
export type { MasonEffectRef, MasonEffectOptions } from './MasonEffect';
`;

const outputPath = path.join(__dirname, '../dist/react/index.d.ts');
fs.writeFileSync(outputPath, content, 'utf8');
console.log('✅ Generated dist/react/index.d.ts');

