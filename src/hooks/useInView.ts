/**
 * useInView — lightweight IntersectionObserver hook.
 *
 * Returns `true` once the ref element has entered the viewport.
 * Disconnects immediately after first intersection (once: true behaviour).
 *
 * Usage:
 *   const [ref, inView] = useInView({ threshold: 0.12 });
 *   <SomeheavyComponent ref={ref} style={{ visibility: inView ? 'visible' : 'hidden' }} />
 */

import { useEffect, useRef, useState, type RefObject } from "react";

interface UseInViewOptions {
  threshold?: number;
  rootMargin?: string;
  /** If true, stays true once visible (default). If false, re-fires on each enter. */
  once?: boolean;
}

export function useInView<T extends HTMLElement = HTMLDivElement>(
  options: UseInViewOptions = {}
): [RefObject<T | null>, boolean] {
  const { threshold = 0.1, rootMargin = "0px 0px -60px 0px", once = true } = options;
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return [ref, inView];
}
