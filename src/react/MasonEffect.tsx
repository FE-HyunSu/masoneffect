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
  morph: (text?: string) => void;
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

      instanceRef.current = new MasonEffect(containerRef.current, options);

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
      morph: (text?: string) => {
        instanceRef.current?.morph(text);
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

    return (
      <div
        ref={containerRef}
        className={props.className}
        style={props.style}
      />
    );
  }
);

MasonEffectComponent.displayName = 'MasonEffect';

export default MasonEffectComponent;

