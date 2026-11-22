import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { booksList } from "../../data/books";
import ThreeDBookShelf from "./ThreeDBookShelf";
import SectionHeader from "../SectionHeader";

export default function BooksSection() {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const currentBook = booksList[selectedIndex] || booksList[0];

  // Keyboard navigation (ArrowLeft & ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setSelectedIndex((prev) => (prev + 1) % booksList.length);
      } else if (e.key === "ArrowLeft") {
        setSelectedIndex((prev) => (prev - 1 + booksList.length) % booksList.length);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % booksList.length);
  };

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev - 1 + booksList.length) % booksList.length);
  };

  return (
    <section
      id="books"
      className="relative min-h-dvh w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-16 flex flex-col items-center bg-transparent overflow-hidden"
    >
      {/* Dynamic Ambient Background Aura */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center -z-10 overflow-hidden"
      >
        <div
          className="w-[600px] h-[400px] rounded-full blur-[130px] transition-all duration-700 opacity-20 dark:opacity-25"
          style={{ backgroundColor: currentBook.foilColor }}
        />
      </div>

      {/* Section Header */}
      <SectionHeader
        tag="Literary Archive"
        title="Curated 3D"
        accent="bookshelf"
        description="A tactile 3D book shelf inspired by ThreeUI's Ashen Press. Swipe or click to slide volumes, and drag the active book to inspect in 3D."
        className="mb-6 sm:mb-8"
      />

      {/* Main 3D Shelf Canvas Viewport */}
      <div className="relative w-full max-w-6xl aspect-[16/10] sm:aspect-[16/9] lg:aspect-[21/10] max-h-[540px] rounded-3xl overflow-hidden border border-slate-200/90 dark:border-white/10 bg-gradient-to-b from-slate-900/10 via-slate-900/20 to-slate-950/40 dark:from-white/[0.02] dark:to-black/70 backdrop-blur-2xl shadow-2xl flex items-center justify-center mb-8">
        <ThreeDBookShelf
          selectedIndex={selectedIndex}
          onSelectIndex={setSelectedIndex}
          className="w-full h-full"
        />

        {/* Top Hint Pill */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/70 dark:bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-mono text-white/80 pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          <span>Interactive 3D Shelf · Click / Drag to Browse</span>
        </div>

        {/* Counter Pill */}
        <div className="absolute top-4 right-4 z-10 font-mono text-xs text-white/80 px-3 py-1.5 rounded-full bg-slate-900/70 dark:bg-black/60 backdrop-blur-md border border-white/15 pointer-events-none">
          // {selectedIndex + 1} of {booksList.length}
        </div>

        {/* Left / Right Nav Arrows */}
        <button
          type="button"
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-black/50 hover:bg-black/70 border border-white/20 text-white backdrop-blur-md transition-all cursor-pointer active:scale-90 shadow-lg"
          title="Previous Book"
          aria-label="Previous Book"
        >
          <IoChevronBack size={20} />
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-black/50 hover:bg-black/70 border border-white/20 text-white backdrop-blur-md transition-all cursor-pointer active:scale-90 shadow-lg"
          title="Next Book"
          aria-label="Next Book"
        >
          <IoChevronForward size={20} />
        </button>
      </div>

      {/* Selected Book Minimal Dossier: Name, Subtext, Author, Year */}
      <div className="w-full max-w-2xl text-center z-10 mb-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentBook.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-2 p-6 sm:p-7 rounded-3xl bg-white/60 dark:bg-white/[0.04] backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-lg"
          >
            {/* Name (Title) */}
            <h3 className="font-space text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              {currentBook.name}
            </h3>

            {/* Subtext */}
            {currentBook.subtext && (
              <p className="font-caveat text-xl sm:text-2xl text-indigo-600 dark:text-indigo-400">
                "{currentBook.subtext}"
              </p>
            )}

            {/* Author & Year */}
            <div className="pt-2 flex items-center justify-center gap-3 text-xs sm:text-sm font-mono text-slate-600 dark:text-slate-300">
              <span className="font-semibold text-slate-900 dark:text-white">
                {currentBook.author}
              </span>
              <span>·</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                {currentBook.year}
              </span>
              {currentBook.isCurrentlyReading && (
                <>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-500 dark:text-indigo-300 text-[11px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                    Currently Reading
                  </span>
                </>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Horizontal Thumbnail Strip for Quick Jumping */}
      <div className="w-full max-w-6xl z-10">
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-indigo-500/20">
          {booksList.map((item, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={`relative flex-shrink-0 w-24 sm:w-28 p-2 rounded-2xl border transition-all text-left cursor-pointer group flex flex-col items-center ${
                  isSelected
                    ? "border-indigo-500 ring-2 ring-indigo-500/40 bg-white/90 dark:bg-white/[0.08] shadow-lg -translate-y-1.5"
                    : "border-slate-200/80 dark:border-white/10 bg-white/50 dark:bg-white/[0.02] hover:border-indigo-400/50 hover:bg-white/80 dark:hover:bg-white/[0.05]"
                }`}
              >
                {/* Actual Book Cover Thumbnail */}
                <div className="w-full aspect-[2/3] rounded-xl overflow-hidden shadow-sm mb-2">
                  <img
                    src={item.coverImage}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>

                <span className="font-space text-[11px] font-bold text-slate-900 dark:text-white text-center line-clamp-1 w-full">
                  {item.name}
                </span>
                <span className="font-mono text-[9px] text-slate-500 dark:text-slate-400 text-center truncate w-full">
                  {item.author}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
