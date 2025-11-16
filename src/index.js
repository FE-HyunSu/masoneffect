/**
 * MasonEffect - 메인 엔트리 포인트
 */

import MasonEffect from './core/index.js';

// Named export
export { MasonEffect };

// Default export (UMD 빌드에서 전역 변수로 직접 노출됨)
// CDN 사용 시: new MasonEffect()로 직접 사용 가능
export default MasonEffect;

