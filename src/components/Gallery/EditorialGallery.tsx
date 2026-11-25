import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  IoChevronBack,
  IoChevronForward,
  IoExpand,
  IoClose,
} from "react-icons/io5";
import { processedAlbum as images } from "../../data";
import ThreeDViewport from "./ThreeDViewport";
import type { prcocessedimages } from "../../types";

const exifData: Record<string, string> = {
  Perch: "35mm · ƒ/2.0 · 1/640s · ISO 100",
  Skydance: "50mm · ƒ/1.8 · 1/1000s · ISO 200",
  "P(J)oker": "28mm · ƒ/2.8 · 1/320s · ISO 400",
  "Big Bucket": "24mm · ƒ/4.0 · 1/250s · ISO 100",
  "Heart's game": "35mm · ƒ/1.4 · 1/800s · ISO 100",
  "Bird's watch": "85mm · ƒ/2.8 · 1/1250s · ISO 200",
};

interface EditorialGalleryProps {
  isImmersive?: boolean;
  onToggleImmersive?: () => void;
}

export default function EditorialGallery({
  isImmersive = false,
  onToggleImmersive,
}: EditorialGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isFullImageLoaded, setIsFullImageLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    setIsFullImageLoaded(false);
  }, [currentIndex, isFullscreen]);

  const total = images.length;
  const current = images[currentIndex];
  const previous = prevIndex !== null ? images[prevIndex] : null;

  const goToNext = useCallback(() => {
    setPrevIndex(currentIndex);
    setDirection("next");
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [currentIndex, total]);

  const goToPrev = useCallback(() => {
    setPrevIndex(currentIndex);
    setDirection("prev");
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [currentIndex, total]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goToNext();
      if (e.key === "ArrowLeft") goToPrev();
      if (e.key === "Escape") setIsFullscreen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNext, goToPrev]);

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) goToNext();
      else goToPrev();
    }
    touchStartX.current = null;
  };

  const currentExif =
    exifData[current.title] || "35mm Prime · Natural Light · RAW";
  const numFormatted = (currentIndex + 1).toString().padStart(2, "0");
  const totalFormatted = total.toString().padStart(2, "0");

  return (
    <>
      <div
        ref={containerRef}
        className="relative w-full max-w-7xl mx-auto px-6 lg:px-12 py-4 flex flex-col justify-center"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-14 items-center">
          {/* Controls & Narrative Chassis: Order-last on mobile (below image), Order-first on desktop (left 5 cols) */}
          <motion.div
            layout
            transition={{
              layout: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
            }}
            className="order-last lg:order-first lg:col-span-5 relative flex flex-col justify-between space-y-4 sm:space-y-6 z-10 p-5 sm:p-7 rounded-3xl bg-gradient-to-br from-white/70 via-white/50 to-white/40 dark:from-white/[0.12] dark:via-white/[0.05] dark:to-white/[0.02] backdrop-blur-2xl backdrop-saturate-180 border border-white/80 dark:border-white/20 shadow-[inset_0_1px_2px_0_rgba(255,255,255,0.7),0_16px_40px_0_rgba(0,0,0,0.08)] dark:shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.35),0_20px_50px_0_rgba(0,0,0,0.5)] lg:min-h-[510px] transition-all duration-300 overflow-hidden"
          >
            {/* Subtle Glass Refraction Highlights */}
            <div
              aria-hidden="true"
              className="absolute -top-24 -left-24 w-60 h-60 rounded-full bg-gradient-to-br from-indigo-500/15 via-purple-500/10 to-transparent blur-2xl pointer-events-none"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-24 -right-24 w-60 h-60 rounded-full bg-gradient-to-tl from-cyan-500/10 via-indigo-500/10 to-transparent blur-2xl pointer-events-none"
            />
            <div>
              {/* Header Counter & Immersive Mode Toggle */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-white/10">
                <span className="font-mono text-xs uppercase tracking-[0.25em] text-indigo-600 dark:text-indigo-400 font-semibold">
                  // Frame {numFormatted} of {totalFormatted}
                </span>

                {onToggleImmersive && (
                  <button
                    type="button"
                    onClick={onToggleImmersive}
                    className="inline-flex items-center gap-2 group cursor-pointer focus:outline-none"
                    title={isImmersive ? "Exit Immersive Mode" : "Enter Immersive Mode"}
                    aria-label="Toggle Immersive Mode"
                  >
                    <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 group-hover:text-indigo-500 transition-colors">
                      Immersive
                    </span>
                    <div
                      className={`relative inline-flex h-4 w-7 flex-shrink-0 cursor-pointer rounded-full border transition-colors duration-200 ease-in-out ${
                        isImmersive
                          ? "bg-indigo-600 border-indigo-600"
                          : "bg-slate-200 dark:bg-white/15 border-slate-300 dark:border-white/20"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-3 w-3 transform rounded-full shadow-sm transition duration-200 ease-in-out mt-[1px] ml-[1px] ${
                          isImmersive
                            ? "translate-x-3 bg-white"
                            : "translate-x-0 bg-slate-400 dark:bg-white/70"
                        }`}
                      />
                    </div>
                  </button>
                )}
              </div>

              {/* Title & Caveat Description with Stable Reserved Geometry to Prevent Height Snapping */}
              <div className="min-h-[85px] sm:min-h-[120px] lg:min-h-[145px] flex flex-col justify-center my-2 sm:my-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-1.5 sm:space-y-3"
                  >
                    <h3 className="font-space text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white drop-shadow-sm">
                      {current.title}
                    </h3>
                    <p className="font-caveat text-xl sm:text-2xl lg:text-3xl text-indigo-600 dark:text-indigo-400 font-normal leading-snug">
                      "{current.description}"
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* EXIF Metadata Pill */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs px-3 py-1.5 rounded-lg bg-white/50 dark:bg-white/[0.06] border border-white/60 dark:border-white/10 backdrop-blur-md text-slate-700 dark:text-slate-300 shadow-sm">
                  📷 {currentExif}
                </span>
              </div>
            </div>

            {/* Interactive Navigation Controls */}
            <div className="pt-2 sm:pt-4 space-y-4 sm:space-y-5">
              {/* Progress Bar */}
              <div className="w-full bg-slate-200/80 dark:bg-white/10 h-1 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-500 h-full transition-all duration-300 ease-out"
                  style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={goToPrev}
                    className="p-3 rounded-full border border-white/70 dark:border-white/10 bg-white/70 dark:bg-white/[0.08] backdrop-blur-md text-slate-800 dark:text-white hover:bg-white/90 dark:hover:bg-white/20 hover:border-indigo-300 transition-all cursor-pointer shadow-sm active:scale-95"
                    aria-label="Previous image"
                  >
                    <IoChevronBack size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={goToNext}
                    className="p-3 rounded-full border border-white/70 dark:border-white/10 bg-white/70 dark:bg-white/[0.08] backdrop-blur-md text-slate-800 dark:text-white hover:bg-white/90 dark:hover:bg-white/20 hover:border-indigo-300 transition-all cursor-pointer shadow-sm active:scale-95"
                    aria-label="Next image"
                  >
                    <IoChevronForward size={18} />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setIsFullscreen(true)}
                  className="inline-flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors cursor-pointer"
                >
                  <IoExpand size={16} />
                  <span>Fullscreen View</span>
                </button>
              </div>

              {/* Thumbnail Navigation Strip */}
              <div className="flex gap-2.5 overflow-x-auto py-2 scrollbar-none">
                {images.map((img: prcocessedimages, idx: number) => {
                  const isActive = idx === currentIndex;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setPrevIndex(currentIndex);
                        setDirection(idx > currentIndex ? "next" : "prev");
                        setCurrentIndex(idx);
                      }}
                      className={`relative flex-shrink-0 w-12 h-12 rounded-xl overflow-hidden border transition-all cursor-pointer ${
                        isActive
                          ? "border-indigo-500 ring-2 ring-indigo-400/50 scale-105"
                          : "border-slate-200 dark:border-white/10 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={img.thumb || img.medium}
                        alt={img.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* 3D Image Frame: Order-first on mobile (top of section), Order-last on desktop (right 7 cols) */}
          <div className="order-first lg:order-last lg:col-span-7 relative flex items-center justify-center w-full">
            {/* Ambient Glow */}
            <div className="pointer-events-none absolute inset-4 rounded-3xl bg-indigo-500/15 dark:bg-indigo-500/20 blur-3xl" />

            {/* Crisp 3D Frame */}
            <div className="relative w-full aspect-[4/3] max-h-[46vh] sm:max-h-[50vh] lg:max-h-[56vh] rounded-3xl overflow-hidden border border-slate-200/90 dark:border-white/15 bg-black/80 shadow-2xl group">
              <ThreeDViewport
                currentImage={current}
                prevImage={previous}
                direction={direction}
                className="w-full h-full"
                onImageClick={() => setIsFullscreen(true)}
              />

              {/* Click to Expand Overlay Hint */}
              <div
                onClick={() => setIsFullscreen(true)}
                className="absolute bottom-4 right-4 z-10 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[11px] font-mono text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              >
                Click to expand ↗
              </div>
            </div>
          </div>
        </div>

        {/* Fullscreen Interactive Lightbox Modal */}
        <AnimatePresence>
          {isFullscreen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-10 select-none"
              onClick={() => setIsFullscreen(false)}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {/* Top Header: Counter, Navigation & Close */}
              <div
                className="relative z-50 flex items-center justify-between w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="font-mono text-xs uppercase tracking-[0.25em] text-indigo-400 font-semibold">
                    // Frame {numFormatted} / {totalFormatted}
                  </span>
                  <span className="text-white/40 text-xs">·</span>
                  <span className="font-space text-xs sm:text-sm font-bold text-white truncate max-w-[140px] sm:max-w-none">
                    {current.title}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-3">
                  {/* Mobile-Only Header Navigation Arrows: Never Overlaps Photo */}
                  <div className="flex sm:hidden items-center gap-1">
                    <button
                      type="button"
                      onClick={goToPrev}
                      className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                      aria-label="Previous image"
                    >
                      <IoChevronBack size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={goToNext}
                      className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                      aria-label="Next image"
                    >
                      <IoChevronForward size={18} />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsFullscreen(false)}
                    className="p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer ml-1"
                    aria-label="Close fullscreen"
                  >
                    <IoClose size={20} />
                  </button>
                </div>
              </div>

              {/* Center Main Image Viewport with Floating Prev/Next Buttons */}
              <div
                className="relative flex-1 flex items-center justify-center my-2 sm:my-4 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Desktop Floating Left Arrow: Hidden on mobile so it NEVER obstructs the photo */}
                <button
                  type="button"
                  onClick={goToPrev}
                  className="hidden sm:flex absolute left-4 sm:left-8 z-50 p-4 rounded-full bg-black/50 hover:bg-black/80 border border-white/20 text-white transition-all cursor-pointer shadow-xl backdrop-blur-md hover:scale-110 active:scale-95"
                  aria-label="Previous image"
                >
                  <IoChevronBack size={24} />
                </button>

                {/* Desktop Floating Right Arrow: Hidden on mobile so it NEVER obstructs the photo */}
                <button
                  type="button"
                  onClick={goToNext}
                  className="hidden sm:flex absolute right-4 sm:right-8 z-50 p-4 rounded-full bg-black/50 hover:bg-black/80 border border-white/20 text-white transition-all cursor-pointer shadow-xl backdrop-blur-md hover:scale-110 active:scale-95"
                  aria-label="Next image"
                >
                  <IoChevronForward size={24} />
                </button>

                {/* Image Display with Gemini-Style Iridescent Skeleton */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="flex flex-col items-center justify-center max-h-full max-w-full px-2 sm:px-12"
                  >
                    {/* Guaranteed Proportional Viewport Frame - Never Cuts Text or Overflows */}
                    <div className="relative flex items-center justify-center h-[56vh] sm:h-[62vh] w-[94vw] sm:w-[90vw] max-w-[900px] overflow-hidden rounded-2xl">
                      {/* Progressive Blurred Preview + Cool Atmospheric Developing Skeleton */}
                      {!isFullImageLoaded && (
                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gemini-skeleton">
                          <img
                            src={current.thumb || current.medium}
                            alt=""
                            className="absolute inset-0 w-full h-full object-contain filter blur-xl opacity-60 scale-105"
                          />
                          <div className="relative z-10 flex items-center gap-2.5 px-4 py-2 rounded-full bg-black/70 border border-white/20 shadow-2xl backdrop-blur-xl">
                            <div className="relative flex items-center justify-center">
                              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping absolute" />
                              <span className="w-2 h-2 rounded-full bg-indigo-500" />
                            </div>
                            <span className="font-mono text-xs uppercase tracking-wider text-white font-medium">
                              Developing Exposure // Frame {numFormatted}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Main Optimized Responsive Image */}
                      <img
                        src={current.medium || current.full}
                        srcSet={`${current.thumb} 320w, ${current.medium} 768w, ${current.full} 1400w`}
                        sizes="(max-width: 640px) 94vw, (max-width: 1024px) 75vw, 900px"
                        alt={current.title}
                        loading="eager"
                        decoding="async"
                        onLoad={() => setIsFullImageLoaded(true)}
                        className={`max-h-full max-w-full object-contain rounded-2xl shadow-2xl transition-opacity duration-300 ease-out ${
                          isFullImageLoaded ? "opacity-100" : "opacity-0"
                        }`}
                      />
                    </div>

                    {/* Description and EXIF Area with Guaranteed Breathing Room */}
                    <div className="mt-2 sm:mt-3 text-center min-h-[46px] flex flex-col items-center justify-center">
                      <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        className="flex flex-col items-center"
                      >
                        <p className="font-caveat text-lg sm:text-2xl text-indigo-300 drop-shadow-sm">
                          "{current.description}"
                        </p>
                        <p className="font-mono text-[10px] sm:text-[11px] text-white/60 mt-0.5 tracking-wider">
                          📷 {currentExif}
                        </p>
                      </motion.div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Bottom Navigation Hint & Thumbnail Strip */}
              <div
                className="relative z-50 flex flex-col items-center gap-2 sm:gap-3 w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-center gap-2 overflow-x-auto max-w-full py-1.5 scrollbar-none px-2 sm:px-4">
                  {images.map((img: prcocessedimages, idx: number) => {
                    const isActive = idx === currentIndex;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setPrevIndex(currentIndex);
                          setDirection(idx > currentIndex ? "next" : "prev");
                          setCurrentIndex(idx);
                        }}
                        className={`relative flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden border transition-all cursor-pointer ${
                          isActive
                            ? "border-indigo-400 ring-2 ring-indigo-400 scale-105 sm:scale-110"
                            : "border-white/20 opacity-50 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={img.thumb || img.medium}
                          alt={img.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </button>
                    );
                  })}
                </div>

                <p className="hidden sm:block font-mono text-[11px] text-white/50 tracking-wider">
                  Use ← / → keys or arrows to navigate · Click anywhere outside to close
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
