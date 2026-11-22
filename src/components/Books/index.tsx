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

  // Reset flip state and hide floating nav when inspecting a book
  useEffect(() => {
    setIsFlipped(false);
    if (selectedBook) {
      document.body.classList.add("book-inspect-open");
    } else {
      document.body.classList.remove("book-inspect-open");
    }
    return () => {
      document.body.classList.remove("book-inspect-open");
    };
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
      className="relative w-full min-h-screen h-[100dvh] overflow-hidden flex flex-col justify-between select-none"
    >
      {/* SECTION HEADER CONSISTENT WITH OTHER SECTIONS - Sits comfortably below floating Nav */}
      <div className="relative z-20 w-full px-6 pt-24 sm:pt-28 lg:pt-32 pointer-events-none">
        <motion.div
          animate={{ opacity: selectedBook ? 0 : 1, y: selectedBook ? -16 : 0, pointerEvents: selectedBook ? "none" : "auto" }}
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
      <div className="absolute inset-0 w-full h-full z-10" data-lenis-prevent="true">
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

      {/* WORKSHOP CODEX SEAMLESS IMMERSIVE DOSSIER (Covers Nav at z-50, No Harsh Border, Progressive Blur) */}
      <AnimatePresence>
        {selectedBook && (
          <motion.div
            key="workshop-codex-immersive-dossier"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{
              duration: 0.45,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="absolute top-0 right-0 bottom-0 z-50 w-full sm:w-[540px] md:w-[600px] lg:w-[680px] pointer-events-auto flex flex-col justify-between pt-10 sm:pt-14 pb-8 sm:pb-10 px-8 sm:px-14 bg-gradient-to-r from-transparent via-[#02050f]/85 to-[#02050f]/98 backdrop-blur-xl overflow-y-auto"
            style={{
              WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 20%, black 100%)",
              maskImage: "linear-gradient(to right, transparent 0%, black 20%, black 100%)",
            }}
          >
            {/* Top Bar: Archival Tag, Big Title & Close Button aligned at top */}
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.26em] text-slate-400 uppercase block">
                    ARCHIVAL RECORD // 0{selectedBook.year}
                  </span>
                  <h2 className="font-space text-2xl sm:text-3xl lg:text-[34px] font-bold tracking-tight text-white mt-1.5 leading-tight">
                    {selectedBook.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 font-space italic mt-1">
                    {selectedBook.subtext} · {selectedBook.author}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedBook(null)}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-md flex-shrink-0 ml-4"
                  title="Close (Esc)"
                >
                  <IoCloseOutline size={22} />
                </button>
              </div>

              {/* Clean Horizontal Divider Rule */}
              <div className="h-px bg-white/10 my-4 sm:my-5" />

              {/* Authentic Famous Quote in Handwritten Script (Caveat) */}
              <blockquote
                className="text-xl sm:text-2xl text-amber-200/90 leading-relaxed tracking-wide my-3"
                style={{ fontFamily: "'Caveat', cursive" }}
              >
                “{selectedBook.quote}”
              </blockquote>

              {/* Gokul's Personal Intake & Engineering Takeaway in Immersive Prose */}
              <div className="my-4">
                <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-indigo-400 block mb-1.5">
                  // Personal Intake & Engineering Takeaway
                </span>
                <p className="text-xs sm:text-[13px] text-slate-300 font-space leading-relaxed">
                  {selectedBook.review}
                </p>
              </div>

              {/* Archival Metadata Grid */}
              <div className="grid grid-cols-2 gap-4 pt-4 my-2 border-t border-white/10 font-mono text-xs text-slate-300">
                <div>
                  <span className="text-slate-500 block uppercase tracking-wider text-[10px]">Author</span>
                  <span className="text-white font-medium text-[11px] sm:text-xs">{selectedBook.author}</span>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase tracking-wider text-[10px]">First Published</span>
                  <span className="text-white font-medium text-[11px] sm:text-xs">{selectedBook.year}</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions & Archival Footnote */}
            <div className="pt-6 space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
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

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>✦ GOKUL'S LITERARY CODEX</span>
                <span>12 VOLUMES ARCHIVED</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
