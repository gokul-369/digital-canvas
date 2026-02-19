import { motion, useMotionValue, animate } from "framer-motion";
import { useEffect, useRef } from "react";

function ScrollingRow({
  children,
  direction = "left",
}: {
  children: React.ReactNode;
  direction?: "left" | "right";
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const controls = useRef<ReturnType<typeof animate> | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const totalWidth = containerRef.current.scrollWidth / 2;
    const from = direction === "left" ? 0 : -totalWidth;
    const to = direction === "left" ? -totalWidth : 0;

    controls.current = animate(x, [from, to], {
      ease: "linear",
      duration: 30,
      repeat: Infinity,
    });

    return () => controls.current?.stop();
  }, [direction, x]);

  return (
    <motion.div
      ref={containerRef}
      className="flex gap-6 w-max"
      style={{
        x,
        willChange: "transform",
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
