/**
 * TextToParticle - 텍스트를 파티클로 변환하는 효과
 * 바닐라 JS 코어 클래스
 * 
 * 사용법:
 * import { TextToParticle } from 'masoneffect/textToParticle';
 */

export interface TextToParticleOptions {
  text?: string;
  densityStep?: number;
  maxParticles?: number;
  pointSize?: number;
  ease?: number;
  repelRadius?: number;
  repelStrength?: number;
  particleColor?: string;
  fontFamily?: string;
  fontSize?: number | null;
  width?: number | null;
  height?: number | null;
  devicePixelRatio?: number | null;
  debounceDelay?: number;
  onReady?: (instance: TextToParticle) => void;
  onUpdate?: (instance: TextToParticle) => void;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  tx: number;
  ty: number;
  initialX?: number;
  initialY?: number;
  j: number;
}

// 디바운스 유틸리티 함수
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func.apply(this, args);
    };
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

export class TextToParticle {
  container: HTMLElement;
  config: Required<Omit<TextToParticleOptions, 'onReady' | 'onUpdate' | 'debounceDelay'>> & {
    onReady: TextToParticleOptions['onReady'];
    onUpdate: TextToParticleOptions['onUpdate'];
  };
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  offCanvas: HTMLCanvasElement;
  offCtx: CanvasRenderingContext2D;
  W: number;
  H: number;
  DPR: number;
  particles: Particle[];
  mouse: { x: number; y: number; down: boolean };
  animationId: number | null;
  isRunning: boolean;
  isVisible: boolean;
  intersectionObserver: IntersectionObserver | null;
  debounceDelay: number;
  _debouncedMorph!: (textOrOptions?: string | Partial<TextToParticleOptions> | null) => void;
  _debouncedUpdateConfig!: (newConfig: Partial<TextToParticleOptions>) => void;

  constructor(container: HTMLElement | string, options: TextToParticleOptions = {}) {
    // 컨테이너 요소
    this.container = typeof container === 'string' 
      ? document.querySelector(container) as HTMLElement
      : container;
    
    if (!this.container) {
      throw new Error('Container element not found');
    }

    // 설정값들
    this.config = {
      text: options.text || 'mason effect',
      densityStep: options.densityStep ?? 2,
      maxParticles: options.maxParticles ?? 3200,
      pointSize: options.pointSize ?? 0.5,
      ease: options.ease ?? 0.05,
      repelRadius: options.repelRadius ?? 150,
      repelStrength: options.repelStrength ?? 1,
      particleColor: options.particleColor || '#fff',
      fontFamily: options.fontFamily || 'Inter, system-ui, Arial',
      fontSize: options.fontSize || null,
      width: options.width || null,
      height: options.height || null,
      devicePixelRatio: options.devicePixelRatio ?? null,
      onReady: options.onReady || null,
      onUpdate: options.onUpdate || null,
    } as typeof this.config;

    // 캔버스 생성
    this.canvas = document.createElement('canvas');
    const ctx = this.canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) {
      throw new Error('Canvas context not available');
    }
    this.ctx = ctx;
    this.container.appendChild(this.canvas);
    this.canvas.style.display = 'block';

    // 오프스크린 캔버스 (텍스트 렌더링용)
    this.offCanvas = document.createElement('canvas');
    const offCtx = this.offCanvas.getContext('2d', { willReadFrequently: true });
    if (!offCtx) {
      throw new Error('Offscreen canvas context not available');
    }
    this.offCtx = offCtx;

    // 상태
    this.W = 0;
    this.H = 0;
    this.DPR = this.config.devicePixelRatio || Math.min(window.devicePixelRatio || 1, 1.8);
    this.particles = [];
    this.mouse = { x: 0, y: 0, down: false };
    this.animationId = null;
    this.isRunning = false;
    this.isVisible = false;
    this.intersectionObserver = null;

    // 디바운스 설정 (ms)
    this.debounceDelay = options.debounceDelay ?? 150;

