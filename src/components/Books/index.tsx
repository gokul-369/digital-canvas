import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { type BookItem } from "../../data/books";
import ThreeDBookShelf from "./ThreeDBookShelf";
import { IoCloseOutline, IoSyncOutline } from "react-icons/io5";

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
      className="relative w-full h-full min-h-[740px] overflow-hidden bg-[#03060f] flex flex-col justify-between select-none"
    >
      {/* Dynamic Cosmic Ambient Glow in Background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center overflow-hidden"
      >
        <div
          className="w-[950px] h-[650px] rounded-full blur-[180px] transition-all duration-1000 opacity-25"
          style={{
            backgroundColor: selectedBook ? selectedBook.foilColor : "#6366f1",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#03060f_92%)]" />
      </div>

      {/* PROMINENT SECTION HEADER */}
      <div className="relative z-20 w-full px-6 sm:px-12 lg:px-16 pt-8 pointer-events-none">
        <motion.div
          animate={{ opacity: selectedBook ? 0.35 : 1, y: selectedBook ? -8 : 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 max-w-7xl mx-auto"
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-[0.28em] text-indigo-400 font-bold">
                // 04 · LITERARY CODEX
              </span>
            </div>
            <h1 className="font-space text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mt-1.5">
              The Bookshelf
            </h1>
            <p className="text-sm sm:text-base text-slate-400 font-space max-w-xl mt-1.5 leading-relaxed">
              Twelve influential classics and modern philosophy that shaped my perspective, engineering discipline, and mental models.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 font-mono text-[11px] px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              {selectedBook ? "Drag to Orbit 360° · Click Outside to Return" : "Click Any Book on Shelf to Inspect"}
            </span>
          </div>
        </motion.div>
      </div>

      {/* FULL-BLEED 3D BOOKSHELF VIEWPORT (2 Tiers with 12 Books) */}
      <div className="absolute inset-0 w-full h-full z-10">
        <ThreeDBookShelf
          selectedBook={selectedBook}
          onSelectBook={setSelectedBook}
          isFlipped={isFlipped}
          onToggleFlip={() => setIsFlipped(!isFlipped)}
          className="w-full h-full"
        />
      </div>

      {/* LUXURY EDITORIAL DOSSIER (Slides in from Right on Book Selection) */}
      <AnimatePresence>
        {selectedBook && (
          <motion.div
            key="book-editorial-dossier"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: "0%", opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{
              duration: 0.48,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="absolute top-0 right-0 bottom-0 z-30 w-full sm:w-[460px] lg:w-[500px] pointer-events-auto flex flex-col justify-between p-8 sm:p-12 lg:p-14 bg-[#070b16]/92 backdrop-blur-2xl border-l border-white/10 shadow-[-25px_0_80px_rgba(0,0,0,0.85)]"
          >
            {/* Top Bar: Close Button */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] tracking-[0.24em] text-slate-400 uppercase">
                  ARCHIVAL RECORD // 0{selectedBook.year}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedBook(null)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white flex items-center justify-center transition-all cursor-pointer active:scale-95"
                title="Return to Shelf (Esc)"
              >
                <IoCloseOutline size={20} />
              </button>
            </div>

            {/* Main Editorial Content */}
            <div className="space-y-6 my-auto">
              {/* Category / Status Header */}
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="font-mono text-xs uppercase tracking-[0.22em] text-indigo-400 font-bold">
                  {selectedBook.author.toUpperCase()} · {selectedBook.year}
                </span>

                {selectedBook.isCurrentlyReading && (
                  <span className="inline-flex items-center gap-1.5 font-mono text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    CURRENTLY READING
                  </span>
                )}
              </div>

              {/* Title */}
              <h2 className="font-space text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight text-white leading-[1.08]">
                {selectedBook.name}
              </h2>

              {/* Golden / Indigo Accent Rule */}
              <div
                className="h-[2px] w-24 rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${selectedBook.foilColor}, transparent)`,
                }}
              />

              {/* Lyrical Subtext / Synopsis Block */}
              <blockquote className="border-l-2 border-white/20 pl-4 py-1 text-slate-200 font-space text-base sm:text-lg italic leading-relaxed">
                "{selectedBook.subtext}"
              </blockquote>

              {/* Archival Metadata Table */}
              <div className="grid grid-cols-2 gap-3 pt-2 font-mono text-xs border-t border-white/10 text-slate-300">
                <div>
                  <span className="text-slate-500 block uppercase tracking-wider text-[10px]">Author</span>
                  <span className="text-white font-medium">{selectedBook.author}</span>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase tracking-wider text-[10px]">First Published</span>
                  <span className="text-white font-medium">{selectedBook.year}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="flex-1 py-3 px-5 rounded-full bg-white text-[#03060f] font-mono text-xs font-bold hover:bg-slate-200 transition-all shadow-[0_0_25px_rgba(255,255,255,0.25)] flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                >
                  <IoSyncOutline size={16} />
                  <span>{isFlipped ? "View Front Cover" : "Inspect Back Cover"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedBook(null)}
                  className="py-3 px-5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 font-mono text-xs font-semibold transition-all active:scale-95 cursor-pointer text-center"
                >
                  Return to Shelf
                </button>
              </div>
            </div>

            {/* Bottom Archival Footnote */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>✦ GOKUL'S LITERARY CODEX</span>
              <span>12 VOLUMES ON SHELF</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
