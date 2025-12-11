/**
 * MasonEffect React - 모든 React 컴포넌트를 export하는 메인 파일
 */

// TextToParticle 컴포넌트
export { default as TextToParticle } from './textToParticle/index.js';
export type { TextToParticleRef, TextToParticleOptions } from './textToParticle/index.js';

// Count 컴포넌트
export { default as Count } from './count/index.js';
export type { CountRef, CountOptions } from './count/index.js';
export { easingFunctions } from './count/index.js';

// 하위 호환성을 위한 alias (기존 MasonEffect 이름 유지)
export { default as MasonEffect } from './textToParticle/index.js';
export type { TextToParticleRef as MasonEffectRef, TextToParticleOptions as MasonEffectOptions } from './textToParticle/index.js';

// 기본 export는 TextToParticle (하위 호환성을 위해 MasonEffect도 지원)
export { default } from './textToParticle/index.js';
