/**
 * Typing - 타이핑 애니메이션 효과
 * 바닐라 JS 코어 클래스
 * 
 * 사용법:
 * import { Typing } from 'masoneffect/typing';
 */

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

// 텍스트를 타이핑 단위로 분해 (한글은 자음/모음, 나머지는 글자 단위)
function decomposeText(text: string): string[] {
  const units: string[] = [];
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const code = char.charCodeAt(0);
    
    // 한글 유니코드 범위
    if (code >= 0xAC00 && code <= 0xD7A3) {
      // 한글은 자음/모음으로 분해
      const decomposed = decomposeHangul(char);
      units.push(...decomposed);
    } else {
      // 한글이 아니면 한 글자씩
      units.push(char);
    }
  }
  
  return units;
}

export class Typing {
  container: HTMLElement;
  config: Required<Omit<TypingOptions, 'onUpdate' | 'onComplete'>> & {
    onUpdate: TypingOptions['onUpdate'];
    onComplete: TypingOptions['onComplete'];
  };
  textUnits: string[]; // 타이핑할 단위들 (한글은 자음/모음, 나머지는 글자)
  currentIndex: number;
  displayedText: string; // 현재 표시된 텍스트
  timeoutId: ReturnType<typeof setTimeout> | null;
  intersectionObserver: IntersectionObserver | null;
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
    this.textUnits = decomposeText(this.config.text);
    
    // 원본 텍스트 구조 초기화
    this.originalChars = [];
    this.charUnitMap = [];
    this.initializeTextStructure();
    
    // 상태
    this.currentIndex = 0;
    this.displayedText = '';
    this.timeoutId = null;
    this.intersectionObserver = null;
    this.isRunning = false;
    this.hasTriggered = false;

    // 초기화
    this.init();
  }

  init(): void {
    // 초기 상태 표시 (빈 텍스트 또는 커서만)
    this.updateDisplay('');

    // IntersectionObserver 설정
    this.setupIntersectionObserver();
  }

  setupIntersectionObserver(): void {
    // IntersectionObserver가 지원되지 않는 환경에서는 즉시 시작
    if (typeof window === 'undefined' || typeof window.IntersectionObserver === 'undefined') {
      if (this.config.enabled) {
        setTimeout(() => this.start(), this.config.delay);
      }
      return;
    }

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target !== this.container) continue;

          if (entry.isIntersecting && !this.hasTriggered) {
            if (this.config.enabled) {
              setTimeout(() => this.start(), this.config.delay);
            }
            this.hasTriggered = true;

            if (this.config.triggerOnce) {
              this.intersectionObserver?.disconnect();
            }
          }
        }
      },
      {
        threshold: this.config.threshold,
        rootMargin: this.config.rootMargin,
      }
    );

    this.intersectionObserver.observe(this.container);
  }

  // 단위들을 다시 합쳐서 실제 표시할 텍스트 생성
  // 원본 텍스트를 글자 단위로 분해하고, 각 글자의 타이핑 단위 정보를 저장
  private originalChars: string[] = []; // 원본 텍스트의 글자 배열
  private charUnitMap: number[] = []; // 각 글자에 해당하는 단위 개수

  private initializeTextStructure(): void {
    this.originalChars = [];
    this.charUnitMap = [];
    
    for (let i = 0; i < this.originalText.length; i++) {
      const char = this.originalText[i];
      const code = char.charCodeAt(0);
      
      this.originalChars.push(char);
      
      // 한글인 경우 자음/모음 개수, 아니면 1
      if (code >= 0xAC00 && code <= 0xD7A3) {
        const decomposed = decomposeHangul(char);
        this.charUnitMap.push(decomposed.length);
      } else {
        this.charUnitMap.push(1);
      }
    }
  }

  // 단위 인덱스를 원본 텍스트의 글자 인덱스로 변환
  // unitIndex: 현재까지 입력된 단위 개수 (0부터 시작)
  // 반환: 표시할 글자 개수 (0부터 시작, exclusive)
  private getCharIndexFromUnitIndex(unitIndex: number): number {
    if (unitIndex === 0) return 0;
    
    let charIndex = 0;
    let currentUnits = 0;
    
    for (let i = 0; i < this.charUnitMap.length; i++) {
      const unitsForChar = this.charUnitMap[i];
      currentUnits += unitsForChar;
      
      // 현재 글자의 모든 단위가 입력되었는지 확인
      if (unitIndex >= currentUnits) {
        charIndex = i + 1; // 이 글자는 완전히 입력됨
      } else {
        // 현재 글자의 일부만 입력됨
        // 한글의 경우 초성+중성까지 입력되면 표시, 아니면 표시 안 함
        // 영문/숫자의 경우 첫 단위만 입력되면 표시
        const unitsEntered = unitIndex - (currentUnits - unitsForChar);
        if (unitsEntered > 0) {
          // 한글의 경우 최소 2개 단위(초성+중성)가 필요, 영문은 1개
          const isHangul = this.originalChars[i] && 
            this.originalChars[i].charCodeAt(0) >= 0xAC00 && 
            this.originalChars[i].charCodeAt(0) <= 0xD7A3;
          if (isHangul && unitsEntered >= 2) {
            charIndex = i + 1; // 초성+중성까지 입력되면 표시
          } else if (!isHangul && unitsEntered >= 1) {
            charIndex = i + 1; // 영문/숫자는 첫 단위만 입력되면 표시
          }
        }
        break;
      }
    }
    
    return charIndex;
  }

  // 단위들을 다시 합쳐서 실제 표시할 텍스트 생성
  private buildTextFromUnits(units: string[]): string {
    if (units.length === 0) return '';
    
    const charIndex = this.getCharIndexFromUnitIndex(units.length);
    return this.originalText.substring(0, charIndex);
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
    const unitsToShow = this.textUnits.slice(0, this.currentIndex + 1);
    this.displayedText = this.buildTextFromUnits(unitsToShow);
    
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
    this.textUnits = decomposeText(newText);
    this.initializeTextStructure();
    this.reset();
    
    if (this.config.enabled) {
      setTimeout(() => this.start(), this.config.delay);
    }
  }

  destroy(): void {
    this.stop();
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
      this.intersectionObserver = null;
    }
  }
}

// 기본 export
export default Typing;

