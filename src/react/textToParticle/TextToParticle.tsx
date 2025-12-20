import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { TextToParticle } from '../../core/index.js';
import type { TextToParticleOptions } from '../../core/index.js';

export interface TextToParticleRef {
  morph: (textOrOptions?: string | Partial<TextToParticleOptions>) => void;
  scatter: () => void;
  updateConfig: (config: Partial<TextToParticleOptions>) => void;
  destroy: () => void;
}

interface TextToParticleProps extends TextToParticleOptions {
  className?: string;
  style?: React.CSSProperties;
}

const TextToParticleComponent = forwardRef<TextToParticleRef, TextToParticleProps>(
  (props, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const instanceRef = useRef<TextToParticle | null>(null);

    useEffect(() => {
      if (!containerRef.current) return;

      let resizeObserver: ResizeObserver | null = null;
      let tempResizeObserver: ResizeObserver | null = null;
      let initTimeout: number | null = null;

      // 컨테이너가 실제 크기를 가지도록 대기
      const initEffect = () => {
        const container = containerRef.current;
        if (!container) return;

        // 이미 인스턴스가 있으면 생성하지 않음 (React Strict Mode 대응)
        if (instanceRef.current) {
          return;
        }

        // 컨테이너에 이미 canvas가 있으면 제거 (중복 방지)
        const existingCanvas = container.querySelector('canvas');
        if (existingCanvas) {
          existingCanvas.remove();
        }

        // 컨테이너 크기 확인 (getBoundingClientRect 사용)
        const rect = container.getBoundingClientRect();
        const hasValidSize = rect.width > 0 && rect.height > 0;
        
        // 크기가 없으면 ResizeObserver로 대기하거나 재시도
        if (!hasValidSize) {
          // ResizeObserver가 있으면 그것을 사용, 없으면 재시도
          if (typeof ResizeObserver !== 'undefined') {
            let resizeCheckCount = 0;
            const maxResizeChecks = 20; // 최대 1초 대기 (50ms * 20)
            
            // 기존 tempResizeObserver가 있으면 정리
            if (tempResizeObserver) {
              tempResizeObserver.disconnect();
              tempResizeObserver = null;
            }
            
            tempResizeObserver = new ResizeObserver(() => {
              resizeCheckCount++;
              const newRect = container.getBoundingClientRect();
              if (newRect.width > 0 && newRect.height > 0) {
                if (tempResizeObserver) {
                  tempResizeObserver.disconnect();
                  tempResizeObserver = null;
                }
                initEffect();
              } else if (resizeCheckCount >= maxResizeChecks) {
                // 최대 대기 시간 초과 시 fallback으로 진행
                if (tempResizeObserver) {
                  tempResizeObserver.disconnect();
                  tempResizeObserver = null;
                }
                initEffect();
              }
            });
            tempResizeObserver.observe(container);
            return;
          } else {
            // ResizeObserver가 없으면 재시도
            initTimeout = window.setTimeout(initEffect, 50);
            return;
          }
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

        const options: TextToParticleOptions = {
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

        instanceRef.current = new TextToParticle(container, options);

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
        // cleanup: 모든 리소스 정리
        if (initTimeout) {
          clearTimeout(initTimeout);
          initTimeout = null;
        }
        if (tempResizeObserver) {
          tempResizeObserver.disconnect();
          tempResizeObserver = null;
        }
        if (resizeObserver) {
          resizeObserver.disconnect();
          resizeObserver = null;
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
      morph: (textOrOptions?: string | Partial<TextToParticleOptions>) => {
        if (!instanceRef.current) {
          console.warn('TextToParticle: 인스턴스가 아직 초기화되지 않았습니다.');
          return;
        }
        instanceRef.current.morph(textOrOptions);
      },
      scatter: () => {
        if (!instanceRef.current) {
          console.warn('TextToParticle: 인스턴스가 아직 초기화되지 않았습니다.');
          return;
        }
        instanceRef.current.scatter();
      },
      updateConfig: (config: Partial<TextToParticleOptions>) => {
        if (!instanceRef.current) {
          console.warn('TextToParticle: 인스턴스가 아직 초기화되지 않았습니다.');
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

    // 기본 스타일: 컨테이너가 크기를 가지도록 함
    const defaultStyle: React.CSSProperties = {
      width: '100%',
      height: '100%',
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

TextToParticleComponent.displayName = 'TextToParticle';

export default TextToParticleComponent;

