import { useState, useCallback, useEffect, useRef, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { awards } from "../../data";
import SectionHeader from "../../components/SectionHeader";
import {
  IoChevronBack,
  IoChevronForward,
  IoSparklesOutline,
  IoGridOutline,
} from "react-icons/io5";
import type { IconType } from "react-icons";

function Awards() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewMode, setViewMode] = useState<"horizon" | "bento">("horizon");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const touchStartX = useRef<number | null>(null);

  const total = awards.length;
  const currentAward = awards[activeIndex];

  const goToNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const goToPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goToNext();
      if (e.key === "ArrowLeft") goToPrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNext, goToPrev]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) goToNext();
      else goToPrev();
    }
    touchStartX.current = null;
  };

  return (
    <section
      id="awards"
      className="relative min-h-dvh w-full py-24 px-6 lg:px-24 flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Dynamic Ambient Horizon Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center -z-10 overflow-hidden"
      >
        <div className="w-[500px] h-[350px] rounded-full bg-indigo-500/15 dark:bg-indigo-500/20 blur-[100px] transition-all duration-700" />
      </div>

      <SectionHeader
        tag="Recognition & Milestones"
        title="Highlights and"
        accent="honors"
        description="Accolades, certifications, and milestones that mark discipline, curiosity, and the pursuit of excellence."
        className="mb-8"
      />

      {/* View Mode Toggle - Cosmic Glass */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white/70 dark:bg-white/[0.04] backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-sm mb-12 z-20">
        <button
          type="button"
          onClick={() => setViewMode("horizon")}
          className={`relative inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-medium transition-colors duration-200 cursor-pointer select-none ${
            viewMode === "horizon"
              ? "text-white"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          {viewMode === "horizon" && (
            <motion.div
              layoutId="awards-view-active"
              className="absolute inset-0 bg-indigo-600 rounded-xl shadow-md shadow-indigo-600/25 -z-0"
              transition={{ type: "spring", stiffness: 400, damping: 32 }}
            />
          )}
          <IoSparklesOutline size={14} className="relative z-10" />
          <span className="relative z-10">3D Stack Stage</span>
        </button>
        <button
          type="button"
          onClick={() => setViewMode("bento")}
          className={`relative inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-medium transition-colors duration-200 cursor-pointer select-none ${
            viewMode === "bento"
              ? "text-white"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          {viewMode === "bento" && (
            <motion.div
              layoutId="awards-view-active"
              className="absolute inset-0 bg-indigo-600 rounded-xl shadow-md shadow-indigo-600/25 -z-0"
              transition={{ type: "spring", stiffness: 400, damping: 32 }}
            />
          )}
          <IoGridOutline size={14} className="relative z-10" />
          <span className="relative z-10">Bento Matrix</span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {/* VIEW 1: 3D Horizon Stack Stage */}
        {viewMode === "horizon" && (
          <motion.div
            key="horizon"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            ref={containerRef}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="relative w-full max-w-5xl flex flex-col items-center select-none"
          >
          {/* 3D Stack Stage with Snappy Springs */}
          <div className="relative w-full h-[380px] sm:h-[420px] flex items-center justify-center [perspective:1200px] overflow-visible">
            {awards.map((item, idx) => {
              const Icon: IconType = item.icon;
              const isAward = item.type === "award";

              // Calculate relative circular distance (-2, -1, 0, 1, 2)
              let offset = idx - activeIndex;
              if (offset > total / 2) offset -= total;
              if (offset < -total / 2) offset += total;

              // Only render visible cards within horizon arc (-2 to +2)
              const isVisible = Math.abs(offset) <= 2;
              if (!isVisible) return null;

              const isCenter = offset === 0;

              return (
                <motion.div
                  key={item.title}
                  onClick={() => setActiveIndex(idx)}
                  animate={{
                    x: `${offset * 110}%`,
                    scale: isCenter ? 1 : Math.abs(offset) === 1 ? 0.86 : 0.72,
                    rotateY: offset * -22,
                    z: isCenter ? 40 : -Math.abs(offset) * 110,
                    opacity: isCenter ? 1 : Math.abs(offset) === 1 ? 0.65 : 0.25,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 280,
                    damping: 30,
                    mass: 0.8,
                  }}
                  style={{
                    transformStyle: "preserve-3d",
                    zIndex: 20 - Math.abs(offset) * 5,
                    isolation: "isolate",
                  }}
                  className={`absolute w-[88vw] sm:w-[86vw] max-w-[480px] rounded-3xl p-5 sm:p-7 md:p-9 border backdrop-blur-xl transition-colors duration-200 cursor-pointer overflow-hidden will-change-transform ${
                    isCenter
                      ? "bg-white/80 dark:bg-white/[0.06] border-indigo-400/80 shadow-[0_20px_50px_-15px_rgba(99,102,241,0.35)] ring-1 ring-indigo-400/40"
                      : "bg-white/50 dark:bg-white/[0.02] border-slate-200/70 dark:border-white/10 hover:border-indigo-400/40"
                  }`}
                >
                  {/* Cosmic Specular Hover Sheen */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Top Bar: Frame number & Type Pill */}
                  <div className="relative z-10 flex items-center justify-between pb-4 border-b border-slate-200/60 dark:border-white/5">
                    <span className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                      // Milestone {(idx + 1).toString().padStart(2, "0")} · {item.type.toUpperCase()}
                    </span>
                    <span
                      className={`font-mono text-[11px] px-3 py-1 rounded-full border font-semibold ${
                        isAward
                          ? "border-amber-300/60 dark:border-amber-400/30 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-300"
                          : "border-indigo-200 dark:border-indigo-400/30 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-300"
                      }`}
                    >
                      {item.year}
                    </span>
                  </div>

                  {/* Main Award Content */}
                  <div className="relative z-10 my-6 flex items-start gap-4">
                    <div
                      className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl border shadow-md transition-transform duration-300 ${
                        isCenter ? "scale-105" : "scale-100"
                      } ${
                        isAward
                          ? "border-amber-300/60 dark:border-amber-400/30 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-300"
                          : "border-indigo-200 dark:border-indigo-400/30 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                      }`}
                    >
                      <Icon className="h-7 w-7" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-space text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                        {item.title}
                      </h3>
                      <p className="mt-1 font-mono text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                        {item.company}
                      </p>
                    </div>
                  </div>

                  {/* Subtitle Description */}
                  <div className="relative z-10 mt-4 rounded-2xl border border-slate-200/60 dark:border-white/5 bg-slate-50/70 dark:bg-black/20 p-4">
                    <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-normal">
                      "{item.subTitle}"
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Controls Bar: Prev/Next & Progress */}
          <div className="mt-8 flex flex-col items-center gap-4 w-full max-w-md z-10">
            {/* Horizontal Track Bar */}
            <div className="w-full bg-slate-200 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-indigo-500 h-full transition-all duration-300 ease-out"
                style={{ width: `${((activeIndex + 1) / total) * 100}%` }}
              />
            </div>

            {/* Navigation Buttons & Counter */}
            <div className="flex items-center justify-between w-full px-2">
              <button
                type="button"
                onClick={goToPrev}
                className="p-3 rounded-full border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-white/[0.06] backdrop-blur-md text-slate-800 dark:text-white hover:bg-indigo-50 dark:hover:bg-white/15 transition-all cursor-pointer shadow-sm active:scale-95"
                aria-label="Previous milestone"
              >
                <IoChevronBack size={18} />
              </button>

              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                // {currentAward.title}
              </span>

              <button
                type="button"
                onClick={goToNext}
                className="p-3 rounded-full border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-white/[0.06] backdrop-blur-md text-slate-800 dark:text-white hover:bg-indigo-50 dark:hover:bg-white/15 transition-all cursor-pointer shadow-sm active:scale-95"
                aria-label="Next milestone"
              >
                <IoChevronForward size={18} />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* VIEW 2: Architectural Bento Matrix */}
      {viewMode === "bento" && (
        <motion.div
          key="bento"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full max-w-6xl"
        >
          {awards.map((item, index) => {
            const Icon: IconType = item.icon;
            const isAward = item.type === "award";
            const isFeatured = index === 3 || index === 8; // Ranked 1st & Hackathon Champion

            return (
              <div
                key={item.title}
                style={{ isolation: "isolate" }}
                className={`group relative flex flex-col justify-between rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-400/60 hover:shadow-[0_0_35px_rgba(99,102,241,0.22)] select-none overflow-hidden ${
                  isFeatured ? "md:col-span-2 lg:col-span-2 ring-1 ring-amber-400/30" : ""
                }`}
              >
                {/* Subtle Cosmic Glow on Hover */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative z-10 flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-white/5">
                  <span className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                    // Milestone {(index + 1).toString().padStart(2, "0")}
                  </span>
                  <span
                    className={`font-mono text-[11px] px-3 py-1 rounded-full border font-semibold ${
                      isAward
                        ? "border-amber-300/60 dark:border-amber-400/30 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-300"
                        : "border-indigo-200 dark:border-indigo-400/30 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-300"
                    }`}
                  >
                    {item.year}
                  </span>
                </div>

                <div className="relative z-10 my-4 flex items-start gap-4">
                  <div
                    className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border shadow-sm transition-transform duration-300 group-hover:scale-105 ${
                      isAward
                        ? "border-amber-300/60 dark:border-amber-400/30 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-300"
                        : "border-indigo-200 dark:border-indigo-400/30 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-space text-lg font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="mt-1 font-mono text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      {item.company}
                    </p>
                  </div>
                </div>

                <div className="relative z-10 mt-2 rounded-2xl border border-slate-200/60 dark:border-white/5 bg-slate-50/70 dark:bg-black/20 p-3.5">
                  <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                    "{item.subTitle}"
                  </p>
                </div>
              </div>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
    </section>
  );
}

export default memo(Awards);
