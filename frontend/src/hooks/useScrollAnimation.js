import { useEffect, useRef, useState } from 'react';

/**
 * Hook personalizado para aplicar animaciones cuando un elemento entra en el viewport
 * @param {Object} options - Opciones del IntersectionObserver
 * @param {number} options.threshold - Porcentaje de visibilidad para activar (0-1)
 * @param {string} options.rootMargin - Margen del viewport
 * @param {boolean} options.triggerOnce - Si solo animar una vez
 * @returns {Object} - { ref, isVisible }
 */
const useScrollAnimation = (options = {}) => {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = true
  } = options;

  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const currentRef = ref.current;
    
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce && currentRef) {
            observer.unobserve(currentRef);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(currentRef);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isVisible };
};

export default useScrollAnimation;
