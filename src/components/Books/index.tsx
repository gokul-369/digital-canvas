import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { IoCloseOutline, IoSyncOutline } from "react-icons/io5";
import { booksList, type BookItem } from "../../data/books";
import ThreeDBookShelf from "./ThreeDBookShelf";
import SectionHeader from "../SectionHeader";

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
      className="relative min-h-dvh w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-12 flex flex-col items-center bg-transparent overflow-hidden"
    >
      {/* Dynamic Ambient Background Aura */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center -z-10 overflow-hidden"
      >
        <div
          className="w-[700px] h-[450px] rounded-full blur-[140px] transition-all duration-700 opacity-20 dark:opacity-25"
          style={{
            backgroundColor: selectedBook ? selectedBook.foilColor : "#818cf8",
          }}
        />
      </div>

      {/* Section Header */}
      <SectionHeader
        tag="Literary Archive"
        title="Curated 3D"
        accent="bookshelf"
        description="A tactile 3D book shelf inspired by ThreeUI's Ashen Press. Click any volume to lift it off the shelf and inspect its details."
        className="mb-6 sm:mb-8"
      />

      {/* Main 3D Stage Frame (Holds the 3D Shelf and Detail Overlay) */}
      <div className="relative w-full max-w-7xl aspect-[16/11] sm:aspect-[16/9] lg:aspect-[21/11] max-h-[660px] rounded-3xl overflow-hidden border border-slate-200/90 dark:border-white/10 bg-gradient-to-b from-slate-900/10 via-slate-900/25 to-slate-950/50 dark:from-white/[0.02] dark:to-black/80 backdrop-blur-2xl shadow-2xl flex items-center justify-center">
        {/* 3D WebGL Double-Decker Bookshelf */}
        <ThreeDBookShelf
          selectedBook={selectedBook}
          onSelectBook={setSelectedBook}
          isFlipped={isFlipped}
          onToggleFlip={() => setIsFlipped(!isFlipped)}
          className="w-full h-full"
        />

        {/* Ambient Top Hint Bar */}
        <div className="absolute top-4 left-5 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/75 dark:bg-black/70 backdrop-blur-md border border-white/15 text-[11px] font-mono text-white/90 pointer-events-none shadow-md">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          <span>
            {selectedBook
              ? "Drag book to rotate in 3D · Click background to return"
              : "Click any book on the shelf to inspect"}
          </span>
        </div>

        {/* Total Volumes Counter */}
        <div className="absolute top-4 right-5 z-20 font-mono text-xs text-white/90 px-3.5 py-1.5 rounded-full bg-slate-900/75 dark:bg-black/70 backdrop-blur-md border border-white/15 pointer-events-none shadow-md">
          // {booksList.length} Volumes on Shelf
        </div>

        {/* --- ASHEN PRESS TORN-PAPER DETAIL SHEET --- */}
        <AnimatePresence>
          {selectedBook && (
            <motion.div
              key="detail-sheet"
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: "0%", opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{
                duration: 0.55,
                ease: [0.16, 1, 0.3, 1], // Critically damped spring
              }}
              className="absolute top-0 left-0 bottom-0 z-30 w-full sm:w-[420px] lg:w-[460px] pointer-events-auto flex flex-col justify-between p-7 sm:p-9 shadow-[25px_0_60px_rgba(0,0,0,0.6)]"
              style={{
                // Ashen Press warm parchment body with organic deckled torn-paper right edge
                background:
                  "linear-gradient(135deg, #f5ecd9 0%, #ebe0ca 60%, #e2d3b8 100%)",
                clipPath:
                  "polygon(0% 0%, 96.5% 0%, 98.2% 4%, 96.0% 8%, 97.8% 13%, 95.5% 18%, 98.0% 23%, 96.2% 28%, 98.5% 33%, 95.8% 38%, 97.9% 43%, 95.5% 48%, 98.1% 53%, 96.0% 59%, 98.3% 65%, 95.7% 71%, 98.0% 77%, 96.2% 83%, 97.8% 89%, 95.6% 95%, 97.0% 100%, 0% 100%)",
              }}
            >
              {/* Torn Paper Header with Close Button */}
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-[#c8baa3]/70">
                  <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#786650] font-semibold">
                    // ARCHIVAL RECORD
                  </span>

                  <button
                    type="button"
                    onClick={() => setSelectedBook(null)}
                    className="p-1.5 rounded-full hover:bg-black/10 text-[#4a3f31] transition-colors cursor-pointer"
                    title="Return to Shelf (Esc)"
                    aria-label="Return to Shelf"
                  >
                    <IoCloseOutline size={22} />
                  </button>
                </div>

                {/* Name (Title) */}
                <div className="mt-8 space-y-3">
                  <h3 className="font-space text-3xl sm:text-4xl font-bold tracking-tight text-[#1e1914] leading-tight">
                    {selectedBook.name}
                  </h3>

                  {/* Subtext */}
                  {selectedBook.subtext && (
                    <p className="font-caveat text-2xl sm:text-3xl text-[#5c4a35] leading-snug">
                      "{selectedBook.subtext}"
                    </p>
                  )}
                </div>

                {/* Author & Year Metadata */}
                <div className="mt-8 pt-6 border-t border-[#c8baa3]/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs uppercase tracking-wider text-[#7a6b57]">
                      Author
                    </span>
                    <span className="font-space text-sm font-bold text-[#221c16]">
                      {selectedBook.author}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs uppercase tracking-wider text-[#7a6b57]">
                      Year
                    </span>
                    <span className="font-mono text-xs font-semibold text-[#221c16]">
                      {selectedBook.year}
                    </span>
                  </div>

                  {selectedBook.isCurrentlyReading && (
                    <div className="flex items-center justify-between pt-2">
                      <span className="font-mono text-xs uppercase tracking-wider text-[#7a6b57]">
                        Status
                      </span>
                      <span className="inline-flex items-center gap-1.5 font-mono text-[11px] px-2.5 py-0.5 rounded-full bg-[#3d3280]/10 border border-[#3d3280]/25 text-[#3d3280] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#3d3280] animate-pulse" />
                        Currently Reading
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Controls: Flip Book & Return to Shelf */}
              <div className="pt-6 border-t border-[#c8baa3]/70 space-y-2.5">
                <button
                  type="button"
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="w-full py-3 px-4 rounded-xl bg-[#26201a] hover:bg-[#362f27] text-[#f5ebd9] font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-98"
                >
                  <IoSyncOutline size={15} />
                  <span>{isFlipped ? "View Front Cover" : "Inspect Back Cover (Flip)"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedBook(null)}
                  className="w-full py-2.5 px-4 rounded-xl border border-[#b8a78e] hover:bg-black/5 text-[#4a3f31] font-mono text-xs font-medium flex items-center justify-center transition-all cursor-pointer active:scale-98"
                >
                  Return to Shelf (Esc)
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
