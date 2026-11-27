import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLocation } from "react-router";
import {
  HiOutlineXMark,
  HiOutlineArrowUp,
  HiOutlineClipboard,
  HiOutlineCheck,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineArrowUpRight,
} from "react-icons/hi2";
import { MarkdownText } from "./MarkdownText";
import { AIBrandMark } from "./AIBrandMark";
import { useAppContext } from "../../context/AppContext";
import {
  bio,
  workExperiences,
  skills,
  educationItems,
  awards,
  socialLinks,
  album,
} from "../../data";
import { projectsList } from "../../data/projects";
import { booksList } from "../../data/books";

function buildDynamicPortfolioContext(currentPage: string) {
  return {
    currentPage,
    availableRoutes: {
      Home: "/#/",
      Experience: "/#/experience",
      Skills: "/#/skills",
      Projects: "/#/projects",
      Books: "/#/books",
      Gallery: "/#/gallery",
      VigiLens: "https://vigilens.gokul.ink",
      GitHub: "https://github.com/gokul-369",
      LinkedIn: "https://www.linkedin.com/in/gokulrao369",
    },
    bio,
    socialLinks,
    workExperiences,
    skills: skills.flat().map((s) => s.name),
    education: educationItems,
    awards: awards.map((a) => ({
      title: a.title,
      company: a.company,
      year: a.year,
      subTitle: a.subTitle,
    })),
    projects: projectsList.map((p) => ({
      title: p.title,
      tagline: p.tagline,
      liveUrl: p.liveUrl,
      githubUrl: p.githubUrl,
      stack: p.stack,
      description: p.description,
    })),
    books: booksList.map((b) => ({
      name: b.name,
      author: b.author,
      year: b.year,
      isCurrentlyReading: Boolean(b.isCurrentlyReading),
      review: b.review,
    })),
    photography: {
      totalPhotos: album.length,
      featured: album.slice(0, 12).map((p) => ({
        title: p.title,
        description: p.description,
      })),
    },
  };
}

interface CitationLink {
  label: string;
  url: string;
  kind: "internal" | "external";
}

interface Exchange {
  id: string;
  query: string;
  answer: string;
  meta?: {
    providerId?: string;
    model?: string;
    fallbackUsed?: boolean;
    latencyMs?: number;
    citations?: CitationLink[];
  };
}

const QUICK_TOPICS = [
  { label: "Work at TCS", prompt: "What is Gokul working on at TCS?" },
  {
    label: "VigiLens",
    prompt: "Tell me about VigiLens and its cloud architecture",
  },
  {
    label: "Tech Stack",
    prompt: "Summarize Gokul's frontend, DevOps, and AI engineering stack",
  },
  {
    label: "Reading Codex",
    prompt: "What is Gokul currently reading and what books inspire him?",
  },
];

function getGatewayBaseUrl(): string {
  const envUrl = import.meta.env.VITE_AI_GATEWAY_URL as string | undefined;
  if (envUrl && envUrl.trim()) return envUrl.replace(/\/+$/, "");
  return import.meta.env.DEV ? "http://localhost:3005" : "https://ai.gokul.ink";
}

