/**
 * MasonEffect - 메인 엔트리 포인트
 * 
 * 주의: tree-shaking을 위해 각 이펙트를 직접 import하는 것을 권장합니다:
 * - import { TextToParticle } from 'masoneffect/textToParticle'
 * - import { Count } from 'masoneffect/count'
 * 
 * 이 파일은 하위 호환성을 위해 제공됩니다.
 */

// TextToParticle 효과
export { TextToParticle, MasonEffect } from './core/index.js';
export type { TextToParticleOptions, MasonEffectOptions, Particle } from './core/index.js';

// Count 효과
export { Count } from './core/index.js';
export type { CountOptions } from './core/index.js';
export { easingFunctions } from './core/index.js';

// Typing 효과
export { Typing } from './core/index.js';
export type { TypingOptions } from './core/index.js';

// Slide 효과
export { Slide } from './core/index.js';
export type { SlideOptions } from './core/index.js';
export { easingFunctions as slideEasingFunctions } from './core/index.js';

// 하위 호환성을 위한 기본 export
export { default } from './core/index.js';
