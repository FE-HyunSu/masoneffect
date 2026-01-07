/**
 * TextSpin - 텍스트를 개별 문자로 분리하여 랜덤하게 나타나는 애니메이션 효과
 * 바닐라 JS 코어 클래스
 * 
 * 사용법:
 * import { TextSpin } from 'masoneffect/textSpin';
 */

import { VisibilityManager } from '../utils/visibilityManager.js';

export interface TextSpinOptions {
  text: string;
  delay?: number; // 기본 지연 시간 (초) - 예: 0.2 = 200ms
  duration?: number; // 애니메이션 지속 시간 (초) - 예: 0.6 = 600ms
  randomDelay?: number; // 랜덤 지연 시간 범위 (초, 기본값: 2) - 예: 2 = 0~2000ms 범위
  threshold?: number; // IntersectionObserver threshold
  rootMargin?: string; // IntersectionObserver rootMargin
  root?: HTMLElement | null; // IntersectionObserver의 root 옵션 (내부 스크롤 컨테이너 지원)
  triggerOnce?: boolean; // 한 번만 실행할지 여부
  enabled?: boolean; // 효과 활성화 여부 (false로 변경 시 자동으로 stop)
  onStart?: () => void;
  onComplete?: () => void;
}

export class TextSpin {
  container: HTMLElement;
  config: Required<Omit<TextSpinOptions, 'onStart' | 'onComplete' | 'root'>> & {
    root: HTMLElement | null;
    onStart: TextSpinOptions['onStart'];
    onComplete: TextSpinOptions['onComplete'];
  };
  visibilityManager: VisibilityManager | null;
  textElements: HTMLElement[];
  randomPoints: number[];
  hasTriggered: boolean;
  isActive: boolean;

  constructor(container: HTMLElement | string, options: TextSpinOptions) {
    // 컨테이너 요소
    this.container = typeof container === 'string' 
      ? document.querySelector(container) as HTMLElement
      : container;
    
    if (!this.container) {
      throw new Error('Container element not found');
    }

    if (!options.text) {
      throw new Error('Text is required');
    }

    // 설정값들
    this.config = {
      text: options.text,
      delay: options.delay ?? 0.2,
      duration: options.duration ?? 0.6,
      randomDelay: options.randomDelay ?? 2,
      threshold: options.threshold ?? 0.1,
      rootMargin: options.rootMargin ?? '0px',
      root: options.root ?? null,
      triggerOnce: options.triggerOnce ?? false,
      enabled: options.enabled ?? true,
      onStart: options.onStart || null,
      onComplete: options.onComplete || null,
    };

    // 상태
    this.visibilityManager = null;
    this.textElements = [];
    this.randomPoints = [];
    this.hasTriggered = false;
    this.isActive = false;

    // 초기화
    this.init();
  }

  init(): void {
    // 스타일 주입
    this.injectStyles();
    
    // 텍스트 구조 생성
    this.createTextStructure();
    
    // VisibilityManager 설정
    this.setupVisibilityManager();
  }

