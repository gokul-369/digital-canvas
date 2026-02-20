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

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.scrollWidth / 2;
    const from = direction === "left" ? 0 : -width;
    const to = direction === "left" ? -width : 0;

    x.set(from);

    controls.current = animate(x, [from, to], {
      ease: "linear",
      duration: speed,
      repeat: Infinity,
      repeatType: "loop",
    });

    return () => controls.current?.stop();
  }, [direction, speed, x]);

  return (
    <motion.div
      ref={containerRef}
      className="flex gap-6 w-max contain-layout"
      style={{
        x,
        willChange: "transform",
        transform: "translateZ(0)",
        backfaceVisibility: "hidden",
      }}
      onMouseEnter={() => controls.current?.pause()}
      onMouseLeave={() => controls.current?.play()}
    >
      {children}
      {children}
    </motion.div>
  );
}

export default ScrollingRow;
