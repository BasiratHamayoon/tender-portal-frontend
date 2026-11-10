'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * Main GSAP hook providing utility animation methods
 */
export function useGsap() {
  const animateFadeIn = (element, delay = 0) => {
    if (!element) return;
    gsap.fromTo(
      element,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, delay, ease: 'power2.out' }
    );
  };

  const animateStagger = (elements, stagger = 0.08) => {
    if (!elements || elements.length === 0) return;
    gsap.fromTo(
      elements,
      { opacity: 0, y: 25, scale: 0.96 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        stagger,
        ease: 'back.out(1.2)',
      }
    );
  };

  const animatePop = (element) => {
    if (!element) return;
    gsap.fromTo(
      element,
      { scale: 0.9, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.5)' }
    );
  };

  return { animateFadeIn, animateStagger, animatePop };
}

/**
 * Standalone hook for single element fade in
 */
export function useGsapFadeIn(delay = 0) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      gsap.fromTo(
        ref.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, delay, ease: 'power2.out' }
      );
    }
  }, [delay]);

  return ref;
}

/**
 * Standalone hook for staggered children elements
 */
export function useGsapStagger(staggerAmount = 0.08) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && containerRef.current.children) {
      gsap.fromTo(
        containerRef.current.children,
        { opacity: 0, y: 25, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: staggerAmount,
          ease: 'back.out(1.2)',
        }
      );
    }
  }, [staggerAmount]);

  return containerRef;
}

export default useGsap;