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

  // Keyboard navigation: Escape closes foreground book, Space flips
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedBook(null);
      } else if (e.key === " " && selectedBook) {
        setIsFlipped((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedBook]);

  return (
    <section
      id="books"
      className="relative w-full h-full min-h-[700px] overflow-hidden bg-[#03060f] flex flex-col justify-between select-none"
    >
      {/* Dynamic Cosmic Ambient Glow in Background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center overflow-hidden"
      >
        <div
          className="w-[900px] h-[600px] rounded-full blur-[170px] transition-all duration-1000 opacity-25"
          style={{
            backgroundColor: selectedBook ? selectedBook.foilColor : "#6366f1",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#03060f_92%)]" />
      </div>

      {/* Top Header Hint */}
      <div className="relative z-20 w-full px-6 sm:px-12 pt-6 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs tracking-[0.28em] text-white/90 font-bold uppercase">
            ✦ LITERARY CODEX
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white/80">
            {selectedBook ? "Drag to Orbit · Click Outside to Return" : "Click Any Book on Shelf to Inspect"}
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

      {/* COSMIC GLASS DETAIL PANEL (Slides in from Left) */}
      <AnimatePresence>
        {selectedBook && (
          <motion.div
            key="cosmic-book-panel"
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: "0%", opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{
              duration: 0.5,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="absolute top-0 left-0 bottom-0 z-30 w-[92%] sm:w-[440px] lg:w-[480px] pointer-events-auto flex flex-col justify-center p-8 sm:p-14 bg-[#070b16]/92 backdrop-blur-2xl border-r border-white/10 shadow-[25px_0_80px_rgba(0,0,0,0.85)]"
          >
            {/* Subtle Aurora Accent Strip on the right edge */}
            <div
              className="absolute top-0 right-0 bottom-0 w-[2px] opacity-75"
              style={{
                background: `linear-gradient(to bottom, transparent, ${selectedBook.foilColor}, transparent)`,
              }}
            />

            {/* Typography Content Layer */}
            <div className="relative z-10 space-y-5 max-w-sm">
              {/* Eyebrow: Status or Author · Year */}
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-slate-400 font-semibold">
                  {selectedBook.author.toUpperCase()} · {selectedBook.year}
                </span>

                {selectedBook.isCurrentlyReading && (
                  <span className="inline-flex items-center gap-1.5 font-mono text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    CURRENTLY READING
                  </span>
                )}
              </div>

              {/* Title: Space Display Typography */}
              <h2 className="font-space text-3xl sm:text-4xl lg:text-[40px] font-bold tracking-tight text-white leading-[1.12]">
                {selectedBook.name}
              </h2>

              {/* Subtext: Concise Lyrical Synopsis */}
              <p className="font-space text-sm sm:text-[15px] text-slate-300 leading-relaxed pt-1">
                "{selectedBook.subtext}"
              </p>

              {/* Action Buttons: Look inside & Close Pills */}
              <div className="pt-6 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="px-6 py-2.5 rounded-full bg-white text-[#03060f] font-mono text-xs font-bold hover:bg-slate-200 transition-all shadow-[0_0_25px_rgba(255,255,255,0.25)] active:scale-95 cursor-pointer"
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

              {/* Footnote */}
              <div className="pt-8 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>✦ GOKUL'S ARCHIVE</span>
                <span>{selectedBook.year}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Catalogue Rail */}
      <div className="relative z-20 w-full px-6 sm:px-12 pb-5 flex items-center justify-center pointer-events-none overflow-x-auto scrollbar-none opacity-40 hover:opacity-90 transition-opacity duration-300">
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
