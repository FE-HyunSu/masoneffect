/**
 * ScrollFadeIn - 스크롤 기반 페이드 인 애니메이션 효과
 * 바닐라 JS 코어 클래스
 * 
 * 사용법:
 * import { ScrollFadeIn } from 'masoneffect/scrollFadeIn';
 */

import { VisibilityManager } from '../utils/visibilityManager.js';

export interface ScrollFadeInOptions {
  direction?: 'top' | 'right' | 'bottom' | 'left';
  distance?: string; // CSS 단위 (예: '100px', '50%', '2rem')
  duration?: number; // 애니메이션 지속 시간 (ms)
  easing?: (t: number) => number;
  threshold?: number; // IntersectionObserver threshold
  rootMargin?: string; // IntersectionObserver rootMargin
  triggerOnce?: boolean; // 한 번만 실행할지 여부
  enabled?: boolean; // 효과 활성화 여부
  onStart?: () => void;
  onComplete?: () => void;
}

// Easing 함수들
export const easingFunctions = {
  linear: (t: number) => t,
  easeInQuad: (t: number) => t * t,
  easeOutQuad: (t: number) => t * (2 - t),
  easeInOutQuad: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeOutCubic: (t: number) => --t * t * t + 1,
  easeInOutCubic: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
};

export class ScrollFadeIn {
  container: HTMLElement;
  config: Required<Omit<ScrollFadeInOptions, 'onStart' | 'onComplete' | 'easing'>> & {
    easing: (t: number) => number;
    onStart: ScrollFadeInOptions['onStart'];
    onComplete: ScrollFadeInOptions['onComplete'];
  };
  visibilityManager: VisibilityManager | null;
  animationFrameId: number | null;
  startTime: number | null;
  isRunning: boolean;
  hasTriggered: boolean;
  initialTransform: string;
  targetDistance: number; // 계산된 거리 (px)

  constructor(container: HTMLElement | string, options: ScrollFadeInOptions = {}) {
    // 컨테이너 요소
    this.container = typeof container === 'string' 
      ? document.querySelector(container) as HTMLElement
      : container;
    
    if (!this.container) {
      throw new Error('Container element not found');
    }

    // 설정값들
    this.config = {
      direction: options.direction ?? 'bottom',
      distance: options.distance ?? '50px',
      duration: options.duration ?? 800,
      easing: options.easing ?? easingFunctions.easeOutCubic,
      threshold: options.threshold ?? 0.1,
      rootMargin: options.rootMargin ?? '0px',
      triggerOnce: options.triggerOnce ?? false,
      enabled: options.enabled ?? true,
      onStart: options.onStart || null,
      onComplete: options.onComplete || null,
    };

    // 상태
    this.visibilityManager = null;
    this.animationFrameId = null;
    this.startTime = null;
    this.isRunning = false;
    this.hasTriggered = false;
    this.initialTransform = '';
    this.targetDistance = 0;

    // 초기화
    this.init();
  }

  init(): void {
    // 초기 transform 저장
    const computedStyle = window.getComputedStyle(this.container);
    this.initialTransform = computedStyle.transform !== 'none' 
      ? computedStyle.transform 
      : this.container.style.transform || '';
    
    // 거리를 픽셀 단위로 계산
    this.targetDistance = this.parseDistance(this.config.distance);
    
    // 초기 위치 설정 (애니메이션 시작 위치)
    this.setInitialPosition();
    
    // VisibilityManager 설정
    this.setupVisibilityManager();
  }

  parseDistance(distance: string): number {
    // CSS 단위를 픽셀로 변환
    const match = distance.match(/^(-?\d+\.?\d*)(px|rem|em|%|vh|vw)$/);
    if (!match) {
      // 기본값으로 px로 간주
      const num = parseFloat(distance) || 50;
      return num;
    }

    const value = parseFloat(match[1]);
    const unit = match[2];

    switch (unit) {
      case 'px':
        return value;
      case 'rem':
      case 'em':
        // 1rem = 16px (기본값)
        const fontSize = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
        return value * fontSize;
      case '%':
        // 컨테이너 크기의 백분율
        const rect = this.container.getBoundingClientRect();
        const dimension = this.config.direction === 'top' || this.config.direction === 'bottom' 
          ? rect.height 
          : rect.width;
        return (value / 100) * dimension;
      case 'vh':
        return (value / 100) * window.innerHeight;
      case 'vw':
        return (value / 100) * window.innerWidth;
      default:
        return value;
    }
  }

