/**
 * MasonEffect Core - 모든 이펙트를 export하는 메인 파일
 * 
 * 주의: tree-shaking을 위해 각 이펙트를 직접 import하는 것을 권장합니다:
 * - import { TextToParticle } from 'masoneffect/textToParticle'
 * - import { Count } from 'masoneffect/count'
 * 
 * 이 파일은 하위 호환성을 위해 제공됩니다.
 */

// TextToParticle 효과 (하위 호환성을 위해 re-export)
export { TextToParticle, default as TextToParticleDefault } from './textToParticle/index.js';
export type { TextToParticleOptions, Particle } from './textToParticle/index.js';

// Count 효과 (하위 호환성을 위해 re-export)
export { Count, default as CountDefault } from './count/index.js';
export type { CountOptions } from './count/index.js';
export { easingFunctions } from './count/index.js';

// Typing 효과 (하위 호환성을 위해 re-export)
export { Typing, default as TypingDefault } from './typing/index.js';
export type { TypingOptions } from './typing/index.js';

// Slide 효과 (하위 호환성을 위해 re-export)
export { Slide, default as SlideDefault } from './slide/index.js';
export type { SlideOptions } from './slide/index.js';
export { easingFunctions as slideEasingFunctions } from './slide/index.js';

// 하위 호환성을 위한 alias (기존 MasonEffect 이름 유지)
export { TextToParticle as MasonEffect } from './textToParticle/index.js';
export type { TextToParticleOptions as MasonEffectOptions } from './textToParticle/index.js';

// 기본 export는 TextToParticle (하위 호환성)
export { default } from './textToParticle/index.js';
