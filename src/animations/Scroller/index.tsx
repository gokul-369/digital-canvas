import { motion, useMotionValue, animate } from "motion/react";
import { useEffect, useRef } from "react";

function ScrollingRow({
  children,
  direction = "left",
  speed = 25,
}: {
  children: React.ReactNode;
  direction?: "left" | "right";
  speed?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const controls = useRef<ReturnType<typeof animate> | null>(null);
  const isHoveredRef = useRef(false);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    let isVisible = true;

    const startAnimation = () => {
      const width = element.scrollWidth / 2;
      if (!width) return;

      const from = direction === "left" ? 0 : -width;
      const to = direction === "left" ? -width : 0;

      x.set(from);

      controls.current?.stop();

      controls.current = animate(x, [from, to], {
        ease: "linear",
        duration: speed,
        repeat: Infinity,
      });

      if (!isVisible || isHoveredRef.current) {
        controls.current?.pause();
      }
    };

    startAnimation();

    const resizeObserver = new ResizeObserver(() => {
      startAnimation();
    });

    resizeObserver.observe(element);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !isHoveredRef.current) {
          controls.current?.play();
        } else {
          controls.current?.pause();
        }
      },
      { threshold: 0.02 },
    );

    intersectionObserver.observe(element);

    return () => {
      controls.current?.stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, [direction, speed, x]);

  return (
    <div className="relative py-4 w-full overflow-hidden">
      <motion.div
        ref={containerRef}
        className="flex gap-6"
        style={{
          x,
          width: "max-content",
          willChange: "transform",
        }}
        onMouseEnter={() => {
          isHoveredRef.current = true;
          controls.current?.pause();
        }}
        onMouseLeave={() => {
          isHoveredRef.current = false;
          controls.current?.play();
        }}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}

export default ScrollingRow;
