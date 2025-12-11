import { useState, useEffect, useRef } from 'react'

interface UseCountUpOptions {
  duration?: number
  startValue?: number
  enabled?: boolean
  easing?: (t: number) => number
}

/**
 * 숫자를 0부터 목표값까지 카운팅 애니메이션을 적용하는 커스텀 훅
 * @param targetValue - 목표 숫자 값
 * @param options - 옵션 설정
 * @returns 현재 카운팅 중인 숫자 값
 */
export function useCountUp(
  targetValue: number | null,
  options: UseCountUpOptions = {}
): number {
  const {
    duration = 2000,
    startValue = 0,
    enabled = true,
    easing = (t) => t, // 기본 linear easing
  } = options

  const [count, setCount] = useState(startValue)
  const startTimeRef = useRef<number | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  useEffect(() => {
    if (!enabled || targetValue === null) {
      setCount(startValue)
      return
    }

    // 애니메이션 시작
    const startAnimation = () => {
      startTimeRef.current = null
      
      const animate = (currentTime: number) => {
        if (startTimeRef.current === null) {
          startTimeRef.current = currentTime
        }

        const elapsed = currentTime - startTimeRef.current
        const progress = Math.min(elapsed / duration, 1)
        const easedProgress = easing(progress)
        
        const currentCount = Math.floor(
          startValue + (targetValue - startValue) * easedProgress
        )
        
        setCount(currentCount)

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animate)
        } else {
          setCount(targetValue)
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    startAnimation()

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [targetValue, duration, startValue, enabled, easing])

  return count
}

/**
 * Easing 함수들
 */
export const easingFunctions = {
  linear: (t: number) => t,
  easeInQuad: (t: number) => t * t,
  easeOutQuad: (t: number) => t * (2 - t),
  easeInOutQuad: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeOutCubic: (t: number) => --t * t * t + 1,
}

