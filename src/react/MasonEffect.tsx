import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { MasonEffect } from '../core/index.js';

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

export interface MasonEffectRef {
  morph: (textOrOptions?: string | Partial<MasonEffectOptions>) => void;
  scatter: () => void;
  updateConfig: (config: Partial<MasonEffectOptions>) => void;
  destroy: () => void;
}

interface MasonEffectProps extends MasonEffectOptions {
  className?: string;
  style?: React.CSSProperties;
}

const MasonEffectComponent = forwardRef<MasonEffectRef, MasonEffectProps>(
  (props, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const instanceRef = useRef<MasonEffect | null>(null);

    useEffect(() => {
      if (!containerRef.current) return;

      let resizeObserver: ResizeObserver | null = null;
      let initTimeout: number | null = null;

      // 컨테이너가 실제 크기를 가지도록 대기
      const initEffect = () => {
        const container = containerRef.current;
        if (!container) return;

        // 컨테이너 크기가 0이면 다음 프레임에 다시 시도
        const rect = container.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) {
          initTimeout = window.setTimeout(initEffect, 50);
          return;
        }

        const {
          className,
          style,
          text,
          densityStep,
          maxParticles,
          pointSize,
          ease,
          repelRadius,
          repelStrength,
          particleColor,
          fontFamily,
          fontSize,
          width,
          height,
          devicePixelRatio,
          onReady,
          onUpdate,
        } = props;

        const options: MasonEffectOptions = {
          text,
          densityStep,
          maxParticles,
          pointSize,
          ease,
          repelRadius,
          repelStrength,
          particleColor,
          fontFamily,
          fontSize,
          width,
          height,
          devicePixelRatio,
          onReady,
          onUpdate,
        };

        instanceRef.current = new MasonEffect(container, options);

        // ResizeObserver로 컨테이너 크기 변경 감지
        if (typeof ResizeObserver !== 'undefined') {
          resizeObserver = new ResizeObserver(() => {
            if (instanceRef.current) {
              instanceRef.current.resize();
            }
          });
          resizeObserver.observe(container);
        }
      };

      // 다음 프레임에 초기화 (DOM이 완전히 렌더링된 후)
      requestAnimationFrame(initEffect);

      return () => {
        if (initTimeout) {
          clearTimeout(initTimeout);
        }
        if (resizeObserver) {
          resizeObserver.disconnect();
        }
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
        densityStep,
        maxParticles,
        pointSize,
        ease,
        repelRadius,
        repelStrength,
        particleColor,
        fontFamily,
        fontSize,
        width,
        height,
        devicePixelRatio,
      } = props;

      instanceRef.current.updateConfig({
        text,
        densityStep,
        maxParticles,
        pointSize,
        ease,
        repelRadius,
        repelStrength,
        particleColor,
        fontFamily,
        fontSize,
        width,
        height,
        devicePixelRatio,
      });
    }, [
      props.text,
      props.densityStep,
      props.maxParticles,
      props.pointSize,
      props.ease,
      props.repelRadius,
      props.repelStrength,
      props.particleColor,
      props.fontFamily,
      props.fontSize,
      props.width,
      props.height,
      props.devicePixelRatio,
    ]);

    useImperativeHandle(ref, () => ({
      morph: (textOrOptions?: string | Partial<MasonEffectOptions>) => {
        instanceRef.current?.morph(textOrOptions);
      },
      scatter: () => {
        instanceRef.current?.scatter();
      },
      updateConfig: (config: Partial<MasonEffectOptions>) => {
        instanceRef.current?.updateConfig(config);
      },
      destroy: () => {
        instanceRef.current?.destroy();
        instanceRef.current = null;
      },
    }));

    // 기본 스타일: 컨테이너가 크기를 가지도록 함
    const defaultStyle: React.CSSProperties = {
      width: '100%',
      height: '100%',
      minHeight: props.height || 400,
      position: 'relative',
      ...props.style,
    };

    return (
      <div
        ref={containerRef}
        className={props.className}
        style={defaultStyle}
      />
    );
  }
);

MasonEffectComponent.displayName = 'MasonEffect';

export default MasonEffectComponent;

