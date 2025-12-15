/**
 * Typing - 타이핑 애니메이션 효과
 * 바닐라 JS 코어 클래스
 * 
 * 사용법:
 * import { Typing } from 'masoneffect/typing';
 */

import { VisibilityManager } from '../utils/visibilityManager.js';

export interface TypingOptions {
  text: string;
  speed?: number; // 타이핑 속도 (ms per character)
  delay?: number; // 시작 전 딜레이 (ms)
  enabled?: boolean;
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  showCursor?: boolean; // 커서 표시 여부
  cursorChar?: string; // 커서 문자
  onUpdate?: (text: string) => void;
  onComplete?: () => void;
}

// 한글 자음/모음 분리 함수
function decomposeHangul(char: string): string[] {
  const code = char.charCodeAt(0);
  
  // 한글 유니코드 범위: 0xAC00 ~ 0xD7A3
  if (code < 0xAC00 || code > 0xD7A3) {
    return [char]; // 한글이 아니면 그대로 반환
  }

  const base = code - 0xAC00;
  const initial = Math.floor(base / (21 * 28)); // 초성
  const medial = Math.floor((base % (21 * 28)) / 28); // 중성
  const final = base % 28; // 종성

  const initialChars = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
  const medialChars = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'];
  const finalChars = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];

  const result: string[] = [];
  
  // 초성
  result.push(initialChars[initial]);
  
  // 중성
  result.push(medialChars[medial]);
  
  // 종성이 있으면 추가
  if (final > 0) {
    result.push(finalChars[final]);
  }

  return result;
}

// 한글 자음/모음 합성 함수
function composeHangul(initial: string, medial: string, final?: string): string {
  const initialChars = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
  const medialChars = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'];
  const finalChars = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];

  const initialIndex = initialChars.indexOf(initial);
  const medialIndex = medialChars.indexOf(medial);
  const finalIndex = final ? finalChars.indexOf(final) : 0;

  if (initialIndex === -1 || medialIndex === -1) {
    return initial + (medial || '') + (final || '');
  }

  const code = 0xAC00 + (initialIndex * 21 * 28) + (medialIndex * 28) + finalIndex;
  return String.fromCharCode(code);
}

// 텍스트를 타이핑 단위로 분해 (한글은 자음/모음, 나머지는 글자 단위)
// 각 글자에 대한 단위 정보도 함께 반환
function decomposeText(text: string): { units: string[]; charUnitRanges: Array<{ start: number; end: number; isHangul: boolean }> } {
  const units: string[] = [];
  const charUnitRanges: Array<{ start: number; end: number; isHangul: boolean }> = [];
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const code = char.charCodeAt(0);
    const startIndex = units.length;
    
    // 한글 유니코드 범위
    if (code >= 0xAC00 && code <= 0xD7A3) {
      // 한글은 자음/모음으로 분해
      const decomposed = decomposeHangul(char);
      units.push(...decomposed);
      charUnitRanges.push({
        start: startIndex,
        end: units.length,
        isHangul: true
      });
    } else {
      // 한글이 아니면 한 글자씩
      units.push(char);
      charUnitRanges.push({
        start: startIndex,
        end: units.length,
        isHangul: false
      });
    }
  }
  
  return { units, charUnitRanges };
}

export class Typing {
  container: HTMLElement;
  config: Required<Omit<TypingOptions, 'onUpdate' | 'onComplete'>> & {
    onUpdate: TypingOptions['onUpdate'];
    onComplete: TypingOptions['onComplete'];
  };
  textUnits: string[]; // 타이핑할 단위들 (한글은 자음/모음, 나머지는 글자)
  charUnitRanges: Array<{ start: number; end: number; isHangul: boolean }>; // 각 글자의 단위 범위
  currentIndex: number;
  displayedText: string; // 현재 표시된 텍스트
  timeoutId: ReturnType<typeof setTimeout> | null;
  visibilityManager: VisibilityManager | null;
  isRunning: boolean;
  hasTriggered: boolean;
  originalText: string; // 원본 텍스트

