/**
 * MasonEffect - 메인 엔트리 포인트
 */

import MasonEffect from './core/index.js';

// Named export (ES modules, CommonJS용)
export { MasonEffect };
export type { MasonEffectOptions, Particle } from './core/index.js';

// Default export (UMD 빌드에서 전역 변수로 직접 노출됨)
// CDN 사용 시: new MasonEffect()로 직접 사용 가능
export default MasonEffect;

