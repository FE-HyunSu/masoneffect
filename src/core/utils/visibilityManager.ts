/**
 * VisibilityManager - IntersectionObserver와 Page Visibility API를 통합 관리
 * 모든 효과에서 공통으로 사용하는 가시성 관리 유틸리티
 */

export interface VisibilityManagerOptions {
  threshold?: number;
  rootMargin?: string;
  root?: HTMLElement | null; // IntersectionObserver의 root 옵션 (내부 스크롤 컨테이너 지원)
  onVisible?: () => void;
  onHidden?: () => void;
}

export class VisibilityManager {
  private container: HTMLElement;
  private options: VisibilityManagerOptions;
  private intersectionObserver: IntersectionObserver | null;
  private visibilityChangeHandler: (() => void) | null;
  private isVisible: boolean;
  private isPageVisible: boolean;

  constructor(container: HTMLElement, options: VisibilityManagerOptions = {}) {
    this.container = container;
    this.options = {
      threshold: options.threshold ?? 0.1,
      rootMargin: options.rootMargin ?? '0px',
      root: options.root ?? null, // 기본값은 null (viewport 기준)
      onVisible: options.onVisible,
      onHidden: options.onHidden,
    };
    this.intersectionObserver = null;
    this.visibilityChangeHandler = null;
    this.isVisible = false;
    this.isPageVisible = typeof document !== 'undefined' ? !document.hidden : true;

    this.setupIntersectionObserver();
    this.setupPageVisibility();
  }

  private setupIntersectionObserver(): void {
    // IntersectionObserver가 지원되지 않는 환경에서는 항상 보이는 것으로 처리
    if (typeof window === 'undefined' || typeof window.IntersectionObserver === 'undefined') {
      this.isVisible = true;
      if (this.isPageVisible && this.options.onVisible) {
        this.options.onVisible();
      }
      return;
    }

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target !== this.container) continue;

          if (entry.isIntersecting) {
            this.isVisible = true;
            // 페이지도 보일 때만 콜백 실행
            if (this.isPageVisible && this.options.onVisible) {
              this.options.onVisible();
            }
          } else {
            this.isVisible = false;
            if (this.options.onHidden) {
              this.options.onHidden();
            }
          }
        }
      },
      {
        threshold: this.options.threshold,
        rootMargin: this.options.rootMargin,
        root: this.options.root || null, // null이면 viewport 기준, HTMLElement면 해당 요소 기준
      }
    );

    this.intersectionObserver.observe(this.container);
  }

  private setupPageVisibility(): void {
    // Page Visibility API로 탭이 숨겨졌을 때도 콜백 실행 (GPU 절약)
    if (typeof document === 'undefined') return;

    this.visibilityChangeHandler = () => {
      const wasVisible = this.isPageVisible;
      this.isPageVisible = !document.hidden;

      if (document.hidden) {
        // 탭이 숨겨지면 항상 hidden 콜백 실행
        if (this.options.onHidden) {
          this.options.onHidden();
        }
      } else if (wasVisible !== this.isPageVisible) {
        // 탭이 다시 보이고 요소도 화면에 보이면 visible 콜백 실행
        if (this.isVisible && this.options.onVisible) {
          this.options.onVisible();
        }
      }
    };

    document.addEventListener('visibilitychange', this.visibilityChangeHandler);

    // 초기 상태 확인
    if (document.hidden && this.isVisible) {
      if (this.options.onHidden) {
        this.options.onHidden();
      }
    }
  }

  /**
   * 현재 요소가 화면에 보이는지 확인
   */
  getIsVisible(): boolean {
    return this.isVisible && this.isPageVisible;
  }

  /**
   * 옵션 업데이트
   */
  updateOptions(newOptions: Partial<VisibilityManagerOptions>): void {
    this.options = { ...this.options, ...newOptions };

    // IntersectionObserver 재설정
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
      this.intersectionObserver = null;
    }
    this.setupIntersectionObserver();
  }

  /**
   * 리소스 정리
   */
  destroy(): void {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
      this.intersectionObserver = null;
    }
    if (this.visibilityChangeHandler && typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', this.visibilityChangeHandler);
      this.visibilityChangeHandler = null;
    }
  }
}

export default VisibilityManager;

