import { useState, useRef, useEffect, useCallback, type FC } from "react";
import { motion, AnimatePresence, type Variants } from "motion/react";
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

export const ProjectShowcase3D: FC<ProjectShowcase3DProps> = ({
  project,
  direction = "next",
  theme: _theme = "dark",
  className = "",
  onOpenLive,
  onNext,
  onPrev,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState<number>(0);
  const [rotateY, setRotateY] = useState<number>(0);
  const [sheenPos, setSheenPos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Preload all project images for zero-lag instant sliding
  useEffect(() => {
    projectsList.forEach((p) => {
      if (p.previewImage) {
        const img = new Image();
        img.src = p.previewImage;
      }
    });
  }, []);

  // Smooth 3D mouse parallax tilt calculation
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width; // 0 to 1
    const ny = (e.clientY - rect.top) / rect.height; // 0 to 1

    // Tilt angles: max +/- 7 degrees
    const rY = (nx - 0.5) * 14;
    const rX = (0.5 - ny) * 12;

    setRotateX(rX);
    setRotateY(rY);
    setSheenPos({ x: nx * 100, y: ny * 100 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  // Slide transition variants for the thumbnail carousel
  const slideVariants: Variants = {
    enter: (dir: "next" | "prev") => ({
      x: dir === "next" ? "100%" : "-100%",
      opacity: 0,
      scale: 0.94,
    }),
    center: {
      x: "0%",
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring", stiffness: 260, damping: 28 },
        opacity: { duration: 0.28 },
        scale: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
      },
    },
    exit: (dir: "next" | "prev") => ({
      x: dir === "next" ? "-100%" : "100%",
      opacity: 0,
      scale: 0.94,
      transition: {
        x: { type: "spring", stiffness: 260, damping: 28 },
        opacity: { duration: 0.25 },
        scale: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
      },
    }),
  };

  return (
    <div
      style={{ perspective: 1200 }}
      className={`w-full flex justify-center py-2 select-none ${className}`}
    >
      {/* 3D Interactive Tilt Container */}
      <motion.div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        animate={{
          rotateX: isHovered ? rotateX : 0,
          rotateY: isHovered ? rotateY : 0,
          scale: isHovered ? 1.01 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 220,
          damping: 24,
          mass: 0.6,
        }}
        style={{
          transformStyle: "preserve-3d",
        }}
        className="relative w-full rounded-3xl border border-slate-200/90 dark:border-white/10 bg-slate-900/95 shadow-2xl overflow-hidden flex flex-col group cursor-pointer"
      >
        {/* Dynamic Specular Glass Sheen moving with cursor */}
        <div
          className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle 500px at ${sheenPos.x}% ${sheenPos.y}%, rgba(255, 255, 255, 0.08), transparent 70%)`,
            opacity: isHovered ? 1 : 0,
          }}
        />

        {/* Native Browser Window Header (macOS Style, completely outside canvas) */}
        <div
          style={{ transform: "translateZ(10px)" }}
          className="w-full px-5 py-3 border-b border-slate-200/80 dark:border-white/10 bg-slate-100/90 dark:bg-slate-900/90 backdrop-blur-md flex items-center justify-between z-20"
        >
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
              className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center overflow-hidden"
            >
              {/* High-Resolution Project Screenshot (Zero Letterbox, 100% 16:10 Fit) */}
              <img
                src={project.previewImage}
                alt={project.title}
                loading="eager"
                decoding="async"
                className="w-full h-full object-cover object-top select-none pointer-events-none"
              />

              {/* Subtle glass reflection edge */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/[0.03] pointer-events-none" />
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