  setInitialPosition(): void {
    // 초기 위치 설정 (애니메이션 시작 위치)
    const direction = this.config.direction;
    let translateX = 0;
    let translateY = 0;

    switch (direction) {
      case 'top':
        translateY = -this.targetDistance;
        break;
      case 'right':
        translateX = this.targetDistance;
        break;
      case 'bottom':
        translateY = this.targetDistance;
        break;
      case 'left':
        translateX = -this.targetDistance;
        break;
    }

    // 기존 transform 유지하면서 translate 추가
    const existingTransform = this.initialTransform || '';
    const translate = `translate(${translateX}px, ${translateY}px)`;
    
    // 기존 transform이 있으면 조합, 없으면 새로 생성
    if (existingTransform && existingTransform !== 'none') {
      this.container.style.transform = `${translate} ${existingTransform}`;
    } else {
      this.container.style.transform = translate;
    }
    
    // opacity도 초기값 설정
    this.container.style.opacity = '0';
    this.container.style.transition = 'none'; // 초기에는 transition 없음
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
    
    this.isRunning = true;
    this.startTime = performance.now();
    
    if (this.config.onStart) {
      this.config.onStart();
    }

    // transition 제거하고 requestAnimationFrame으로 애니메이션
    this.container.style.transition = 'none';
    this.animate();
  }

  animate(): void {
    if (!this.isRunning) return;

    const currentTime = performance.now();
    const elapsed = currentTime - (this.startTime || 0);
    const progress = Math.min(elapsed / this.config.duration, 1);
    
    // Easing 적용
    const easedProgress = this.config.easing(progress);

    // 현재 위치 계산
    const direction = this.config.direction;
    let translateX = 0;
    let translateY = 0;

    switch (direction) {
      case 'top':
        translateY = -this.targetDistance * (1 - easedProgress);
        break;
      case 'right':
        translateX = this.targetDistance * (1 - easedProgress);
        break;
      case 'bottom':
        translateY = this.targetDistance * (1 - easedProgress);
        break;
      case 'left':
        translateX = -this.targetDistance * (1 - easedProgress);
        break;
    }

    // Transform 적용
    const existingTransform = this.initialTransform || '';
    const translate = `translate(${translateX}px, ${translateY}px)`;
    
    if (existingTransform && existingTransform !== 'none') {
      this.container.style.transform = `${translate} ${existingTransform}`;
    } else {
      this.container.style.transform = translate;
    }

    // Opacity도 함께 애니메이션
    this.container.style.opacity = String(easedProgress);

    if (progress < 1) {
      this.animationFrameId = requestAnimationFrame(() => this.animate());
    } else {
      // 애니메이션 완료
      this.complete();
    }
  }

  complete(): void {
    this.isRunning = false;
    
    // 최종 위치 설정 (transform 제거, 원래 위치로)
    if (this.initialTransform && this.initialTransform !== 'none') {
      this.container.style.transform = this.initialTransform;
    } else {
      this.container.style.transform = '';
    }
    this.container.style.opacity = '1';
    
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.config.onComplete) {
      this.config.onComplete();
    }
  }

  reset(): void {
    this.stop();
    this.hasTriggered = false;
    this.setInitialPosition();
  }

  stop(): void {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  // 설정 업데이트
  updateConfig(newConfig: Partial<ScrollFadeInOptions>): void {
    const wasRunning = this.isRunning;
    this.stop();

    this.config = {
      ...this.config,
      ...newConfig,
      easing: newConfig.easing ?? this.config.easing,
      onStart: newConfig.onStart ?? this.config.onStart,
      onComplete: newConfig.onComplete ?? this.config.onComplete,
    };

    // 거리 재계산
    if (newConfig.distance) {
      this.targetDistance = this.parseDistance(this.config.distance);
    }

    // 초기 위치 재설정
    this.setInitialPosition();

    // VisibilityManager 재설정
    if (newConfig.threshold !== undefined || newConfig.rootMargin !== undefined) {
      if (this.visibilityManager) {
        this.visibilityManager.destroy();
        this.visibilityManager = null;
      }
      this.setupVisibilityManager();
    }

    // 실행 중이었으면 다시 시작
    if (wasRunning && this.config.enabled) {
      this.start();
    }
  }

  // 파괴 및 정리
  destroy(): void {
    this.stop();
    if (this.visibilityManager) {
      this.visibilityManager.destroy();
      this.visibilityManager = null;
    }
    // 스타일 초기화
    this.container.style.transform = this.initialTransform || '';
    this.container.style.opacity = '';
    this.container.style.transition = '';
  }
}

// 기본 export
export default ScrollFadeIn;

