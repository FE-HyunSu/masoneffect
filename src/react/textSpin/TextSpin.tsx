import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { TextSpin } from '../../core/textSpin/index.js';
import type { TextSpinOptions } from '../../core/textSpin/index.js';

export interface TextSpinRef {
  start: () => void;
  stop: () => void;
  reset: () => void;
  updateText: (text: string) => void;
  updateConfig: (config: Partial<TextSpinOptions>) => void;
  destroy: () => void;
}

interface TextSpinProps extends Omit<TextSpinOptions, 'onStart' | 'onComplete'> {
  className?: string;
  style?: React.CSSProperties;
  onStart?: () => void;
  onComplete?: () => void;
}

const TextSpinComponent = forwardRef<TextSpinRef, TextSpinProps>(
  (props, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const instanceRef = useRef<TextSpin | null>(null);

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
        delay,
        duration,
        randomDelay,
        threshold,
        rootMargin,
        root,
        triggerOnce,
        enabled,
        onStart,
        onComplete,
      } = props;

      const options: TextSpinOptions = {
        text,
        delay,
        duration,
        randomDelay,
        threshold,
        rootMargin,
        root,
        triggerOnce,
        enabled,
        onStart,
        onComplete,
      };

      instanceRef.current = new TextSpin(containerRef.current, options);

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
        delay,
        duration,
        randomDelay,
        threshold,
        rootMargin,
        root,
        triggerOnce,
        enabled,
        onStart,
        onComplete,
      } = props;

      instanceRef.current.updateConfig({
        text,
        delay,
        duration,
        randomDelay,
        threshold,
        rootMargin,
        root,
        triggerOnce,
        enabled,
        onStart,
        onComplete,
      });
    }, [
      props.text,
      props.delay,
      props.duration,
      props.randomDelay,
      props.threshold,
      props.rootMargin,
      props.root,
      props.triggerOnce,
      props.enabled,
      props.onStart,
      props.onComplete,
    ]);

    useImperativeHandle(ref, () => ({
      start: () => {
        if (!instanceRef.current) {
          console.warn('TextSpin: 인스턴스가 아직 초기화되지 않았습니다.');
          return;
        }
        instanceRef.current.start();
      },
      stop: () => {
        if (!instanceRef.current) {
          console.warn('TextSpin: 인스턴스가 아직 초기화되지 않았습니다.');
          return;
        }
        instanceRef.current.stop();
      },
      reset: () => {
        if (!instanceRef.current) {
          console.warn('TextSpin: 인스턴스가 아직 초기화되지 않았습니다.');
          return;
        }
        instanceRef.current.reset();
      },
      updateText: (text: string) => {
        if (!instanceRef.current) {
          console.warn('TextSpin: 인스턴스가 아직 초기화되지 않았습니다.');
          return;
        }
        instanceRef.current.updateText(text);
      },
      updateConfig: (config: Partial<TextSpinOptions>) => {
        if (!instanceRef.current) {
          console.warn('TextSpin: 인스턴스가 아직 초기화되지 않았습니다.');
          return;
        }
        instanceRef.current.updateConfig(config);
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

TextSpinComponent.displayName = 'TextSpin';

export default TextSpinComponent;

