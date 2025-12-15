/**
 * Count - 숫자 카운팅 애니메이션 효과
 * 바닐라 JS 코어 클래스
 * 
 * 사용법:
 * import { Count } from 'masoneffect/count';
 */

import { VisibilityManager } from '../utils/visibilityManager.js';

export interface CountOptions {
  targetValue: number;
  duration?: number;
  startValue?: number;
  enabled?: boolean;
  easing?: (t: number) => number;
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  onUpdate?: (value: number) => void;
  onComplete?: () => void;
}

// Easing 함수들
export const easingFunctions = {
  linear: (t: number) => t,
  easeInQuad: (t: number) => t * t,
  easeOutQuad: (t: number) => t * (2 - t),
  easeInOutQuad: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeOutCubic: (t: number) => --t * t * t + 1,
};

export class Count {
  container: HTMLElement;
  config: Required<Omit<CountOptions, 'onUpdate' | 'onComplete'>> & {
    onUpdate: CountOptions['onUpdate'];
    onComplete: CountOptions['onComplete'];
  };
  currentValue: number;
  startTime: number | null;
  animationFrameId: number | null;
  visibilityManager: VisibilityManager | null;
  isRunning: boolean;
  hasTriggered: boolean;

  constructor(container: HTMLElement | string, options: CountOptions) {
    // 컨테이너 요소
    this.container = typeof container === 'string' 
      ? document.querySelector(container) as HTMLElement
      : container;
    
    if (!this.container) {
      throw new Error('Container element not found');
    }

    // 설정값들
    this.config = {
      targetValue: options.targetValue,
      duration: options.duration ?? 2000,
      startValue: options.startValue ?? 0,
      enabled: options.enabled ?? true,
      easing: options.easing ?? easingFunctions.linear,
      threshold: options.threshold ?? 0.2,
      rootMargin: options.rootMargin ?? '0px 0px -100px 0px',
      triggerOnce: options.triggerOnce ?? false,
      onUpdate: options.onUpdate || null,
      onComplete: options.onComplete || null,
    };

    // 상태
    this.currentValue = this.config.startValue;
    this.startTime = null;
    this.animationFrameId = null;
    this.visibilityManager = null;
    this.isRunning = false;
    this.hasTriggered = false;

    // 초기화
    this.init();
  }

  init(): void {
    // 초기값 표시
    this.updateDisplay(this.config.startValue);

    // VisibilityManager 설정
    this.setupVisibilityManager();
  }

  setupVisibilityManager(): void {
    this.visibilityManager = new VisibilityManager(this.container, {
      threshold: this.config.threshold,
      rootMargin: this.config.rootMargin,
      onVisible: () => {
        // 요소가 화면에 보일 때 시작
        if (!this.hasTriggered && this.config.enabled) {
          this.hasTriggered = true;
          this.start();
        }
      },
      onHidden: () => {
        // 요소가 화면에서 벗어났을 때
        if (!this.config.triggerOnce && this.isRunning) {
          this.reset();
        }
      },
    });
  }

  start(): void {
    if (this.isRunning) return;
    if (!this.config.enabled) return;

    this.isRunning = true;
    this.startTime = null;
    this.currentValue = this.config.startValue;
    this.updateDisplay(this.currentValue);

    const animate = (currentTime: number) => {
      if (this.startTime === null) {
        this.startTime = currentTime;
      }

      const elapsed = currentTime - this.startTime;
      const progress = Math.min(elapsed / this.config.duration, 1);
      const easedProgress = this.config.easing(progress);
      
      this.currentValue = Math.floor(
        this.config.startValue + (this.config.targetValue - this.config.startValue) * easedProgress
      );
      
      this.updateDisplay(this.currentValue);

      if (this.config.onUpdate) {
        this.config.onUpdate(this.currentValue);
      }

      if (progress < 1) {
        this.animationFrameId = requestAnimationFrame(animate);
      } else {
        // 애니메이션 완료
        this.currentValue = this.config.targetValue;
        this.updateDisplay(this.currentValue);
        this.isRunning = false;
        
        if (this.config.onComplete) {
          this.config.onComplete();
        }
      }
    };

    this.animationFrameId = requestAnimationFrame(animate);
  }

  stop(): void {
    this.isRunning = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  reset(): void {
    this.stop();
    this.currentValue = this.config.startValue;
    this.updateDisplay(this.currentValue);
    this.hasTriggered = false;
    this.startTime = null;
  }

  updateDisplay(value: number): void {
    // 컨테이너의 텍스트 내용을 업데이트
    this.container.textContent = this.formatNumber(value);
  }

  formatNumber(value: number): string {
    // 숫자를 포맷팅 (소수점 제거, 천 단위 구분자 등)
    return Math.floor(value).toLocaleString();
  }

  // 설정 업데이트
  updateConfig(newConfig: Partial<CountOptions>): void {
    const wasRunning = this.isRunning;
    this.stop();

    this.config = {
      ...this.config,
      ...newConfig,
      onUpdate: newConfig.onUpdate !== undefined ? newConfig.onUpdate : this.config.onUpdate,
      onComplete: newConfig.onComplete !== undefined ? newConfig.onComplete : this.config.onComplete,
    };

    // targetValue가 변경되면 리셋 후 재시작
    if (newConfig.targetValue !== undefined) {
      this.reset();
      if (wasRunning && this.config.enabled) {
        this.start();
      }
    } else {
      // 다른 설정만 변경된 경우 현재 상태 유지
      if (wasRunning && this.config.enabled) {
        this.start();
      }
    }
  }

  // 현재 값 가져오기
  getValue(): number {
    return this.currentValue;
  }

  // 파괴 및 정리
  destroy(): void {
    this.stop();
    if (this.visibilityManager) {
      this.visibilityManager.destroy();
      this.visibilityManager = null;
    }
  }
}

// 기본 export
export default Count;

