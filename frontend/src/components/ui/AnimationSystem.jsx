import { memo, useState, useEffect, useRef } from 'react'

// Componente simple para animaciones de entrada
export const EntranceAnimation = memo(({ 
  children, 
  type = 'fadeInUp',
  delay = 0,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const elementRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay)
        }
      },
      { threshold: 0.1 }
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => observer.disconnect()
  }, [delay])

  const animationClass = isVisible 
    ? 'opacity-100 translate-y-0 scale-100' 
    : 'opacity-0 translate-y-4 scale-95'

  return (
    <div 
      ref={elementRef} 
      className={`transition-all duration-500 ease-out ${animationClass} ${className}`}
    >
      {children}
    </div>
  )
})

EntranceAnimation.displayName = 'EntranceAnimation'

// Componente para animaciones escalonadas
export const StaggeredAnimation = memo(({ 
  children, 
  staggerDelay = 100,
  className = ''
}) => {
  return (
    <div className={className}>
      {Array.isArray(children) 
        ? children.map((child, index) => (
            <EntranceAnimation key={index} delay={index * staggerDelay}>
              {child}
            </EntranceAnimation>
          ))
        : <EntranceAnimation>{children}</EntranceAnimation>
      }
    </div>
  )
})

StaggeredAnimation.displayName = 'StaggeredAnimation'

export default {
  EntranceAnimation,
  StaggeredAnimation
}