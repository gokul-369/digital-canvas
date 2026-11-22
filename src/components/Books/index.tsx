import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { type BookItem } from "../../data/books";
import ThreeDBookShelf from "./ThreeDBookShelf";
import CosmicTornPanel from "./CosmicTornPanel";

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

      {/* FULL-BLEED 3D BOOKSHELF VIEWPORT (4 Shelves x 3 Books) */}
      <div className="absolute inset-0 w-full h-full z-10">
        <ThreeDBookShelf
          selectedBook={selectedBook}
          onSelectBook={setSelectedBook}
          isFlipped={isFlipped}
          onToggleFlip={() => setIsFlipped(!isFlipped)}
          className="w-full h-full"
        />
      </div>

      {/* COSMIC TORN-PAPER DETAIL SHEET (Left Side Panel) */}
      <AnimatePresence>
        {selectedBook && (
          <motion.div
            key="cosmic-torn-panel"
            initial={{ x: "-105%" }}
            animate={{ x: "0%" }}
            exit={{ x: "-105%" }}
            transition={{
              duration: 0.5,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="absolute top-0 left-0 bottom-0 z-30 w-[92%] sm:w-[440px] lg:w-[480px] pointer-events-auto flex flex-col justify-center p-8 sm:p-14"
          >
            {/* Procedural Cosmic Torn Paper with Stardust Fibers & Glowing Aurora Rim */}
            <CosmicTornPanel glowColor={selectedBook.foilColor || "#6366f1"} />

            {/* Typography Content Layer with Handwritten Elements */}
            <div className="relative z-10 space-y-4 max-w-sm pl-2 sm:pl-4">
              {/* Eyebrow: Status or Author · Year */}
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-indigo-300 font-semibold">
                  {selectedBook.author.toUpperCase()} · {selectedBook.year}
                </span>

                {selectedBook.isCurrentlyReading && (
                  <span className="inline-flex items-center gap-1.5 font-mono text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    CURRENTLY READING
                  </span>
                )}
              </div>

              {/* Title: Display Serif / Grotesk */}
              <h2 className="font-space text-3xl sm:text-4xl font-bold tracking-tight text-white leading-[1.12]">
                {selectedBook.name}
              </h2>

              {/* Subtext in Handwritten Font (Caveat) */}
              <p
                className="text-2xl sm:text-[28px] text-amber-200/90 leading-snug tracking-wide pt-1"
                style={{ fontFamily: "'Caveat', cursive" }}
              >
                "{selectedBook.subtext}"
              </p>

              {/* Handwritten Reading Log Annotation */}
              <p
                className="text-xl sm:text-2xl text-cyan-300/80 pt-0.5"
                style={{ fontFamily: "'Caveat', cursive" }}
              >
                ✦ Gokul's personal shelf archive
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
              <div className="pt-6 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>✦ LITERARY ARCHIVE</span>
                <span>{selectedBook.year}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
