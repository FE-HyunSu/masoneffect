/**
 * MasonEffect 타입 정의
 */

export interface MasonEffectOptions {
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
  onReady?: (instance: MasonEffect) => void;
  onUpdate?: (instance: MasonEffect) => void;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  tx: number;
  ty: number;
  j: number;
}

export class MasonEffect {
  constructor(container: HTMLElement | string, options?: MasonEffectOptions);
  
  config: MasonEffectOptions;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  particles: Particle[];
  mouse: { x: number; y: number; down: boolean };
  isRunning: boolean;

  init(): void;
  resize(): void;
  buildTargets(): void;
  makeParticle(): Particle;
  initParticles(): void;
  scatter(): void;
  morph(textOrOptions?: string | Partial<MasonEffectOptions>): void;
  update(): void;
  animate(): void;
  start(): void;
  stop(): void;
  updateConfig(newConfig: Partial<MasonEffectOptions>): void;
  destroy(): void;
}

export default MasonEffect;

