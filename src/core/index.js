/**
 * MasonEffect - 파티클 모핑 효과 라이브러리
 * 바닐라 JS 코어 클래스
 */

export class MasonEffect {
  constructor(container, options = {}) {
    // 컨테이너 요소
    this.container = typeof container === 'string' 
      ? document.querySelector(container) 
      : container;
    
    if (!this.container) {
      throw new Error('Container element not found');
    }

    // 설정값들
    this.config = {
      text: options.text || 'mason crawler',
      densityStep: options.densityStep ?? 2,
      maxParticles: options.maxParticles ?? 3200,
      pointSize: options.pointSize ?? 0.5,
      ease: options.ease ?? 0.05,
      repelRadius: options.repelRadius ?? 150,
      repelStrength: options.repelStrength ?? 1,
      particleColor: options.particleColor || '#fff',
      fontFamily: options.fontFamily || 'Inter, system-ui, Arial',
      fontSize: options.fontSize || null, // null이면 자동 계산
      width: options.width || null, // null이면 컨테이너 크기
      height: options.height || null, // null이면 컨테이너 크기
      devicePixelRatio: options.devicePixelRatio ?? null, // null이면 자동
      onReady: options.onReady || null,
      onUpdate: options.onUpdate || null,
    };

    // 캔버스 생성
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.container.appendChild(this.canvas);
    this.canvas.style.display = 'block';

    // 오프스크린 캔버스 (텍스트 렌더링용)
    this.offCanvas = document.createElement('canvas');
    this.offCtx = this.offCanvas.getContext('2d');

    // 상태
    this.W = 0;
    this.H = 0;
    this.DPR = this.config.devicePixelRatio || Math.min(window.devicePixelRatio || 1, 1.8);
    this.particles = [];
    this.mouse = { x: 0, y: 0, down: false };
    this.animationId = null;
    this.isRunning = false;

    // 이벤트 핸들러 바인딩
    this.handleResize = this.handleResize.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);

    // 초기화
    this.init();
  }

  init() {
    this.resize();
    this.setupEventListeners();
    this.start();
    
    if (this.config.onReady) {
      this.config.onReady(this);
    }
  }

  resize() {
    const width = this.config.width || this.container.clientWidth || window.innerWidth;
    const height = this.config.height || this.container.clientHeight || window.innerHeight * 0.7;
    
    this.W = Math.floor(width * this.DPR);
    this.H = Math.floor(height * this.DPR);
    
    this.canvas.width = this.W;
    this.canvas.height = this.H;
    this.canvas.style.width = width + 'px';
    this.canvas.style.height = height + 'px';

    this.buildTargets();
    if (!this.particles.length) {
      this.initParticles();
    }
  }

  buildTargets() {
    const text = this.config.text;
    this.offCanvas.width = this.W;
    this.offCanvas.height = this.H;
    this.offCtx.clearRect(0, 0, this.offCanvas.width, this.offCanvas.height);

    const base = Math.min(this.W, this.H);
    const fontSize = this.config.fontSize || Math.max(80, Math.floor(base * 0.18));
    this.offCtx.fillStyle = '#ffffff';
    this.offCtx.textAlign = 'center';
    this.offCtx.textBaseline = 'middle';
    this.offCtx.font = `400 ${fontSize}px ${this.config.fontFamily}`;

    // 글자 간격 계산 및 그리기
    const chars = text.split('');
    const spacing = fontSize * 0.05;
    const totalWidth = this.offCtx.measureText(text).width + spacing * (chars.length - 1);
    let x = this.W / 2 - totalWidth / 2;
    
    for (const ch of chars) {
      this.offCtx.fillText(ch, x + this.offCtx.measureText(ch).width / 2, this.H / 2);
      x += this.offCtx.measureText(ch).width + spacing;
    }

    // 픽셀 샘플링
    const step = Math.max(2, this.config.densityStep);
    const img = this.offCtx.getImageData(0, 0, this.W, this.H).data;
    const targets = [];
    
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

  makeParticle() {
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
      j: Math.random() * Math.PI * 2,
    };
  }

  initParticles() {
    // 캔버스 전체에 골고루 분포 (여백 없이)
    for (const p of this.particles) {
      p.x = Math.random() * this.W;
      p.y = Math.random() * this.H;
      p.vx = p.vy = 0;
    }
  }

  scatter() {
    // W와 H가 0이면 resize 먼저 실행
    if (this.W === 0 || this.H === 0) {
      this.resize();
    }
    
    // resize 후에도 W와 H가 0이면 실제 캔버스 크기 사용
    const canvasWidth = this.W > 0 ? this.W : this.canvas.width;
    const canvasHeight = this.H > 0 ? this.H : this.canvas.height;
    
    // 정확한 중앙 좌표
    const centerX = canvasWidth * 0.5;
    const centerY = canvasHeight * 0.5;
    
    // 화면 가득하게 퍼지도록 대각선 길이를 사용
    // 중앙에서 가장 먼 모서리까지의 거리를 최대 반경으로 사용
    const diagonal = Math.sqrt(canvasWidth * canvasWidth + canvasHeight * canvasHeight);
    const maxRadius = diagonal * 0.5;
    
    for (const p of this.particles) {
      // 랜덤 각도 (0 ~ 2π) - 완전한 원형으로 퍼짐
      const angle = Math.random() * Math.PI * 2;
      // 랜덤 거리 (0 ~ 최대 반경) - 중앙에서 가장 먼 모서리까지
      const radius = Math.random() * maxRadius;
      
      // 중앙에서 방사형으로 목표 위치 계산
      const targetX = centerX + Math.cos(angle) * radius;
      const targetY = centerY + Math.sin(angle) * radius;
      
      // 캔버스 경계 내로 제한 (화면 밖으로 나가지 않도록)
      p.tx = Math.max(0, Math.min(canvasWidth - 1, targetX));
      p.ty = Math.max(0, Math.min(canvasHeight - 1, targetY));
    }
  }

  morph(textOrOptions = null) {
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

  update() {
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

  animate() {
    if (!this.isRunning) return;
    this.update();
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.animate();
  }

  stop() {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  setupEventListeners() {
    window.addEventListener('resize', this.handleResize);
    this.canvas.addEventListener('mousemove', this.handleMouseMove);
    this.canvas.addEventListener('mouseleave', this.handleMouseLeave);
    this.canvas.addEventListener('mousedown', this.handleMouseDown);
    window.addEventListener('mouseup', this.handleMouseUp);
  }

  removeEventListeners() {
    window.removeEventListener('resize', this.handleResize);
    this.canvas.removeEventListener('mousemove', this.handleMouseMove);
    this.canvas.removeEventListener('mouseleave', this.handleMouseLeave);
    this.canvas.removeEventListener('mousedown', this.handleMouseDown);
    window.removeEventListener('mouseup', this.handleMouseUp);
  }

  handleResize() {
    this.resize();
  }

  handleMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = (e.clientX - rect.left) * this.DPR;
    this.mouse.y = (e.clientY - rect.top) * this.DPR;
  }

  handleMouseLeave() {
    this.mouse.x = this.mouse.y = 0;
  }

  handleMouseDown() {
    this.mouse.down = true;
  }

  handleMouseUp() {
    this.mouse.down = false;
  }

  // 설정 업데이트
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    if (newConfig.text) {
      this.buildTargets();
    }
  }

  // 파괴 및 정리
  destroy() {
    this.stop();
    this.removeEventListeners();
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }
}

// 기본 export
export default MasonEffect;

