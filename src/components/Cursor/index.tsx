import { useEffect, useRef, memo } from "react";

function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only run on fine pointer devices (desktop mouse/trackpad)
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let rafId: number;
    let isHovered = false;

    let idleTimeout: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (ringRef.current) {
        ringRef.current.style.opacity = "1";
      }

      window.clearTimeout(idleTimeout);
      idleTimeout = window.setTimeout(() => {
        if (ringRef.current) ringRef.current.style.opacity = "0";
      }, 1200);

      // Check clickable without React state re-render
      const target = e.target as HTMLElement | null;
      if (target) {
        const clickable = Boolean(
          target.closest("a, button, [role='button'], input, textarea, select, .cursor-pointer, .link")
        );
        if (clickable !== isHovered) {
          isHovered = clickable;
          if (ringRef.current) {
            if (isHovered) {
              ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) scale(1.4)`;
              ringRef.current.style.borderColor = "rgba(99, 102, 241, 0.65)";
              ringRef.current.style.backgroundColor = "rgba(99, 102, 241, 0.08)";
            } else {
              ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) scale(1.0)`;
              ringRef.current.style.borderColor = "rgba(99, 102, 241, 0.3)";
              ringRef.current.style.backgroundColor = "transparent";
            }
          }
        }
      }
    };

    const onMouseLeave = () => {
      if (ringRef.current) ringRef.current.style.opacity = "0";
    };

    const onMouseEnter = () => {
      if (ringRef.current) ringRef.current.style.opacity = "1";
    };

    // Smooth lerp for outer follower ring
    const render = () => {
      ringX += (mouseX - ringX) * 0.2;
      ringY += (mouseY - ringY) * 0.2;

      if (ringRef.current) {
        const scaleStr = isHovered ? "scale(1.4)" : "scale(1.0)";
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) ${scaleStr}`;
      }

      rafId = requestAnimationFrame(render);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);
    rafId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={ringRef}
      aria-hidden="true"
      style={{
        transform: "translate3d(-100px, -100px, 0)",
        opacity: 0,
        border: "1px solid rgba(99, 102, 241, 0.35)",
        willChange: "transform",
      }}
      className="fixed top-0 left-0 -ml-[18px] -mt-[18px] w-9 h-9 rounded-full pointer-events-none z-50 transition-opacity duration-200 ease-out"
    />
  );
}

export default memo(CustomCursor);
