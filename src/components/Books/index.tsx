import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { booksList, type BookItem } from "../../data/books";
import ThreeDBookShelf from "./ThreeDBookShelf";
import SectionHeader from "../SectionHeader";
import { IoCloseOutline, IoSyncOutline, IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";

export default function BooksSection() {
  const [selectedBook, setSelectedBook] = useState<BookItem | null>(null);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [scrollIndex, setScrollIndex] = useState<number>(0);

  // Reset flip state when changing book or closing
  useEffect(() => {
    setIsFlipped(false);
  }, [selectedBook]);

  // Keyboard navigation: Escape closes foreground book, Space flips, Left/Right arrows scroll shelf
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedBook(null);
      } else if (e.key === " " && selectedBook) {
        setIsFlipped((prev) => !prev);
      } else if (e.key === "ArrowRight" && !selectedBook) {
        setScrollIndex((prev) => Math.min(booksList.length - 3, prev + 1));
      } else if (e.key === "ArrowLeft" && !selectedBook) {
        setScrollIndex((prev) => Math.max(0, prev - 1));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedBook]);

  const maxScroll = Math.max(0, booksList.length - 3);

  const handlePrev = () => {
    setScrollIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setScrollIndex((prev) => Math.min(maxScroll, prev + 1));
  };

  return (
    <section
      id="books"
      className="relative w-full h-full min-h-[740px] overflow-hidden flex flex-col justify-between select-none"
    >
      {/* SECTION HEADER CONSISTENT WITH OTHER SECTIONS */}
      <div className="relative z-20 w-full px-6 pt-8 pointer-events-none">
        <motion.div
          animate={{ opacity: selectedBook ? 0 : 1, y: selectedBook ? -12 : 0, pointerEvents: selectedBook ? "none" : "auto" }}
          transition={{ duration: 0.35 }}
        >
          <SectionHeader
            tag="LITERARY CODEX"
            title="The Bookshelf"
            accent="Volumes"
            description="Twelve influential classics and modern philosophy that shaped my perspective, engineering discipline, and mental models."
            className="mb-0"
          />
        </motion.div>
      </div>

      {/* FULL-BLEED 3D BOOKSHELF VIEWPORT */}
      <div className="absolute inset-0 w-full h-full z-10">
        <ThreeDBookShelf
          selectedBook={selectedBook}
          onSelectBook={setSelectedBook}
          isFlipped={isFlipped}
          onToggleFlip={() => setIsFlipped(!isFlipped)}
          scrollIndex={scrollIndex}
          onScrollIndexChange={setScrollIndex}
          className="w-full h-full"
        />
      </div>

      {/* HORIZONTAL SHELF NAVIGATION ARROWS (Visible when unselected) */}
      <AnimatePresence>
        {!selectedBook && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-y-0 left-0 right-0 z-20 pointer-events-none flex items-center justify-between px-4 sm:px-8"
          >
            {/* Prev Button */}
            <button
              type="button"
              onClick={handlePrev}
              disabled={scrollIndex <= 0}
              className={`w-11 h-11 rounded-full bg-[#080d1a]/80 backdrop-blur-md border border-white/15 text-white flex items-center justify-center transition-all pointer-events-auto cursor-pointer shadow-lg active:scale-95 ${
                scrollIndex <= 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-white/20 hover:scale-105"
              }`}
              title="Previous Books (Left Arrow)"
            >
              <IoChevronBackOutline size={20} />
            </button>

            {/* Next Button */}
            <button
              type="button"
              onClick={handleNext}
              disabled={scrollIndex >= maxScroll}
              className={`w-11 h-11 rounded-full bg-[#080d1a]/80 backdrop-blur-md border border-white/15 text-white flex items-center justify-center transition-all pointer-events-auto cursor-pointer shadow-lg active:scale-95 ${
                scrollIndex >= maxScroll ? "opacity-30 cursor-not-allowed" : "hover:bg-white/20 hover:scale-105"
              }`}
              title="Next Books (Right Arrow)"
            >
              <IoChevronForwardOutline size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SHELF CAROUSEL PAGINATION DOTS (Bottom Center) */}
      <AnimatePresence>
        {!selectedBook && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="relative z-20 w-full pb-6 flex items-center justify-center pointer-events-none"
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#060a14]/60 backdrop-blur-md border border-white/10 pointer-events-auto">
              {Array.from({ length: maxScroll + 1 }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setScrollIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                    Math.round(scrollIndex) === i ? "w-6 bg-indigo-400" : "bg-white/25 hover:bg-white/50"
                  }`}
                  title={`Shelf Page ${i + 1}`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* WORKSHOP CODEX INSPIRED RIGHT DETAIL DOSSIER (Frosted Glass Blur over 3D Scene) */}
      <AnimatePresence>
        {selectedBook && (
          <motion.div
            key="workshop-codex-detail-right"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 60 }}
            transition={{
              duration: 0.45,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="absolute top-0 right-0 bottom-0 z-30 w-full sm:w-[540px] md:w-[600px] lg:w-[660px] pointer-events-auto flex flex-col justify-between p-7 sm:p-10 lg:p-12 backdrop-blur-2xl bg-[#030612]/85 border-l border-white/10 shadow-[-30px_0_60px_rgba(0,0,0,0.9)] overflow-y-auto"
          >
            {/* Top Bar: Archival Tag & Close Button */}
            <div className="flex items-center justify-between pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.25em] text-slate-400 uppercase">
                  ARCHIVAL RECORD // 0{selectedBook.year}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedBook(null)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-md"
                title="Return to Shelf (Esc)"
              >
                <IoCloseOutline size={20} />
              </button>
            </div>

            {/* Main Editorial Content */}
            <div className="space-y-4 my-auto">
              {/* Category & Status Header */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-indigo-400 font-bold">
                  {selectedBook.author.toUpperCase()} · {selectedBook.year}
                </span>

                {selectedBook.isCurrentlyReading && (
                  <span className="inline-flex items-center gap-1.5 font-mono text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    CURRENTLY READING
                  </span>
                )}
              </div>

              {/* Title - Refined Editorial Sizing */}
              <div>
                <h2 className="font-space text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
                  {selectedBook.name}
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 font-space italic mt-1">
                  {selectedBook.subtext}
                </p>
              </div>

              {/* Authentic Famous Quote in Handwritten Script (Caveat) - Clean, No Left Border Line */}
              <blockquote
                className="text-xl sm:text-2xl text-amber-200/90 leading-snug tracking-wide py-1"
                style={{ fontFamily: "'Caveat', cursive" }}
              >
                “{selectedBook.quote}”
              </blockquote>

              {/* Gokul's Personal Intake & Engineering Takeaway */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-slate-400 block">
                  // Personal Intake & Engineering Takeaway
                </span>
                <p className="text-xs sm:text-[13px] text-slate-300 font-space leading-relaxed bg-white/[0.03] p-4 rounded-xl border border-white/5">
                  {selectedBook.review}
                </p>
              </div>

              {/* Archival Details Grid */}
              <div className="grid grid-cols-2 gap-3 pt-2 font-mono text-xs border-t border-white/10 text-slate-300">
                <div>
                  <span className="text-slate-500 block uppercase tracking-wider text-[10px]">Author</span>
                  <span className="text-white font-medium text-[11px] sm:text-xs">{selectedBook.author}</span>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase tracking-wider text-[10px]">First Published</span>
                  <span className="text-white font-medium text-[11px] sm:text-xs">{selectedBook.year}</span>
                </div>
              </div>

              {/* Action Buttons (Workshop Codex Style: Inspect Back Cover + Close) */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="flex-1 py-2.5 px-5 rounded-full bg-white text-[#03060f] font-mono text-xs font-bold hover:bg-slate-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                >
                  <IoSyncOutline size={15} />
                  <span>{isFlipped ? "View Front Cover" : "Inspect Back Cover"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedBook(null)}
                  className="py-2.5 px-5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 font-mono text-xs font-semibold transition-all active:scale-95 cursor-pointer text-center"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Bottom Archival Footnote */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>✦ GOKUL'S LITERARY CODEX</span>
              <span>12 VOLUMES ARCHIVED</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