  injectStyles(): void {
    // 이미 스타일이 주입되어 있는지 확인
    if (document.getElementById('masoneffect-textspin-styles')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'masoneffect-textspin-styles';
    style.textContent = `
      .masoneffect-textspin {
        display: inline-block;
      }
      .masoneffect-textspin-char {
        display: inline-block;
        opacity: 0;
        transform: rotateY(90deg);
      }
      .masoneffect-textspin-char.active {
        opacity: 1;
        transform: rotateY(0deg);
      }
      .masoneffect-textspin-char.space {
        width: 0.25em;
      }
    `;
    document.head.appendChild(style);
  }

  createTextStructure(): void {
    // 기존 내용 제거
    this.container.innerHTML = '';
    this.textElements = [];
    this.randomPoints = [];

    // 텍스트를 문자 단위로 분리
    const chars = this.config.text.split('');
    
    // 각 문자에 대한 랜덤 포인트 생성
    chars.forEach(() => {
      this.randomPoints.push(Math.random());
    });

    // 문자 요소 생성
    chars.forEach((char, index) => {
      const charElement = document.createElement('span');
      charElement.className = 'masoneffect-textspin-char';
      
      // transition을 인라인으로 적용 (duration 변경 시 즉시 반영)
      charElement.style.transition = `opacity ${this.config.duration}s ease-out, transform ${this.config.duration}s ease-out`;
      
      // 공백 문자 처리
      if (char === ' ') {
        charElement.classList.add('space');
        charElement.innerHTML = '&nbsp;';
      } else {
        charElement.textContent = char;
      }

      this.container.appendChild(charElement);
      this.textElements.push(charElement);
    });

    // 컨테이너에 클래스 추가
    this.container.classList.add('masoneffect-textspin');
  }

  setupVisibilityManager(): void {
    this.visibilityManager = new VisibilityManager(this.container, {
      threshold: this.config.threshold,
      rootMargin: this.config.rootMargin,
      root: this.config.root,
      onVisible: () => {
        if (this.config.enabled) {
          if (!this.config.triggerOnce || !this.hasTriggered) {
            this.hasTriggered = true;
            this.start();
          }
        }
      },
      onHidden: () => {
        if (this.config.enabled) {
          this.stop();
          // triggerOnce가 false이면 hasTriggered도 초기화
          if (!this.config.triggerOnce) {
            this.hasTriggered = false;
          }
        }
      },
    });
  }

  start(): void {
    if (this.isActive) return;
    
    this.isActive = true;

    if (this.config.onStart) {
      this.config.onStart();
    }

    // 각 문자에 랜덤 지연 시간 적용
    this.textElements.forEach((element, index) => {
      const delay = this.config.delay + (this.randomPoints[index] * this.config.randomDelay);
      element.style.transitionDelay = `${delay}s`;
      
      // 다음 프레임에 active 클래스 추가
      requestAnimationFrame(() => {
        element.classList.add('active');
      });
    });

    // 애니메이션 완료 시간 계산 (가장 늦게 시작하는 문자의 지연 시간 + duration)
    const maxDelay = this.config.delay + this.config.randomDelay + this.config.duration;
    setTimeout(() => {
      if (this.config.onComplete) {
        this.config.onComplete();
      }
    }, maxDelay * 1000);
  }

  stop(): void {
    if (!this.isActive) return;
    
    this.isActive = false;

    // 모든 문자의 active 클래스 제거
    this.textElements.forEach((element) => {
      element.classList.remove('active');
      element.style.transitionDelay = '';
    });
  }

  reset(): void {
    this.stop();
    this.hasTriggered = false;
  }

  // 텍스트 업데이트
  updateText(newText: string): void {
    this.config.text = newText;
    this.createTextStructure();
    
    // 활성화되어 있으면 다시 시작
    if (this.isActive) {
      this.start();
    }
  }

  // 모든 문자 요소의 transition 업데이트
  updateTransitions(): void {
    this.textElements.forEach((element) => {
      element.style.transition = `opacity ${this.config.duration}s ease-out, transform ${this.config.duration}s ease-out`;
    });
  }

  // 설정 업데이트
  updateConfig(newConfig: Partial<TextSpinOptions>): void {
    const wasActive = this.isActive;
    const wasEnabled = this.config.enabled;
    const isEnabledChanging = newConfig.enabled !== undefined && newConfig.enabled !== this.config.enabled;
    
    // enabled가 false로 변경되면 즉시 stop
    if (isEnabledChanging && newConfig.enabled === false) {
      this.stop();
    } else if (wasActive) {
      // enabled가 true이거나 변경되지 않았고, 활성화되어 있었으면 일시 중지
      this.stop();
    }

    this.config = {
      ...this.config,
      ...newConfig,
      text: newConfig.text ?? this.config.text,
      onStart: newConfig.onStart ?? this.config.onStart,
      onComplete: newConfig.onComplete ?? this.config.onComplete,
    };

    // 텍스트가 변경되었으면 구조 재생성
    if (newConfig.text !== undefined) {
      this.createTextStructure();
    } else if (newConfig.duration !== undefined) {
      // duration이 변경되었으면 transition 업데이트
      this.updateTransitions();
    }

    // VisibilityManager 재설정
    if (newConfig.threshold !== undefined || newConfig.rootMargin !== undefined || newConfig.root !== undefined) {
      if (this.visibilityManager) {
        this.visibilityManager.destroy();
        this.visibilityManager = null;
      }
      this.setupVisibilityManager();
    }

    // enabled가 true이고, 이전에 활성화되어 있었거나 enabled가 true로 변경되었으면 다시 시작
    if (this.config.enabled) {
      if (wasActive || (isEnabledChanging && newConfig.enabled === true)) {
        // VisibilityManager가 자동으로 시작하지만, 즉시 시작하려면 수동 호출
        // 단, 화면에 보이는 경우에만
        if (this.visibilityManager?.getIsVisible()) {
          this.start();
        }
      }
    }
  }

  // 파괴 및 정리
  destroy(): void {
    this.stop();
    if (this.visibilityManager) {
      this.visibilityManager.destroy();
      this.visibilityManager = null;
    }
    // 컨테이너 내용 제거
    this.container.innerHTML = '';
    this.container.classList.remove('masoneffect-textspin');
  }
}

// 기본 export
export default TextSpin;

