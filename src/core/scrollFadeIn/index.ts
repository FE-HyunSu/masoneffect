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
  threshold?: number; // IntersectionObserver threshold
  rootMargin?: string; // IntersectionObserver rootMargin
  root?: HTMLElement | null; // IntersectionObserver의 root 옵션 (내부 스크롤 컨테이너 지원)
  triggerOnce?: boolean; // 한 번만 실행할지 여부
  enabled?: boolean; // 효과 활성화 여부
  onStart?: () => void;
  onComplete?: () => void;
}

// 기본 easing 함수 (easeOutCubic)
const defaultEasing = (t: number) => --t * t * t + 1;

export class ScrollFadeIn {
  container: HTMLElement;
  config: Required<Omit<ScrollFadeInOptions, 'onStart' | 'onComplete' | 'root'>> & {
    root: HTMLElement | null;
    onStart: ScrollFadeInOptions['onStart'];
    onComplete: ScrollFadeInOptions['onComplete'];
  };
  private easing: (t: number) => number;
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
      threshold: options.threshold ?? 0.1,
      rootMargin: options.rootMargin ?? '0px',
      root: options.root ?? null, // 기본값은 null (viewport 기준)
      triggerOnce: options.triggerOnce ?? false,
      enabled: options.enabled ?? true,
      onStart: options.onStart || null,
      onComplete: options.onComplete || null,
    };
    
    // 기본 easing 함수 (고정)
    this.easing = defaultEasing;

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
      root: this.config.root, // 내부 스크롤 컨테이너 지원
      onVisible: () => {
        // 요소가 화면에 보일 때 시작
        if (this.config.enabled) {
          // triggerOnce가 false이거나 아직 트리거되지 않았을 때만 시작
          if (!this.config.triggerOnce || !this.hasTriggered) {
            this.hasTriggered = true;
            this.start();
          }
        }
      },
      onHidden: () => {
        // 요소가 화면에서 벗어났을 때 항상 초기 위치로 복귀
        if (this.config.enabled) {
          this.stop();
          // triggerOnce가 false이면 hasTriggered도 초기화하여 다시 실행 가능하게
          if (!this.config.triggerOnce) {
            this.hasTriggered = false;
          }
          // 초기 위치로 복귀
          this.setInitialPosition();
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
    const easedProgress = this.easing(progress);

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
    if (newConfig.threshold !== undefined || newConfig.rootMargin !== undefined || newConfig.root !== undefined) {
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

