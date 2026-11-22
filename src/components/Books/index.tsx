import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  IoBookOutline,
  IoChevronBack,
  IoChevronForward,
  IoSparklesOutline,
  IoSyncOutline,
} from "react-icons/io5";
import { HiOutlineBookOpen } from "react-icons/hi2";
import { booksData } from "../../data/books";
import ThreeDBook from "./ThreeDBook";
import SectionHeader from "../SectionHeader";

const CATEGORIES = [
  "All",
  "Classics & Existentialism",
  "Philosophy & Journeys",
  "Mindset & Behavioral",
  "Contemporary Fiction",
] as const;

export default function BooksSection() {
  const [selectedBookId, setSelectedBookId] = useState<string>("trial");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Filter books by category
  const filteredBooks = useMemo(() => {
    if (activeCategory === "All") return booksData;
    return booksData.filter((b) => b.category === activeCategory);
  }, [activeCategory]);

  const currentBook = useMemo(() => {
    return booksData.find((b) => b.id === selectedBookId) || booksData[0];
  }, [selectedBookId]);

  const currentIndex = useMemo(() => {
    return filteredBooks.findIndex((b) => b.id === currentBook.id);
  }, [filteredBooks, currentBook]);

  const handleNext = () => {
    if (filteredBooks.length === 0) return;
    const nextIdx = (currentIndex + 1) % filteredBooks.length;
    setSelectedBookId(filteredBooks[nextIdx].id);
  };

  const handlePrev = () => {
    if (filteredBooks.length === 0) return;
    const prevIdx = (currentIndex - 1 + filteredBooks.length) % filteredBooks.length;
    setSelectedBookId(filteredBooks[prevIdx].id);
  };

  return (
    <section
      id="books"
      className="relative min-h-dvh w-full py-20 sm:py-28 px-4 sm:px-6 lg:px-20 flex flex-col items-center bg-transparent overflow-hidden"
    >
      {/* Dynamic Ambient Background Aura synchronized to book's accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center -z-10 overflow-hidden"
      >
        <div
          className="w-[600px] h-[450px] rounded-full blur-[120px] transition-all duration-700 opacity-25 dark:opacity-30"
          style={{ backgroundColor: currentBook.palette.accent }}
        />
      </div>

      {/* Header */}
      <SectionHeader
        tag="Literary Codex & 3D Library"
        title="Books that shaped my"
        accent="mindset & philosophy"
        description="A tactile 3D interactive bookshelf of timeless classics, existential meditations, and behavioural wisdom. Drag to rotate in 3D or open the cover to explore notes."
        className="mb-8 sm:mb-12"
      />

      {/* Category Filter Tabs - Smooth Glass Pill Slider */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 p-1.5 rounded-2xl bg-white/70 dark:bg-white/[0.04] backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-sm mb-8 sm:mb-12 max-w-3xl">
        {CATEGORIES.map((cat) => {
          const isSelected = activeCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setActiveCategory(cat);
                const matching =
                  cat === "All"
                    ? booksData
                    : booksData.filter((b) => b.category === cat);
                if (matching.length > 0 && !matching.some((b) => b.id === selectedBookId)) {
                  setSelectedBookId(matching[0].id);
                }
              }}
              className={`relative px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-mono font-medium transition-colors duration-200 cursor-pointer select-none ${
                isSelected
                  ? "text-white"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {isSelected && (
                <motion.div
                  layoutId="books-tab-active"
                  className="absolute inset-0 bg-indigo-600 rounded-xl shadow-md shadow-indigo-600/25 -z-0"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative z-10">{cat}</span>
            </button>
          );
        })}
      </div>

      {/* Main 3D Stage & Dossier Grid */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center z-10 mb-12">
        {/* Left Column: 3D Interactive WebGL Book Viewport */}
        <div className="lg:col-span-7 flex flex-col items-center w-full">
          {/* Glass Viewport Frame */}
          <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] max-h-[520px] rounded-3xl overflow-hidden border border-slate-200/90 dark:border-white/15 bg-gradient-to-b from-slate-900/5 via-slate-900/10 to-slate-900/25 dark:from-white/[0.03] dark:to-black/60 backdrop-blur-2xl shadow-2xl flex items-center justify-center p-2 sm:p-4">
            <ThreeDBook
              book={currentBook}
              isOpen={isOpen}
              onToggleOpen={() => setIsOpen(!isOpen)}
              className="w-full h-full"
            />

            {/* Hint Badge at Top Left */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/70 dark:bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-mono text-white/80 pointer-events-none">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <span>3D WebGL Mesh · Drag to rotate</span>
            </div>

            {/* Quick Open/Close Floating Action */}
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="absolute bottom-4 right-4 z-10 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer active:scale-95"
            >
              <HiOutlineBookOpen size={16} />
              <span>{isOpen ? "Close Book" : "Open Pages"}</span>
            </button>
          </div>

          {/* Viewport Control Bar */}
          <div className="mt-4 flex items-center justify-between w-full px-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrev}
                className="p-2.5 rounded-xl border border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-white/[0.04] backdrop-blur-md text-slate-800 dark:text-white hover:bg-white/90 dark:hover:bg-white/20 transition-all cursor-pointer active:scale-95 shadow-sm"
                title="Previous Book"
                aria-label="Previous Book"
              >
                <IoChevronBack size={18} />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="p-2.5 rounded-xl border border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-white/[0.04] backdrop-blur-md text-slate-800 dark:text-white hover:bg-white/90 dark:hover:bg-white/20 transition-all cursor-pointer active:scale-95 shadow-sm"
                title="Next Book"
                aria-label="Next Book"
              >
                <IoChevronForward size={18} />
              </button>
              <span className="font-mono text-xs text-slate-500 dark:text-slate-400 ml-2">
                // {currentIndex + 1} of {filteredBooks.length}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
            >
              <IoSyncOutline size={15} />
              <span>{isOpen ? "Return to Cover" : "Inspect Inside Pages"}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Literary Dossier & Reflection Plaque */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-5 z-10 p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-white/70 via-white/50 to-white/40 dark:from-white/[0.10] dark:via-white/[0.04] dark:to-white/[0.02] backdrop-blur-2xl backdrop-saturate-180 border border-white/80 dark:border-white/15 shadow-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentBook.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4"
            >
              {/* Header Badges */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200/60 dark:border-white/10">
                <span className="font-mono text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-semibold">
                  {currentBook.category}
                </span>

                {currentBook.status === "Currently Reading" ? (
                  <span className="inline-flex items-center gap-1.5 font-mono text-[11px] px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-400/40 text-indigo-600 dark:text-indigo-300 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
                    Currently Reading
                  </span>
                ) : (
                  <span className="font-mono text-[11px] px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-600 dark:text-amber-300 font-semibold">
                    ★ {currentBook.status.toUpperCase()}
                  </span>
                )}
              </div>

              {/* Title & Author */}
              <div>
                <h3 className="font-space text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {currentBook.title}
                </h3>
                {currentBook.subtitle && (
                  <p className="font-caveat text-xl text-slate-600 dark:text-slate-300 mt-0.5">
                    "{currentBook.subtitle}"
                  </p>
                )}
                <p className="font-mono text-xs text-indigo-600 dark:text-indigo-400 mt-2 font-medium">
                  {currentBook.author} · Published {currentBook.year}
                </p>
              </div>

              {/* Synopsis */}
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {currentBook.synopsis}
              </p>

              {/* Gokul's Personal Takeaway */}
              <div className="p-4 rounded-2xl bg-white/60 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10">
                <span className="font-mono text-[10px] uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-bold block mb-1">
                  // Gokul's Core Takeaway
                </span>
                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
                  {currentBook.takeaway}
                </p>
              </div>

              {/* Memorable Quote */}
              <div className="relative p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-400/20">
                <span className="font-serif text-3xl text-indigo-500/40 absolute top-2 left-3">“</span>
                <p className="font-caveat text-lg sm:text-xl text-indigo-900 dark:text-indigo-200 pl-5 pr-2 leading-snug">
                  {currentBook.quote}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Interactive Trigger Button */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="w-full py-3 px-4 rounded-2xl border border-indigo-500/40 bg-indigo-600/10 hover:bg-indigo-600/20 dark:border-indigo-400/30 text-indigo-600 dark:text-indigo-300 font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98 shadow-sm"
          >
            <IoSparklesOutline size={16} />
            <span>{isOpen ? "Close 3D Cover" : "Open 3D Book & Read Pages"}</span>
          </button>
        </div>
      </div>

      {/* Horizontal Interactive Bookshelf Strip */}
      <div className="w-full max-w-6xl z-10">
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-2">
            <IoBookOutline className="text-indigo-500 text-lg" />
            <h4 className="font-space text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Browse Entire Shelf ({filteredBooks.length} Books)
            </h4>
          </div>
          <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
            Click any volume to place into 3D viewport
          </span>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-indigo-500/20">
          {filteredBooks.map((b) => {
            const isSelected = b.id === currentBook.id;
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => setSelectedBookId(b.id)}
                className={`relative flex-shrink-0 w-36 sm:w-40 p-3 rounded-2xl border transition-all text-left cursor-pointer group flex flex-col justify-between h-48 ${
                  isSelected
                    ? "border-indigo-500 ring-2 ring-indigo-500/40 bg-white/90 dark:bg-white/[0.08] shadow-lg -translate-y-1"
                    : "border-slate-200/80 dark:border-white/10 bg-white/60 dark:bg-white/[0.02] hover:border-indigo-400/50 hover:bg-white/80 dark:hover:bg-white/[0.05]"
                }`}
                style={{
                  borderLeftColor: b.palette.accent,
                  borderLeftWidth: "4px",
                }}
              >
                <div>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-slate-500 dark:text-slate-400 block truncate">
                    {b.year} · {b.category.split(" ")[0]}
                  </span>
                  <h5 className="font-space text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-1.5 leading-snug line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {b.title}
                  </h5>
                  <p className="font-mono text-[10px] text-slate-600 dark:text-slate-400 mt-1 truncate">
                    {b.author}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/50 dark:border-white/10 flex items-center justify-between">
                  {b.status === "Currently Reading" ? (
                    <span className="font-mono text-[9px] text-indigo-500 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                      Reading
                    </span>
                  ) : (
                    <span className="font-mono text-[9px] text-amber-500 font-semibold">
                      ★ {b.rating}/5
                    </span>
                  )}
                  <span className="font-mono text-[9px] text-slate-400 group-hover:translate-x-0.5 transition-transform">
                    3D ↗
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
