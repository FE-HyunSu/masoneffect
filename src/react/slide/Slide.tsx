import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Slide } from '../../core/slide/index.js';
import type { SlideOptions } from '../../core/slide/index.js';

export interface SlideRef {
  start: () => void;
  stop: () => void;
  reset: () => void;
  updateConfig: (config: Partial<SlideOptions>) => void;
  destroy: () => void;
}

interface SlideProps extends Omit<SlideOptions, 'onStart' | 'onComplete'> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  onStart?: () => void;
  onComplete?: () => void;
}

const SlideComponent = forwardRef<SlideRef, SlideProps>(
  (props, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const instanceRef = useRef<Slide | null>(null);

    useEffect(() => {
      if (!containerRef.current) return;

      // 이미 인스턴스가 있으면 생성하지 않음 (React Strict Mode 대응)
      if (instanceRef.current) {
        return;
      }

      const {
        className,
        style,
        children,
        direction,
        distance,
        duration,
        easing,
        threshold,
        rootMargin,
        triggerOnce,
        enabled,
        onStart,
        onComplete,
      } = props;

      const options: SlideOptions = {
        direction,
        distance,
        duration,
        easing,
        threshold,
        rootMargin,
        triggerOnce,
        enabled,
        onStart,
        onComplete,
      };

      instanceRef.current = new Slide(containerRef.current, options);

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
        direction,
        distance,
        duration,
        easing,
        threshold,
        rootMargin,
        triggerOnce,
        enabled,
        onStart,
        onComplete,
      } = props;

      instanceRef.current.updateConfig({
        direction,
        distance,
        duration,
        easing,
        threshold,
        rootMargin,
        triggerOnce,
        enabled,
        onStart,
        onComplete,
      });
    }, [
      props.direction,
      props.distance,
      props.duration,
      props.easing,
      props.threshold,
      props.rootMargin,
      props.triggerOnce,
      props.enabled,
      props.onStart,
      props.onComplete,
    ]);

    useImperativeHandle(ref, () => ({
      start: () => {
        if (!instanceRef.current) {
          console.warn('Slide: 인스턴스가 아직 초기화되지 않았습니다.');
          return;
        }
        instanceRef.current.start();
      },
      stop: () => {
        if (!instanceRef.current) {
          console.warn('Slide: 인스턴스가 아직 초기화되지 않았습니다.');
          return;
        }
        instanceRef.current.stop();
      },
      reset: () => {
        if (!instanceRef.current) {
          console.warn('Slide: 인스턴스가 아직 초기화되지 않았습니다.');
          return;
        }
        instanceRef.current.reset();
      },
      updateConfig: (config: Partial<SlideOptions>) => {
        if (!instanceRef.current) {
          console.warn('Slide: 인스턴스가 아직 초기화되지 않았습니다.');
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
      >
        {props.children}
      </div>
    );
  }
);

SlideComponent.displayName = 'Slide';

export default SlideComponent;