  constructor(container: HTMLElement | string, options: TypingOptions) {
    // 컨테이너 요소
    this.container = typeof container === 'string' 
      ? document.querySelector(container) as HTMLElement
      : container;
    
    if (!this.container) {
      throw new Error('Container element not found');
    }

    // 원본 텍스트 저장
    this.originalText = options.text;

    // 설정값들
    this.config = {
      text: options.text,
      speed: options.speed ?? 50,
      delay: options.delay ?? 0,
      enabled: options.enabled ?? true,
      threshold: options.threshold ?? 0.2,
      rootMargin: options.rootMargin ?? '0px 0px -100px 0px',
      triggerOnce: options.triggerOnce ?? false,
      showCursor: options.showCursor ?? true,
      cursorChar: options.cursorChar ?? '|',
      onUpdate: options.onUpdate || null,
      onComplete: options.onComplete || null,
    };

    // 텍스트를 타이핑 단위로 분해
    const decomposed = decomposeText(this.config.text);
    this.textUnits = decomposed.units;
    this.charUnitRanges = decomposed.charUnitRanges;
    
    // 상태
    this.currentIndex = 0;
    this.displayedText = '';
    this.timeoutId = null;
    this.visibilityManager = null;
    this.isRunning = false;
    this.hasTriggered = false;

    // 초기화
    this.init();
  }

  init(): void {
    // 초기 상태 표시 (빈 텍스트 또는 커서만)
    this.updateDisplay('');

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
          setTimeout(() => this.start(), this.config.delay);
        }
      },
      onHidden: () => {
        // 요소가 화면에서 벗어났을 때는 아무 동작 안 함 (타이핑은 일시정지하지 않음)
      },
    });
  }

  // 단위들을 다시 합쳐서 실제 표시할 텍스트 생성
  // 한글의 경우 자음/모음이 하나씩 보이도록 합성
  private buildTextFromUnits(unitCount: number): string {
    if (unitCount === 0) return '';
    
    let result = '';
    
    // 각 글자별로 처리
    for (let charIndex = 0; charIndex < this.charUnitRanges.length; charIndex++) {
      const range = this.charUnitRanges[charIndex];
      
      // 이 글자의 단위 범위가 현재 unitCount를 넘어섰는지 확인
      if (range.start >= unitCount) {
        // 아직 이 글자까지 도달하지 않음
        break;
      }
      
      // 이 글자에 해당하는 단위 개수 계산
      const unitsEntered = Math.min(unitCount - range.start, range.end - range.start);
      
      if (unitsEntered <= 0) {
        // 이 글자의 단위가 하나도 입력되지 않음
        break;
      }
      
      if (range.isHangul) {
        // 한글의 경우: 자음/모음을 하나씩 합성
        const charUnits = this.textUnits.slice(range.start, range.start + unitsEntered);
        
        if (charUnits.length === 1) {
          // 초성만
          result += charUnits[0];
        } else if (charUnits.length === 2) {
          // 초성 + 중성
          result += composeHangul(charUnits[0], charUnits[1]);
        } else if (charUnits.length >= 3) {
          // 초성 + 중성 + 종성
          result += composeHangul(charUnits[0], charUnits[1], charUnits[2]);
        }
      } else {
        // 한글이 아닌 경우: 단위 그대로 표시 (1개만)
        if (unitsEntered > 0) {
          result += this.textUnits[range.start];
        }
      }
    }
    
    return result;
  }

  start(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.currentIndex = 0;
    this.displayedText = '';
    this.typeNext();
  }

  typeNext(): void {
    if (this.currentIndex >= this.textUnits.length) {
      // 타이핑 완료
      this.isRunning = false;
      
      // 커서 제거
      if (this.config.showCursor) {
        this.updateDisplay(this.originalText);
      }
      
      if (this.config.onComplete) {
        this.config.onComplete();
      }
      return;
    }

    // 다음 단위 추가
    this.displayedText = this.buildTextFromUnits(this.currentIndex + 1);
    
    // 커서 추가
    let displayText = this.displayedText;
    if (this.config.showCursor) {
      displayText += this.config.cursorChar;
    }
    
    this.updateDisplay(displayText);

    if (this.config.onUpdate) {
      this.config.onUpdate(this.displayedText);
    }

    this.currentIndex++;
    
    // 다음 타이핑 스케줄
    this.timeoutId = setTimeout(() => {
      this.typeNext();
    }, this.config.speed);
  }

  stop(): void {
    this.isRunning = false;
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  reset(): void {
    this.stop();
    this.currentIndex = 0;
    this.displayedText = '';
    this.hasTriggered = false;
    this.updateDisplay('');
  }

  updateDisplay(text: string): void {
    this.container.textContent = text;
  }

  // 텍스트 변경
  setText(newText: string): void {
    this.originalText = newText;
    this.config.text = newText;
    const decomposed = decomposeText(newText);
    this.textUnits = decomposed.units;
    this.charUnitRanges = decomposed.charUnitRanges;
    this.reset();
    
    if (this.config.enabled) {
      setTimeout(() => this.start(), this.config.delay);
    }
  }

  destroy(): void {
    this.stop();
    if (this.visibilityManager) {
      this.visibilityManager.destroy();
      this.visibilityManager = null;
    }
  }
}

// 기본 export
export default Typing;

