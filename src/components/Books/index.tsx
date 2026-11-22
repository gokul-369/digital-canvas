import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { booksList, type BookItem } from "../../data/books";
import ThreeDBookShelf from "./ThreeDBookShelf";

export default function BooksSection() {
  const [selectedBook, setSelectedBook] = useState<BookItem | null>(null);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  // Reset flip state when changing book or closing
  useEffect(() => {
    setIsFlipped(false);
  }, [selectedBook]);

  // Keyboard navigation: Escape closes foreground book
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedBook(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <section
      id="books"
      className="relative w-full h-screen min-h-[700px] overflow-hidden bg-[#03060f] flex flex-col justify-between select-none"
    >
      {/* SVG ClipPath for Organic Torn Deckled Edge */}
      <svg width="0" height="0" className="absolute pointer-events-none">
        <defs>
          <clipPath id="ashen-torn-edge" clipPathUnits="objectBoundingBox">
            <path d="M 0,0 L 0.94,0 
              C 0.95,0.02 0.92,0.04 0.95,0.06
              C 0.98,0.08 0.93,0.11 0.96,0.13
              C 0.92,0.16 0.97,0.19 0.94,0.22
              C 0.91,0.25 0.96,0.28 0.93,0.31
              C 0.97,0.34 0.93,0.37 0.96,0.40
              C 0.91,0.43 0.95,0.46 0.92,0.49
              C 0.97,0.52 0.93,0.55 0.95,0.58
              C 0.91,0.61 0.96,0.64 0.93,0.67
              C 0.98,0.70 0.93,0.73 0.96,0.76
              C 0.92,0.79 0.97,0.82 0.94,0.85
              C 0.91,0.88 0.96,0.91 0.93,0.94
              C 0.98,0.96 0.94,0.98 0.95,1.0
              L 0,1 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* Cosmic Nebula Ambient Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center overflow-hidden"
      >
        <div
          className="w-[850px] h-[550px] rounded-full blur-[160px] transition-all duration-1000 opacity-20"
          style={{
            backgroundColor: selectedBook ? selectedBook.foilColor : "#6366f1",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#03060f_92%)]" />
      </div>

      {/* Top Header Hint (Floating cleanly, non-intrusive) */}
      <div className="relative z-20 w-full px-6 sm:px-12 pt-6 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs tracking-[0.25em] text-white/80 font-bold uppercase">
            ✦ LITERARY ARCHIVE
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white/80">
            {selectedBook ? "Drag to Orbit · Click Outside to Return" : "Click Any Book to Inspect"}
          </span>
        </div>
      </div>

      {/* FULL-BLEED 3D BOOKSHELF VIEWPORT */}
      <div className="absolute inset-0 w-full h-full z-10">
        <ThreeDBookShelf
          selectedBook={selectedBook}
          onSelectBook={setSelectedBook}
          isFlipped={isFlipped}
          onToggleFlip={() => setIsFlipped(!isFlipped)}
          className="w-full h-full"
        />
      </div>

      {/* Depth-of-Field Lens Blur on Background Shelves when Book is Selected */}
      {selectedBook && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          onClick={() => setSelectedBook(null)}
          className="absolute inset-0 z-15 backdrop-blur-[6px] bg-[#03060f]/40 cursor-pointer pointer-events-auto"
        />
      )}

      {/* --- ASHEN PRESS TORN-PAPER DETAIL SHEET (Space Theme Edition) --- */}
      <AnimatePresence>
        {selectedBook && (
          <motion.div
            key="ashen-detail-sheet"
            initial={{ x: "-105%", opacity: 0 }}
            animate={{ x: "0%", opacity: 1 }}
            exit={{ x: "-105%", opacity: 0 }}
            transition={{
              duration: 0.5,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="absolute top-0 left-0 bottom-0 z-30 w-[90%] sm:w-[380px] lg:w-[420px] pointer-events-auto flex flex-col justify-center p-8 sm:p-12 shadow-[30px_0_90px_rgba(0,0,0,0.85)]"
            style={{
              clipPath: "url(#ashen-torn-edge)",
              background:
                "linear-gradient(135deg, rgba(12, 17, 28, 0.96) 0%, rgba(7, 10, 18, 0.98) 100%)",
              backdropFilter: "blur(30px)",
              borderRight: "1px solid rgba(255, 255, 255, 0.12)",
            }}
          >
            {/* Minimal Ashen Press Typography Layout */}
            <div className="space-y-4 max-w-sm">
              {/* Header: AUTHOR · YEAR */}
              <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-400 font-semibold block">
                {selectedBook.author.toUpperCase()} · {selectedBook.year}
                {selectedBook.isCurrentlyReading && (
                  <span className="ml-2.5 text-indigo-400 font-bold">● CURRENTLY READING</span>
                )}
              </span>

              {/* Title (Large Display Typography) */}
              <h2 className="font-space text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                {selectedBook.name}
              </h2>

              {/* Subtext (Concise 2-Line Lyrical Synopsis) */}
              <p className="font-space text-sm sm:text-base text-slate-300 leading-relaxed pt-1">
                "{selectedBook.subtext}"
              </p>

              {/* Action Buttons: Look inside & Close Pills (Exactly like Ashen Press screenshot) */}
              <div className="pt-6 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="px-6 py-2.5 rounded-full bg-white text-slate-950 font-mono text-xs font-bold hover:bg-slate-200 transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  {isFlipped ? "Look front" : "Look inside"}
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedBook(null)}
                  className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 font-mono text-xs font-semibold transition-all shadow-sm active:scale-95 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Ashen Press Catalogue Strip (Faint along floor) */}
      <div className="relative z-20 w-full px-6 sm:px-12 pb-5 flex items-center justify-center pointer-events-none overflow-x-auto scrollbar-none opacity-30 hover:opacity-80 transition-opacity duration-300">
        <div className="flex items-center gap-6 sm:gap-10 text-[10px] font-mono tracking-wider text-slate-400 whitespace-nowrap">
          {booksList.map((item) => (
            <span
              key={item.id}
              className={`transition-colors ${
                selectedBook?.id === item.id ? "text-indigo-400 font-bold" : "hover:text-white"
              }`}
            >
              {item.year} · {item.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
