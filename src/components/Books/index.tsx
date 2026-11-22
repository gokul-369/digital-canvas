import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { booksList, type BookItem } from "../../data/books";
import ThreeDBookShelf from "./ThreeDBookShelf";
import SectionHeader from "../SectionHeader";
import useTheme from "../../hooks/useTheme";
import { IoCloseOutline, IoSyncOutline, IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";

export default function BooksSection() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [selectedBook, setSelectedBook] = useState<BookItem | null>(null);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [scrollIndex, setScrollIndex] = useState<number>(0);
  const [isDossierCollapsed, setIsDossierCollapsed] = useState<boolean>(false);

  // Reset flip state and hide floating nav when inspecting a book
  useEffect(() => {
    setIsFlipped(false);
    setIsDossierCollapsed(false);
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

  const [maxScroll, setMaxScroll] = useState<number>(() =>
    Math.max(0, booksList.length - (typeof window !== "undefined" && window.innerWidth < 640 ? 1 : 3))
  );

  useEffect(() => {
    const updateMaxScroll = () => {
      const isMobile = window.innerWidth < 640;
      setMaxScroll(Math.max(0, booksList.length - (isMobile ? 1 : 3)));
    };
    updateMaxScroll();
    window.addEventListener("resize", updateMaxScroll);
    return () => window.removeEventListener("resize", updateMaxScroll);
  }, []);

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
            description="Fifteen influential classics and modern philosophy that shaped my perspective, engineering discipline, and mental models."
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
          theme={theme}
          className="w-full h-full"
        />
      </div>

      {/* DESKTOP SHELF NAVIGATION ARROWS (Hidden on mobile so they don't cover book covers) */}
      <AnimatePresence>
        {!selectedBook && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-y-0 left-0 right-0 z-20 pointer-events-none hidden sm:flex items-center justify-between px-6 sm:px-8"
          >
            {/* Prev Button */}
            <button
              type="button"
              onClick={handlePrev}
              disabled={scrollIndex <= 0}
              className={`w-11 h-11 rounded-full backdrop-blur-md border flex items-center justify-center transition-all pointer-events-auto cursor-pointer shadow-lg active:scale-95 ${
                isDark
                  ? "bg-[#080d1a]/85 border-white/15 text-white hover:bg-white/20"
                  : "bg-white/90 border-slate-200 text-slate-800 hover:bg-slate-100 shadow-slate-200"
              } ${scrollIndex <= 0 ? "opacity-25 cursor-not-allowed" : "hover:scale-105"}`}
              title="Previous Books (Left Arrow)"
            >
              <IoChevronBackOutline size={20} />
            </button>

            {/* Next Button */}
            <button
              type="button"
              onClick={handleNext}
              disabled={scrollIndex >= maxScroll}
              className={`w-11 h-11 rounded-full backdrop-blur-md border flex items-center justify-center transition-all pointer-events-auto cursor-pointer shadow-lg active:scale-95 ${
                isDark
                  ? "bg-[#080d1a]/85 border-white/15 text-white hover:bg-white/20"
                  : "bg-white/90 border-slate-200 text-slate-800 hover:bg-slate-100 shadow-slate-200"
              } ${scrollIndex >= maxScroll ? "opacity-25 cursor-not-allowed" : "hover:scale-105"}`}
              title="Next Books (Right Arrow)"
            >
              <IoChevronForwardOutline size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SHELF CAROUSEL CONTROLS (Bottom Center): Flanked by Prev/Next on Mobile */}
      <AnimatePresence>
        {!selectedBook && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="relative z-20 w-full pb-6 px-4 flex items-center justify-center gap-2.5 sm:gap-3 pointer-events-none"
          >
            {/* Mobile Prev Button */}
            <button
              type="button"
              onClick={handlePrev}
              disabled={scrollIndex <= 0}
              className={`sm:hidden w-8 h-8 rounded-full backdrop-blur-md border flex items-center justify-center transition-all pointer-events-auto cursor-pointer shadow-md active:scale-95 ${
                isDark
                  ? "bg-[#080d1a]/90 border-white/15 text-white"
                  : "bg-white/95 border-slate-200 text-slate-800"
              } ${scrollIndex <= 0 ? "opacity-25 cursor-not-allowed" : ""}`}
              title="Previous Book"
            >
              <IoChevronBackOutline size={16} />
            </button>

            <div className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-md border pointer-events-auto transition-colors max-w-[70vw] sm:max-w-[92vw] overflow-x-auto scrollbar-none ${
              isDark
                ? "bg-[#060a14]/70 border-white/10"
                : "bg-white/85 border-slate-200 shadow-sm"
            }`}>
              {Array.from({ length: maxScroll + 1 }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setScrollIndex(i)}
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all cursor-pointer flex-shrink-0 ${
                    Math.round(scrollIndex) === i
                      ? "w-5 sm:w-6 bg-indigo-500"
                      : isDark
                        ? "bg-white/25 hover:bg-white/50"
                        : "bg-slate-300 hover:bg-slate-400"
                  }`}
                  title={`Shelf Page ${i + 1}`}
                />
              ))}
            </div>

            {/* Mobile Next Button */}
            <button
              type="button"
              onClick={handleNext}
              disabled={scrollIndex >= maxScroll}
              className={`sm:hidden w-8 h-8 rounded-full backdrop-blur-md border flex items-center justify-center transition-all pointer-events-auto cursor-pointer shadow-md active:scale-95 ${
                isDark
                  ? "bg-[#080d1a]/90 border-white/15 text-white"
                  : "bg-white/95 border-slate-200 text-slate-800"
              } ${scrollIndex >= maxScroll ? "opacity-25 cursor-not-allowed" : ""}`}
              title="Next Book"
            >
              <IoChevronForwardOutline size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* WORKSHOP CODEX SEAMLESS IMMERSIVE DOSSIER (Seamless floating text on desktop, clean bottom-sheet on mobile) */}
      <AnimatePresence>
        {selectedBook && (
          <motion.div
            key="workshop-codex-immersive-dossier"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{
              duration: 0.35,
              ease: [0.16, 1, 0.3, 1],
            }}
            className={`absolute ${
              isDossierCollapsed ? "top-[88vh]" : "top-[54vh]"
            } sm:top-0 left-0 sm:left-auto right-0 bottom-0 z-50 w-full sm:w-[48vw] md:w-[46vw] lg:w-[42vw] max-w-[580px] pointer-events-auto flex flex-col justify-between overflow-y-auto rounded-t-3xl sm:rounded-none shadow-2xl sm:shadow-none transition-[top] duration-300 ease-out touch-pan-y ${
              isDark
                ? "bg-[#030611]/95 sm:bg-transparent backdrop-blur-xl sm:backdrop-blur-none border-t sm:border-t-0 border-white/15"
                : "bg-white/95 sm:bg-transparent backdrop-blur-xl sm:backdrop-blur-none border-t sm:border-t-0 border-slate-200/80"
            }`}
            style={{ touchAction: "pan-y" }}
          >
            {/* Top mobile pull handle button (Tapping collapses/expands to give 88% screen to 3D book) */}
            <button
              type="button"
              onClick={() => setIsDossierCollapsed(!isDossierCollapsed)}
              className="w-full pt-2.5 pb-1 sm:hidden flex flex-col items-center justify-center cursor-pointer group select-none"
              title={isDossierCollapsed ? "Expand Details" : "Collapse for 3D View"}
            >
              <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-white/30 group-hover:bg-indigo-400 transition-colors" />
              <span className="text-[9px] font-mono tracking-wider text-slate-400 dark:text-slate-400 mt-1 uppercase">
                {isDossierCollapsed ? "Tap to Read Takeaway & Quote ▲" : "Tap to Free 3D Canvas ▼"}
              </span>
            </button>

            {/* FOREGROUND CONTENT LAYER (100% UNMASKED, CRISP & RAZOR-SHARP) */}
            <div className="relative z-10 pt-3 sm:pt-14 pb-6 sm:pb-10 pl-5 sm:pl-10 lg:pl-12 pr-5 sm:pr-10 flex flex-col justify-between min-h-full">
              {/* Top Bar: Archival Tag, Big Title & Close Button aligned at top */}
              <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.26em] text-slate-500 dark:text-slate-400 uppercase block">
                    ARCHIVAL RECORD // 0{selectedBook.year}
                  </span>
                  <h2 className="font-space text-xl sm:text-3xl lg:text-[34px] font-bold tracking-tight text-slate-900 dark:text-white mt-1 leading-tight">
                    {selectedBook.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-space italic mt-0.5">
                    {selectedBook.subtext} · {selectedBook.author}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedBook(null)}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-200/80 hover:bg-slate-300 dark:bg-white/10 dark:hover:bg-white/20 text-slate-800 dark:text-white flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-md flex-shrink-0 ml-3"
                  title="Close (Esc)"
                >
                  <IoCloseOutline size={22} />
                </button>
              </div>

              {/* Clean Horizontal Divider Rule */}
              <div className="h-px bg-slate-200 dark:bg-white/10 my-3 sm:my-5" />

              {/* Authentic Famous Quote in Handwritten Script (Caveat) */}
              <blockquote
                className="text-lg sm:text-2xl text-amber-700 dark:text-amber-200/90 leading-relaxed tracking-wide my-2 sm:my-3"
                style={{ fontFamily: "'Caveat', cursive" }}
              >
                “{selectedBook.quote}”
              </blockquote>

              {/* Gokul's Personal Intake & Engineering Takeaway in Immersive Prose */}
              <div className="my-3 sm:my-4">
                <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-indigo-600 dark:text-indigo-400 block mb-1">
                  // Personal Intake & Engineering Takeaway
                </span>
                <p className="text-xs sm:text-[13px] text-slate-700 dark:text-slate-300 font-space leading-relaxed">
                  {selectedBook.review}
                </p>
              </div>

              {/* Archival Metadata Grid */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-3 sm:pt-4 my-2 border-t border-slate-200 dark:border-white/10 font-mono text-xs text-slate-600 dark:text-slate-300">
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block uppercase tracking-wider text-[10px]">Author</span>
                  <span className="text-slate-900 dark:text-white font-medium text-[11px] sm:text-xs">{selectedBook.author}</span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block uppercase tracking-wider text-[10px]">First Published</span>
                  <span className="text-slate-900 dark:text-white font-medium text-[11px] sm:text-xs">{selectedBook.year}</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions & Archival Footnote */}
            <div className="pt-4 sm:pt-6 space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2 sm:gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-slate-900 dark:bg-white text-white dark:text-[#03060f] font-mono text-xs font-semibold hover:bg-slate-800 dark:hover:bg-slate-200 transition-all shadow-sm flex items-center gap-1.5 active:scale-95 cursor-pointer"
                >
                  <IoSyncOutline size={14} />
                  <span>{isFlipped ? "Front" : "Flip 3D"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedBook(null)}
                  className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-800 dark:text-white border border-slate-300 dark:border-white/20 font-mono text-xs font-medium transition-all active:scale-95 cursor-pointer text-center"
                >
                  Close
                </button>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-400 dark:text-slate-500">
                <span>✦ GOKUL'S LITERARY CODEX</span>
                <span>15 VOLUMES ARCHIVED</span>
              </div>
            </div>
          </div>
        </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