    // 이벤트 핸들러 바인딩 (디바운스 적용 전에 바인딩)
    const boundHandleResize = this.handleResize.bind(this);
    this.handleResize = debounce(boundHandleResize, this.debounceDelay);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);

    // morph와 updateConfig를 위한 디바운스된 내부 메서드
    this._debouncedMorph = debounce(this._morphInternal.bind(this), this.debounceDelay);
    this._debouncedUpdateConfig = debounce(this._updateConfigInternal.bind(this), this.debounceDelay);

    // 초기화
    this.init();
  }

  init(): void {
    this.resize();
    this.setupEventListeners();
    this.setupIntersectionObserver();

    if (this.config.onReady) {
      this.config.onReady(this);
    }
  }

  setupIntersectionObserver(): void {
    // IntersectionObserver가 지원되지 않는 환경에서는 항상 재생
    if (typeof window === 'undefined' || typeof window.IntersectionObserver === 'undefined') {
      this.isVisible = true;
      this.start();
      return;
    }

    // 이미 설정되어 있다면 다시 만들지 않음
    if (this.intersectionObserver) {
      return;
    }

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target !== this.container) continue;

          if (entry.isIntersecting) {
            this.isVisible = true;
            this.start();
          } else {
            this.isVisible = false;
            this.stop();
          }
        }
      },
      {
        threshold: 0.1, // 10% 이상 보일 때 동작
      }
    );

    this.intersectionObserver.observe(this.container);
  }

  resize(): void {
    const width = this.config.width || this.container.clientWidth || window.innerWidth;
    const height = this.config.height || this.container.clientHeight || window.innerHeight * 0.7;
    
    // 최소 크기 보장
    if (width <= 0 || height <= 0) {
      return;
    }
    
    this.W = Math.floor(width * this.DPR);
    this.H = Math.floor(height * this.DPR);
    
    // 캔버스 크기 제한 (메모리 오류 방지)
    // getImageData는 최대 약 268MB (4096x4096x4)까지 지원
    const MAX_CANVAS_SIZE = 4096;
    if (this.W > MAX_CANVAS_SIZE || this.H > MAX_CANVAS_SIZE) {
      const scale = Math.min(MAX_CANVAS_SIZE / this.W, MAX_CANVAS_SIZE / this.H);
      this.W = Math.floor(this.W * scale);
      this.H = Math.floor(this.H * scale);
      this.DPR = this.DPR * scale;
    }
    
    this.canvas.width = this.W;
    this.canvas.height = this.H;
    this.canvas.style.width = width + 'px';
    this.canvas.style.height = height + 'px';

    // 크기가 유효할 때만 buildTargets 실행
    if (this.W > 0 && this.H > 0) {
      this.buildTargets();
      if (!this.particles.length) {
        this.initParticles();
      }
    }
  }

  /**
   * 텍스트가 영역 안에 들어가는지 확인하는 헬퍼 함수 (줄바꿈 지원)
   * @param fontSize 확인할 폰트 크기
   * @param text 텍스트 (\n으로 줄바꿈 구분)
   * @param maxWidth 최대 너비
   * @param maxHeight 최대 높이
   * @returns { width: number, height: number, fits: boolean }
   */
  private measureTextFit(fontSize: number, text: string, maxWidth: number, maxHeight: number): { width: number; height: number; fits: boolean } {
    this.offCtx.font = `400 ${fontSize}px ${this.config.fontFamily}`;
    
    // 줄바꿈으로 텍스트 분리
    const lines = text.split('\n');
    const lineHeight = fontSize;
    const lineSpacing = fontSize * 0.1; // 줄 간격
    const spacing = fontSize * 0.05; // 글자 간격
    
    let maxLineWidth = 0;
    
    // 각 줄의 너비 계산
    for (const line of lines) {
      if (line.length === 0) continue; // 빈 줄 스킵
      
      const textWidth = this.offCtx.measureText(line).width;
      const totalWidth = textWidth + spacing * (line.length > 0 ? line.length - 1 : 0);
      maxLineWidth = Math.max(maxLineWidth, totalWidth);
    }
    
    // 전체 높이 계산 (줄 높이 + 줄 간격)
    const totalHeight = lines.length > 0 
      ? (lineHeight * lines.length) + (lineSpacing * (lines.length - 1))
      : lineHeight;
    
    return {
      width: maxLineWidth,
      height: totalHeight,
      fits: maxLineWidth <= maxWidth && totalHeight <= maxHeight
    };
  }

  /**
   * 이진 검색을 사용하여 적절한 폰트 크기를 찾는 최적화된 함수
   * 반복 횟수를 O(log n)으로 줄여 성능 개선 (최대 15회 반복, 기존 최대 100회에서 대폭 감소)
   */
  private findOptimalFontSize(text: string, maxWidth: number, maxHeight: number, initialFontSize: number): number {
    const minFontSize = 12;
    
    // 초기값이 이미 맞는지 확인 (최적화: 불필요한 계산 방지)
    const initialMeasure = this.measureTextFit(initialFontSize, text, maxWidth, maxHeight);
    if (initialMeasure.fits) {
      return initialFontSize;
    }
    
    // 초기값이 너무 작거나 같은 경우
    if (initialFontSize <= minFontSize) {
      return minFontSize;
    }
    
    // 이진 검색으로 최적 폰트 크기 찾기
    let low = minFontSize;
    let high = initialFontSize;
    let bestSize = minFontSize;
    
    // 최대 15회 반복으로 충분 (log2(3000) ≈ 12)
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const measure = this.measureTextFit(mid, text, maxWidth, maxHeight);
      
      if (measure.fits) {
        bestSize = mid; // fit하는 크기 기록
        low = mid + 1; // 더 큰 크기도 시도
      } else {
        high = mid - 1; // 더 작은 크기로 시도
      }
    }
    
    return bestSize;
  }

  buildTargets(): void {
    // 크기 검증
    if (this.W <= 0 || this.H <= 0) {
      return;
    }
    
    const text = this.config.text;
    this.offCanvas.width = this.W;
    this.offCanvas.height = this.H;
    this.offCtx.clearRect(0, 0, this.offCanvas.width, this.offCanvas.height);

    // 초기 폰트 크기 계산 (개선된 추정)
    const base = Math.min(this.W, this.H);
    const initialFontSize = this.config.fontSize || Math.max(80, Math.floor(base * 0.18));
    
    // 텍스트가 영역을 벗어나지 않도록 폰트 크기 자동 조정
    const padding = 40; // 여유 공간 (픽셀)
    const maxWidth = this.W - padding * 2;
    const maxHeight = this.H - padding * 2;
    
    // 이진 검색으로 최적 폰트 크기 찾기 (성능 최적화)
    const fontSize = this.findOptimalFontSize(text, maxWidth, maxHeight, initialFontSize);
    
    // 최종 렌더링
    this.offCtx.fillStyle = '#ffffff';
    this.offCtx.textAlign = 'center';
    this.offCtx.textBaseline = 'middle';
    this.offCtx.font = `400 ${fontSize}px ${this.config.fontFamily}`;

    // 줄바꿈으로 텍스트 분리
    const lines = text.split('\n');
    const lineHeight = fontSize;
    const lineSpacing = fontSize * 0.1; // 줄 간격
    const spacing = fontSize * 0.05; // 글자 간격
    
    // 전체 텍스트 높이 계산 (세로 중앙 정렬용)
    const totalTextHeight = lines.length > 0
      ? (lineHeight * lines.length) + (lineSpacing * (lines.length - 1))
      : lineHeight;
    
    // 첫 번째 줄의 시작 y 위치 (세로 중앙 정렬)
    let startY = this.H / 2 - totalTextHeight / 2 + lineHeight / 2;
    
    // 각 줄 렌더링
    for (const line of lines) {
      if (line.length === 0) {
        // 빈 줄은 줄 간격만큼 아래로 이동
        startY += lineHeight + lineSpacing;
        continue;
      }
      
      // 글자 간격 계산 및 그리기
      const chars = line.split('');
      const totalWidth = this.offCtx.measureText(line).width + spacing * (chars.length > 0 ? chars.length - 1 : 0);
      let x = this.W / 2 - totalWidth / 2;
      
      for (const ch of chars) {
        this.offCtx.fillText(ch, x + this.offCtx.measureText(ch).width / 2, startY);
        x += this.offCtx.measureText(ch).width + spacing;
      }
      
      // 다음 줄로 이동
      startY += lineHeight + lineSpacing;
    }

    // 픽셀 샘플링
    const step = Math.max(2, this.config.densityStep);
    const img = this.offCtx.getImageData(0, 0, this.W, this.H).data;
    const targets: Array<{ x: number; y: number }> = [];
    
    for (let y = 0; y < this.H; y += step) {
      for (let x = 0; x < this.W; x += step) {
        const i = (y * this.W + x) * 4;
        if (img[i] + img[i + 1] + img[i + 2] > 600) {
          targets.push({ x, y });
        }
      }
    }

    // 파티클 수 제한
    while (targets.length > this.config.maxParticles) {
      targets.splice(Math.floor(Math.random() * targets.length), 1);
    }

    // 파티클 수 조정
    if (this.particles.length < targets.length) {
      const need = targets.length - this.particles.length;
      for (let i = 0; i < need; i++) {
        this.particles.push(this.makeParticle());
      }
    } else if (this.particles.length > targets.length) {
      this.particles.length = targets.length;
    }

    // 목표 좌표 할당
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      const t = targets[i];
      p.tx = t.x;
      p.ty = t.y;
    }
  }

  makeParticle(): Particle {
    // 캔버스 전체에 골고루 분포 (여백 없이)
    const sx = Math.random() * this.W;
    const sy = Math.random() * this.H;
    return {
      x: sx,
      y: sy,
      vx: 0,
      vy: 0,
      tx: sx,
      ty: sy,
      initialX: sx, // 초기 위치 저장 (scatter 시 돌아갈 위치)
      initialY: sy,
      j: Math.random() * Math.PI * 2,
    };
  }

  initParticles(): void {
    // 캔버스 전체에 골고루 분포 (여백 없이)
    for (const p of this.particles) {
      const sx = Math.random() * this.W;
      const sy = Math.random() * this.H;
      p.x = sx;
      p.y = sy;
      p.vx = p.vy = 0;
      // 초기 위치 저장 (scatter 시 돌아갈 위치)
      p.initialX = sx;
      p.initialY = sy;
    }
  }

  scatter(): void {
    // 각 파티클을 초기 위치로 돌아가도록 설정
    for (const p of this.particles) {
      // 초기 위치가 저장되어 있으면 그 위치로, 없으면 현재 위치 유지
      if (p.initialX !== undefined && p.initialY !== undefined) {
        p.tx = p.initialX;
        p.ty = p.initialY;
      } else {
        // 초기 위치가 없으면 현재 위치를 초기 위치로 저장
        p.initialX = p.x;
        p.initialY = p.y;
        p.tx = p.initialX;
        p.ty = p.initialY;
      }
    }
  }

  morph(textOrOptions?: string | Partial<TextToParticleOptions> | null): void {
    // 즉시 실행이 필요한 경우 (예: 초기화 시)를 위해 내부 메서드 직접 호출
    // 일반적인 경우에는 디바운스 적용
    this._debouncedMorph(textOrOptions);
  }

  _morphInternal(textOrOptions?: string | Partial<TextToParticleOptions> | null): void {
    // W와 H가 0이면 resize 먼저 실행
    if (this.W === 0 || this.H === 0) {
      this.resize();
    }
    
    if (typeof textOrOptions === 'string') {
      // 문자열인 경우: 기존 동작 유지
      this.config.text = textOrOptions;
      this.buildTargets();
    } else if (textOrOptions && typeof textOrOptions === 'object') {
      // 객체인 경우: 텍스트와 함께 다른 설정도 변경
      const needsRebuild = textOrOptions.text !== undefined;
      this.config = { ...this.config, ...textOrOptions };
      if (needsRebuild) {
        this.buildTargets();
      }
    } else {
      // null이거나 undefined인 경우: 현재 텍스트로 재빌드
      this.buildTargets();
    }
  }

  update(): void {
    this.ctx.clearRect(0, 0, this.W, this.H);

    for (const p of this.particles) {
      // 목표 좌표로 당기는 힘
      let ax = (p.tx - p.x) * this.config.ease;
      let ay = (p.ty - p.y) * this.config.ease;

      // 마우스 반발/흡입
      if (this.mouse.x || this.mouse.y) {
        const dx = p.x - this.mouse.x;
        const dy = p.y - this.mouse.y;
        const d2 = dx * dx + dy * dy;
        const r = this.config.repelRadius * this.DPR;
        if (d2 < r * r) {
          const d = Math.sqrt(d2) + 0.0001;
          const f = (this.mouse.down ? -1 : 1) * this.config.repelStrength * (1 - d / r);
          ax += (dx / d) * f * 6.0;
          ay += (dy / d) * f * 6.0;
        }
      }

      // 진동 효과
      p.j += 2;
      ax += Math.cos(p.j) * 0.05;
      ay += Math.sin(p.j * 1.3) * 0.05;

      // 속도와 위치 업데이트
      p.vx = (p.vx + ax) * Math.random();
      p.vy = (p.vy + ay) * Math.random();
      p.x += p.vx;
      p.y += p.vy;
    }

    // 파티클 그리기
    this.ctx.fillStyle = this.config.particleColor;
    const r = this.config.pointSize * this.DPR;
    for (const p of this.particles) {
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      this.ctx.fill();
    }

    if (this.config.onUpdate) {
      this.config.onUpdate(this);
    }
  }

  animate(): void {
    if (!this.isRunning) return;
    this.update();
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.animate();
  }

  stop(): void {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  setupEventListeners(): void {
    window.addEventListener('resize', this.handleResize);
    this.canvas.addEventListener('mousemove', this.handleMouseMove);
    this.canvas.addEventListener('mouseleave', this.handleMouseLeave);
    this.canvas.addEventListener('mousedown', this.handleMouseDown);
    window.addEventListener('mouseup', this.handleMouseUp);
  }

  removeEventListeners(): void {
    window.removeEventListener('resize', this.handleResize);
    this.canvas.removeEventListener('mousemove', this.handleMouseMove);
    this.canvas.removeEventListener('mouseleave', this.handleMouseLeave);
    this.canvas.removeEventListener('mousedown', this.handleMouseDown);
    window.removeEventListener('mouseup', this.handleMouseUp);
  }

  handleResize(): void {
    this.resize();
  }

  handleMouseMove(e: MouseEvent): void {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = (e.clientX - rect.left) * this.DPR;
    this.mouse.y = (e.clientY - rect.top) * this.DPR;
  }

  handleMouseLeave(): void {
    this.mouse.x = this.mouse.y = 0;
  }

  handleMouseDown(): void {
    this.mouse.down = true;
  }

  handleMouseUp(): void {
    this.mouse.down = false;
  }

  // 설정 업데이트
  updateConfig(newConfig: Partial<TextToParticleOptions>): void {
    // 디바운스 적용
    this._debouncedUpdateConfig(newConfig);
  }

  _updateConfigInternal(newConfig: Partial<TextToParticleOptions>): void {
    this.config = { ...this.config, ...newConfig };
    if (newConfig.text) {
      this.buildTargets();
    }
  }

  // 파괴 및 정리
  destroy(): void {
    this.stop();
    this.removeEventListeners();
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
      this.intersectionObserver = null;
    }
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }
}

// Named export (tree-shaking 지원)
export { TextToParticle };

// 기본 export
export default TextToParticle;
