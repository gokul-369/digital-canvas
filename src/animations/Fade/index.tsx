/**
 * Fade animation component — scroll-triggered, GPU-accelerated, with
 * prefers-reduced-motion support.
 *
 * Uses IntersectionObserver (threshold 0.12) to trigger the transition only
 * when the element enters the viewport. Falls back to immediate visibility
 * when the user prefers reduced motion.
 */

import { useEffect, useRef, useState } from "react";

const REDUCED_MOTION =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function Fade({
  children,
  variant = "fade-up",
  delay = 0,
  threshold = 0.12,
  className = "",
}: {
  children: React.ReactNode;
  variant?: "fade-down" | "fade-up" | "fade-left" | "fade-right";
  delay?: number;
  threshold?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(REDUCED_MOTION);

  useEffect(() => {
    if (REDUCED_MOTION) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const hiddenClass = {
    "fade-down": "opacity-0 -translate-y-6",
    "fade-up": "opacity-0 translate-y-6",
    "fade-left": "opacity-0 -translate-x-6",
    "fade-right": "opacity-0 translate-x-6",
  }[variant];

  return (
    <div
      ref={ref}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
      className={`transition-[opacity,transform] duration-700 ease-out will-change-[opacity,transform] transform-gpu ${
        visible ? "opacity-100 translate-x-0 translate-y-0" : hiddenClass
      } ${className}`}
    >
      {children}
    </div>
  );
}

export default Fade;
