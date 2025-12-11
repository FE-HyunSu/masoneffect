import { useEffect, useState, RefObject } from 'react'

interface UseIntersectionObserverOptions {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
}

/**
 * IntersectionObserver를 사용하여 요소의 가시성을 감지하는 커스텀 훅
 * @param ref - 관찰할 요소의 ref
 * @param options - IntersectionObserver 옵션
 * @returns isVisible - 요소가 화면에 보이는지 여부
 */
export function useIntersectionObserver(
  ref: RefObject<Element | null>,
  options: UseIntersectionObserverOptions = {}
): boolean {
  const [isVisible, setIsVisible] = useState(false)

  const {
    threshold = 0.2,
    rootMargin = '0px 0px -100px 0px',
    triggerOnce = false,
  } = options

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // 요소가 화면에 보일 때 true로 전환
            setIsVisible(true)
            if (triggerOnce) {
              observer.unobserve(element)
            }
          } else {
            if (!triggerOnce) {
              // 요소가 실제 뷰포트에서 완전히 벗어났을 때만 false로 전환
              // rootMargin 설정과 무관하게 실제 화면 기준으로 판단
              const rect = entry.boundingClientRect
              const viewportHeight = window.innerHeight
              const viewportWidth = window.innerWidth
              
              // 요소가 화면에 완전히 벗어났는지 확인
              // 일부라도 보이면 false로 전환하지 않음
              const isCompletelyOutOfViewport = 
                rect.bottom <= 0 ||           // 위로 완전히 벗어남
                rect.top >= viewportHeight || // 아래로 완전히 벗어남
                rect.right <= 0 ||            // 왼쪽으로 완전히 벗어남
                rect.left >= viewportWidth    // 오른쪽으로 완전히 벗어남
              
              if (isCompletelyOutOfViewport) {
                setIsVisible(false)
              }
            }
          }
        })
      },
      {
        threshold,
        rootMargin,
      }
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [ref, threshold, rootMargin, triggerOnce])

  return isVisible
}