export default function PortfolioAI() {
  const { pathname } = useLocation();
  const { isMobileDockOpen } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobileViewport(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<Exchange[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [copied, setCopied] = useState(false);

  const [streamingId, setStreamingId] = useState<string | null>(null);
  const [revealedChars, setRevealedChars] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const answerScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 140);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const currentExchange =
    activeIndex >= 0 && activeIndex < history.length
      ? history[activeIndex]
      : null;

  useEffect(() => {
    if (!streamingId || !currentExchange || currentExchange.id !== streamingId) {
      return;
    }
    if (revealedChars >= currentExchange.answer.length) {
      setStreamingId(null);
      return;
    }
    const timer = setTimeout(() => {
      const step = Math.max(6, Math.ceil(currentExchange.answer.length / 36));
      setRevealedChars((prev) =>
        Math.min(currentExchange.answer.length, prev + step),
      );
    }, 16);
    return () => clearTimeout(timer);
  }, [streamingId, revealedChars, currentExchange]);

  useEffect(() => {
    if (answerScrollRef.current) {
      answerScrollRef.current.scrollTop = answerScrollRef.current.scrollHeight;
    }
  }, [revealedChars]);

  async function askAssistant(rawText: string) {
    const query = rawText.trim();
    if (!query || loading) return;

    setError(null);
    setStreamingId(null);
    setInput("");
    setLoading(true);

    const priorMessages = history.flatMap((ex) => [
      { role: "user" as const, content: ex.query },
      { role: "assistant" as const, content: ex.answer },
    ]);

    try {
      const res = await fetch(`${getGatewayBaseUrl()}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          app: "portfolio",
          messages: [...priorMessages, { role: "user", content: query }],
          context: buildDynamicPortfolioContext(pathname),
        }),
      });

      const data = (await res.json()) as {
        ok?: boolean;
        reply?: string;
        error?: string;
        meta?: Exchange["meta"];
      };

      if (!res.ok || !data.ok || !data.reply) {
        throw new Error(data.error || "Unable to reach Gokul AI.");
      }

      const id = `ex-${Date.now()}`;
      const newExchange: Exchange = {
        id,
        query,
        answer: data.reply,
        meta: data.meta,
      };

      setHistory((prev) => {
        const next = [...prev, newExchange];
        setActiveIndex(next.length - 1);
        return next;
      });
      setRevealedChars(0);
      setStreamingId(id);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to get a response.",
      );
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    askAssistant(input);
  }

  function handleCopy() {
    if (!currentExchange) return;
    navigator.clipboard.writeText(currentExchange.answer).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  const isProcessing = loading || streamingId !== null;
  const displayedAnswer =
    currentExchange && streamingId === currentExchange.id
      ? currentExchange.answer.slice(0, revealedChars)
      : currentExchange?.answer || "";

  return (
    <>
      <style>{`
        @keyframes geminiSweep {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex flex-col justify-end overflow-hidden"
          >
            {/* 1. Immersive Scrim matching digital-resume canvas (#f8fafc / #030407) */}
            <div
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-[#f8fafc]/95 dark:bg-[#030407]/95"
            />

            {/* 2. Bottom-Up Aurora Curtain in Portfolio Palette (Indigo / Sky / Violet) */}
            <motion.div
              initial={{ opacity: 0, scaleY: 0.3, y: 80 }}
              animate={{
                opacity: isProcessing ? 1 : 0.72,
                scaleY: isProcessing ? 1.18 : 1,
                y: 0,
              }}
              exit={{ opacity: 0, scaleY: 0.3, y: 80 }}
              transition={{ type: "spring", stiffness: 220, damping: 26 }}
              style={{
                transformOrigin: "bottom center",
                background:
                  "radial-gradient(ellipse 85% 55% at 50% 100%, rgba(99,102,241,0.34) 0%, rgba(56,189,248,0.20) 36%, rgba(168,85,247,0.12) 60%, transparent 82%)",
              }}
              className="pointer-events-none absolute inset-x-0 bottom-0 h-[72vh] will-change-transform"
            />

            {/* 3. Subtle Bottom Horizon Light Beam */}
            <motion.div
              initial={{ scaleX: 0.15, opacity: 0 }}
              animate={{ scaleX: 1, opacity: isProcessing ? 1 : 0.75 }}
              exit={{ scaleX: 0.15, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px] will-change-transform"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, transparent, #38bdf8, #6366f1, #a855f7, #38bdf8, transparent)",
                backgroundSize: "200% 100%",
                animation: `geminiSweep ${isProcessing ? "1.4s" : "4.5s"} ease infinite`,
              }}
            />

            {/* 4. Immersive Open-Canvas Content Stage (NO chat box!) */}
            <div className="pointer-events-none relative z-10 mx-auto flex w-full max-w-2xl flex-col items-center px-5 pb-8 sm:pb-12">
              <div className="pointer-events-auto w-full">
                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.div
                      key="thinking"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.22 }}
                      className="mb-8 flex flex-col items-center text-center"
                    >
                      <p
                        className="bg-clip-text text-lg font-medium tracking-tight text-transparent"
                        style={{
                          backgroundImage:
                            "linear-gradient(90deg, #38bdf8, #6366f1, #a855f7, #38bdf8)",
                          backgroundSize: "200% 100%",
                          animation: "geminiSweep 1.8s ease infinite",
                        }}
                      >
                        Thinking…
                      </p>
                    </motion.div>
                  ) : error ? (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6 text-center text-sm text-rose-500 dark:text-rose-300"
                    >
                      {error}
                    </motion.div>
                  ) : currentExchange ? (
                    <motion.div
                      key={currentExchange.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 28,
                      }}
                      className="mb-7 space-y-4"
                    >
                      {/* Prompt Headline */}
                      <div className="flex items-start justify-between gap-4">
                        <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white sm:text-xl">
                          {currentExchange.query}
                        </h2>

                        <div className="flex shrink-0 items-center gap-1.5">
                          {history.length > 1 && (
                            <div className="flex items-center gap-0.5 rounded-full border border-slate-300/60 px-2 py-0.5 text-[11px] text-slate-600 dark:border-white/15 dark:text-slate-300">
                              <button
                                type="button"
                                disabled={activeIndex <= 0}
                                onClick={() =>
                                  setActiveIndex((i) => Math.max(0, i - 1))
                                }
                                className="p-0.5 disabled:opacity-30"
                              >
                                <HiOutlineChevronLeft className="h-3 w-3" />
                              </button>
                              <span className="font-mono">
                                {activeIndex + 1}/{history.length}
                              </span>
                              <button
                                type="button"
                                disabled={activeIndex >= history.length - 1}
                                onClick={() =>
                                  setActiveIndex((i) =>
                                    Math.min(history.length - 1, i + 1),
                                  )
                                }
                                className="p-0.5 disabled:opacity-30"
                              >
                                <HiOutlineChevronRight className="h-3 w-3" />
                              </button>
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={handleCopy}
                            title="Copy"
                            className="rounded-full p-1.5 text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                          >
                            {copied ? (
                              <HiOutlineCheck className="h-4 w-4 text-emerald-500" />
                            ) : (
                              <HiOutlineClipboard className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Open Editorial Response (no box!) */}
                      <div
                        ref={answerScrollRef}
                        data-lenis-prevent
                        className="max-h-[46vh] overflow-y-auto pr-2 text-slate-700 dark:text-slate-200"
                      >
                        <MarkdownText content={displayedAnswer} />
                      </div>

                      {streamingId !== currentExchange.id &&
                        currentExchange.meta?.citations &&
                        currentExchange.meta.citations.length > 0 && (
                          <div className="flex flex-wrap items-center gap-2 pt-1">
                            {currentExchange.meta.citations.map((c) => {
                              const isExt = c.kind === "external";
                              return (
                                <a
                                  key={c.url}
                                  href={c.url}
                                  {...(isExt
                                    ? {
                                        target: "_blank",
                                        rel: "noopener noreferrer",
                                      }
                                    : { onClick: () => setIsOpen(false) })}
                                  className="inline-flex items-center gap-1 rounded-full border border-slate-300/70 px-3 py-1 text-xs font-medium text-slate-700 transition hover:border-indigo-400 hover:text-indigo-600 dark:border-white/15 dark:text-slate-300 dark:hover:border-cyan-400 dark:hover:text-cyan-300"
                                >
                                  <span>{c.label}</span>
                                  <HiOutlineArrowUpRight className="h-3 w-3 opacity-70" />
                                </a>
                              );
                            })}
                          </div>
                        )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="hey-gokul"
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{
                        type: "spring",
                        stiffness: 280,
                        damping: 26,
                      }}
                      className="mb-8 flex flex-col items-center text-center"
                    >
                      <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.25em] text-indigo-600 dark:text-indigo-400">
                        {`// Helios AI`}
                      </p>
                      <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                        Ask Helios about{" "}
                        <span
                          className="font-caveat bg-clip-text text-4xl font-bold tracking-normal text-transparent sm:text-5xl"
                          style={{
                            backgroundImage:
                              "linear-gradient(95deg, #6366f1 0%, #38bdf8 55%, #a855f7 100%)",
                          }}
                        >
                          Gokul.
                        </span>
                      </h2>
                      <p className="mt-2 max-w-md text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                        Explore his engineering work, VigiLens architecture, or
                        reading codex.
                      </p>

                      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                        {QUICK_TOPICS.map((topic, i) => (
                          <motion.button
                            key={topic.label}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.06 * i, duration: 0.25 }}
                            type="button"
                            onClick={() => askAssistant(topic.prompt)}
                            className="rounded-full border border-slate-300/70 bg-white/60 px-3.5 py-1.5 text-xs font-medium text-slate-700 transition hover:-translate-y-0.5 hover:border-indigo-400 hover:text-indigo-600 dark:border-white/15 dark:bg-white/5 dark:text-slate-200 dark:hover:border-cyan-400/70 dark:hover:text-cyan-300"
                          >
                            {topic.label}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Floating Open-Space Command Line */}
                <motion.form
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05, type: "spring", stiffness: 320, damping: 28 }}
                  onSubmit={handleSubmit}
                  className="mx-auto w-full max-w-xl"
                >
                  <div
                    className="rounded-full p-[1.5px] shadow-[0_12px_40px_-8px_rgba(99,102,241,0.4)]"
                    style={{
                      backgroundImage:
                        "linear-gradient(90deg, #38bdf8, #6366f1, #a855f7, #38bdf8)",
                      backgroundSize: "200% 100%",
                      animation: `geminiSweep ${isProcessing ? "1.6s" : "5s"} ease infinite`,
                    }}
                  >
                    <div className="flex items-center gap-2.5 rounded-full bg-white py-2 pl-5 pr-2 dark:bg-[#030407]">
                      <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask anything…"
                        disabled={loading}
                        className="flex-1 appearance-none bg-transparent py-1 text-sm text-slate-900 placeholder-slate-400 outline-none dark:text-white dark:placeholder-slate-500 sm:text-base"
                      />
                      <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        title="Dismiss (Esc)"
                        className="rounded-full p-1.5 text-slate-400 transition hover:text-slate-700 dark:hover:text-white"
                      >
                        <HiOutlineXMark className="h-4 w-4" />
                      </button>
                      <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        aria-label="Send"
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 via-blue-500 to-sky-400 text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <HiOutlineArrowUp className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightweight Floating Trigger */}
      <AnimatePresence>
        {!isOpen && !(isMobileViewport && isMobileDockOpen) && (
          <motion.button
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Open Helios AI"
            title="Ask Helios AI (⌘K)"
            className="fixed bottom-5 left-4 z-40 flex items-center gap-2 rounded-full border border-slate-300/70 bg-white/75 px-3 py-2 text-xs font-medium text-slate-800 shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-xl transition hover:border-slate-400/80 hover:bg-white/90 dark:border-white/15 dark:bg-white/[0.06] dark:text-white dark:shadow-[0_8px_30px_rgba(0,0,0,0.45)] dark:hover:border-white/25 dark:hover:bg-white/[0.1] md:left-auto md:bottom-6 md:right-6"
          >
            <AIBrandMark className="h-4 w-4 shrink-0" />
            <kbd className="hidden rounded-full bg-slate-200/70 px-1.5 py-0.5 font-mono text-[9px] text-slate-500 dark:bg-white/10 dark:text-slate-400 sm:inline">
              ⌘K
            </kbd>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
