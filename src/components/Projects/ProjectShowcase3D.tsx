import { useRef, useEffect, useCallback, memo, type FC } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  type Variants,
} from "motion/react";
import { projectsList, type ProjectItem } from "../../data/projects";

interface ProjectShowcase3DProps {
  project: ProjectItem;
  direction?: "next" | "prev";
  theme?: string;
  className?: string;
  onOpenLive?: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

const SPRING_CONFIG = { stiffness: 160, damping: 26, mass: 0.5 };

const slideVariants: Variants = {
  enter: (dir: "next" | "prev") => ({
    x: dir === "next" ? "100%" : "-100%",
    opacity: 0.3,
  }),
  center: {
    x: "0%",
    opacity: 1,
    transition: {
      x: { type: "spring", stiffness: 280, damping: 30 },
      opacity: { duration: 0.25 },
    },
  },
  exit: (dir: "next" | "prev") => ({
    x: dir === "next" ? "-100%" : "100%",
    opacity: 0.3,
    transition: {
      x: { type: "spring", stiffness: 280, damping: 30 },
      opacity: { duration: 0.2 },
    },
  }),
};

export const ProjectShowcase3D: FC<ProjectShowcase3DProps> = memo(({
  project,
  direction = "next",
  theme: _theme = "dark",
  className = "",
  onOpenLive,
  onNext,
  onPrev,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);

  // Zero-re-render MotionValues for 120fps GPU-composited 3D tilt
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const smoothX = useSpring(mouseX, SPRING_CONFIG);
  const smoothY = useSpring(mouseY, SPRING_CONFIG);

  // Gentle, crisp 3D tilt (+/- 5 deg Y, +/- 4 deg X)
  const rotateY = useTransform(smoothX, [0, 1], [-5, 5]);
  const rotateX = useTransform(smoothY, [0, 1], [4, -4]);

  // Preload all project images for zero-lag instant sliding
  useEffect(() => {
    projectsList.forEach((p) => {
      if (p.previewImage) {
        const img = new Image();
        img.src = p.previewImage;
      }
    });
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const nx = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const ny = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

      mouseX.set(nx);
      mouseY.set(ny);

      // Move pre-rasterized sheen layer with GPU transform (zero paint cost)
      if (sheenRef.current) {
        const tx = (nx - 0.5) * rect.width * 0.8;
        const ty = (ny - 0.5) * rect.height * 0.8;
        sheenRef.current.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
      }
    },
    [mouseX, mouseY]
  );

  const handleMouseEnter = useCallback(() => {
    if (sheenRef.current) {
      sheenRef.current.style.opacity = "1";
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0.5);
    mouseY.set(0.5);
    if (sheenRef.current) {
      sheenRef.current.style.opacity = "0";
      sheenRef.current.style.transform = "translate3d(0px, 0px, 0)";
    }
  }, [mouseX, mouseY]);

  return (
    <div
      style={{ perspective: 1200 }}
      className={`w-full flex justify-center py-2 select-none ${className}`}
    >
      {/* 3D Interactive Tilt Container — pure GPU MotionValues, zero React re-renders */}
      <motion.div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformPerspective: 1200,
          willChange: "transform",
        }}
        className="relative w-full rounded-3xl border border-slate-200/90 dark:border-white/10 bg-slate-900 shadow-2xl overflow-hidden flex flex-col cursor-pointer transform-gpu"
      >
        {/* Pre-rasterized GPU Specular Glass Sheen (moved via translate3d, never re-painted) */}
        <div
          ref={sheenRef}
          className="pointer-events-none absolute -inset-1/2 z-30 opacity-0 transition-opacity duration-300 will-change-transform"
          style={{
            background:
              "radial-gradient(circle 340px at center, rgba(255, 255, 255, 0.08), transparent 70%)",
          }}
        />

        {/* Native Browser Window Header (macOS Style, no backdrop-blur inside 3D layer) */}
        <div className="w-full px-5 py-3 border-b border-slate-200/80 dark:border-white/10 bg-slate-100 dark:bg-slate-900 flex items-center justify-between z-20">
          {/* macOS window control dots */}
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 border border-rose-600/50 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 border border-amber-600/50 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 border border-emerald-600/50 inline-block" />
          </div>

          {/* Centered clean address bar */}
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="px-4 py-1.5 rounded-xl border border-slate-300/70 dark:border-white/10 bg-white/80 dark:bg-black/40 text-slate-700 dark:text-slate-300 font-mono text-xs font-semibold flex items-center gap-2 hover:border-sky-400 hover:text-sky-500 transition-colors shadow-sm cursor-pointer"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>https://{project.domainUrl}</span>
            <span className="text-[11px] text-sky-500">↗</span>
          </a>

          {/* Direct quick action */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenLive?.();
            }}
            className="font-mono text-[11px] font-semibold text-sky-500 hover:text-sky-400 flex items-center gap-1 cursor-pointer"
          >
            <span>VISIT</span>
            <span>↗</span>
          </button>
        </div>

        {/* 16:10 Thumbnail Carousel Viewport with Continuous Sliding Animation */}
        <div
          onClick={onOpenLive}
          className="relative w-full aspect-[16/10] overflow-hidden bg-slate-950 flex items-center justify-center"
        >
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={project.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.x < -50 && onNext) {
                  onNext();
                } else if (info.offset.x > 50 && onPrev) {
                  onPrev();
                }
              }}
              className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center overflow-hidden will-change-transform transform-gpu"
            >
              <img
                src={project.previewImage}
                alt={project.title}
                loading="eager"
                decoding="async"
                className="w-full h-full object-cover object-top select-none pointer-events-none"
              />

              {/* Subtle bottom vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
});

ProjectShowcase3D.displayName = "ProjectShowcase3D";
