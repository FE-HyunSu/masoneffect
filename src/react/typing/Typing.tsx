import React, { useEffect, useRef } from 'react';
import { Typing } from '../../core/typing/index.js';
import type { TypingOptions } from '../../core/typing/index.js';

export interface TypingRef {
  start: () => void;
  stop: () => void;
  reset: () => void;
  setText: (text: string) => void;
  destroy: () => void;
}

interface TypingProps extends Omit<TypingOptions, 'onUpdate' | 'onComplete'> {
  className?: string;
  style?: React.CSSProperties;
  onUpdate?: (text: string) => void;
  onComplete?: () => void;
}

const TypingComponent = React.forwardRef<TypingRef, TypingProps>(
  (props, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const instanceRef = useRef<Typing | null>(null);

    useEffect(() => {
      if (!containerRef.current) return;

      // 이미 인스턴스가 있으면 생성하지 않음 (React Strict Mode 대응)
      if (instanceRef.current) {
        return;
      }

      const {
        className,
        style,
        text,
        speed,
        delay,
        enabled,
        threshold,
        rootMargin,
        triggerOnce,
        showCursor,
        cursorChar,
        onUpdate,
        onComplete,
      } = props;

      const options: TypingOptions = {
        text,
        speed,
        delay,
        enabled,
        threshold,
        rootMargin,
        triggerOnce,
        showCursor,
        cursorChar,
        onUpdate,
        onComplete,
      };

      instanceRef.current = new Typing(containerRef.current, options);

      return () => {
        if (instanceRef.current) {
          instanceRef.current.destroy();
          instanceRef.current = null;
        }
      };
    }, []);

    // props 변경 시 설정 업데이트
    useEffect(() => {
      if (!instanceRef.current) return;

      const {
        text,
        speed,
        delay,
        enabled,
        threshold,
        rootMargin,
        triggerOnce,
        showCursor,
        cursorChar,
        onUpdate,
        onComplete,
      } = props;

      // text가 변경되면 setText 호출
      if (text !== undefined && text !== instanceRef.current['originalText']) {
        instanceRef.current.setText(text);
      }
    }, [
      props.text,
      props.speed,
      props.delay,
      props.enabled,
      props.threshold,
      props.rootMargin,
      props.triggerOnce,
      props.showCursor,
      props.cursorChar,
      props.onUpdate,
      props.onComplete,
    ]);

    React.useImperativeHandle(ref, () => ({
      start: () => {
        if (!instanceRef.current) {
          console.warn('Typing: 인스턴스가 아직 초기화되지 않았습니다.');
          return;
        }
        instanceRef.current.start();
      },
      stop: () => {
        if (!instanceRef.current) {
          console.warn('Typing: 인스턴스가 아직 초기화되지 않았습니다.');
          return;
        }
        instanceRef.current.stop();
      },
      reset: () => {
        if (!instanceRef.current) {
          console.warn('Typing: 인스턴스가 아직 초기화되지 않았습니다.');
          return;
        }
        instanceRef.current.reset();
      },
      setText: (text: string) => {
        if (!instanceRef.current) {
          console.warn('Typing: 인스턴스가 아직 초기화되지 않았습니다.');
          return;
        }
        instanceRef.current.setText(text);
      },
      destroy: () => {
        if (instanceRef.current) {
          instanceRef.current.destroy();
          instanceRef.current = null;
        }
      },
    }));

    return (
      <div
        ref={containerRef}
        className={props.className}
        style={props.style}
      />
    );
  }
);

TypingComponent.displayName = 'Typing';

export default TypingComponent;

