import React, { useEffect, useRef } from 'react';
import { Count } from '../../core/count/index.js';
import type { CountOptions } from '../../core/count/index.js';

export interface CountRef {
  start: () => void;
  stop: () => void;
  reset: () => void;
  getValue: () => number;
  updateConfig: (config: Partial<CountOptions>) => void;
  destroy: () => void;
}

interface CountProps extends Omit<CountOptions, 'onUpdate' | 'onComplete'> {
  className?: string;
  style?: React.CSSProperties;
  onUpdate?: (value: number) => void;
  onComplete?: () => void;
}

const CountComponent = React.forwardRef<CountRef, CountProps>(
  (props, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const instanceRef = useRef<Count | null>(null);

    useEffect(() => {
      if (!containerRef.current) return;

      // 이미 인스턴스가 있으면 생성하지 않음 (React Strict Mode 대응)
      if (instanceRef.current) {
        return;
      }

      const {
        className,
        style,
        targetValue,
        duration,
        startValue,
        enabled,
        easing,
        threshold,
        rootMargin,
        triggerOnce,
        onUpdate,
        onComplete,
      } = props;

      const options: CountOptions = {
        targetValue,
        duration,
        startValue,
        enabled,
        easing,
        threshold,
        rootMargin,
        triggerOnce,
        onUpdate,
        onComplete,
      };

      instanceRef.current = new Count(containerRef.current, options);

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
        targetValue,
        duration,
        startValue,
        enabled,
        easing,
        threshold,
        rootMargin,
        triggerOnce,
        onUpdate,
        onComplete,
      } = props;

      instanceRef.current.updateConfig({
        targetValue,
        duration,
        startValue,
        enabled,
        easing,
        threshold,
        rootMargin,
        triggerOnce,
        onUpdate,
        onComplete,
      });
    }, [
      props.targetValue,
      props.duration,
      props.startValue,
      props.enabled,
      props.easing,
      props.threshold,
      props.rootMargin,
      props.triggerOnce,
      props.onUpdate,
      props.onComplete,
    ]);

    React.useImperativeHandle(ref, () => ({
      start: () => {
        if (!instanceRef.current) {
          console.warn('Count: 인스턴스가 아직 초기화되지 않았습니다.');
          return;
        }
        instanceRef.current.start();
      },
      stop: () => {
        if (!instanceRef.current) {
          console.warn('Count: 인스턴스가 아직 초기화되지 않았습니다.');
          return;
        }
        instanceRef.current.stop();
      },
      reset: () => {
        if (!instanceRef.current) {
          console.warn('Count: 인스턴스가 아직 초기화되지 않았습니다.');
          return;
        }
        instanceRef.current.reset();
      },
      getValue: () => {
        if (!instanceRef.current) {
          console.warn('Count: 인스턴스가 아직 초기화되지 않았습니다.');
          return 0;
        }
        return instanceRef.current.getValue();
      },
      updateConfig: (config: Partial<CountOptions>) => {
        if (!instanceRef.current) {
          console.warn('Count: 인스턴스가 아직 초기화되지 않았습니다.');
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

CountComponent.displayName = 'Count';

export default CountComponent;

