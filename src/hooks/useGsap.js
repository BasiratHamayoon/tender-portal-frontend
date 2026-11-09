"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function useGsapFadeIn(deps = []) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) {
      gsap.fromTo(ref.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" });
    }
  }, deps);
  return ref;
}

export function useGsapStagger(selector, deps = []) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) {
      const els = ref.current.querySelectorAll(selector);
      gsap.fromTo(els, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: "power2.out" });
    }
  }, deps);
  return ref;
}

export function useGsapScale(deps = []) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) {
      gsap.fromTo(ref.current, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" });
    }
  }, deps);
  return ref;
}