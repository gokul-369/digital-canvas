import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import useTheme from "../../hooks/useTheme";

const CREATIVE_PHRASES = [
  "Interfaces that breathe",
  "Composing digital light & form",
  "Architecting seamless experiences",
  "Refining for scale & delight",
];

export function Loader() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % CREATIVE_PHRASES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center select-none overflow-hidden transition-colors duration-500 ${
        isDark ? "bg-[#030712]" : "bg-[#f8fafc]"
      }`}
    >
      {/* Dynamic Ambient Aura */}
      <div
        className="absolute inset-0 pointer-events-none flex items-center justify-center"
        style={{
          background: isDark
            ? "radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.14) 0%, rgba(56, 189, 248, 0.07) 40%, transparent 70%)"
            : "radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.08) 0%, rgba(56, 189, 248, 0.05) 40%, transparent 70%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col items-center"
      >
        {/* Creative Dual-Orbit Lens / Breathing Monogram */}
        <div className="relative w-28 h-28 flex items-center justify-center">
          {/* Outer Pulsing Glow */}
          <div
            className={`absolute inset-0 rounded-full blur-xl transition-opacity duration-700 ${
              isDark ? "bg-indigo-500/20" : "bg-indigo-500/15"
            }`}
          />

          {/* Precision SVG Orbital Rings */}
          <svg
            className="absolute inset-0 w-full h-full animate-spin"
            style={{ animationDuration: "14s", animationTimingFunction: "linear" }}
            viewBox="0 0 112 112"
          >
            <circle
              cx="56"
              cy="56"
              r="48"
              fill="none"
              stroke={isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(15, 23, 42, 0.10)"}
              strokeWidth="1.5"
            />
            <circle
              cx="56"
              cy="56"
              r="48"
              fill="none"
              stroke={isDark ? "#818cf8" : "#6366f1"}
              strokeWidth="1.5"
              strokeDasharray="60 240"
              strokeLinecap="round"
            />
          </svg>

          {/* Counter-spinning Inner Satellite Ring */}
          <svg
            className="absolute inset-0 w-full h-full animate-spin"
            style={{
              animationDuration: "8s",
              animationDirection: "reverse",
              animationTimingFunction: "linear",
            }}
            viewBox="0 0 112 112"
          >
            <circle
              cx="56"
              cy="56"
              r="34"
              fill="none"
              stroke={isDark ? "rgba(56, 189, 248, 0.25)" : "rgba(99, 102, 241, 0.20)"}
              strokeWidth="1"
              strokeDasharray="30 180"
              strokeLinecap="round"
            />
          </svg>

          {/* Breathing Core Prism Diamond */}
          <motion.div
            animate={{
              scale: [0.92, 1.08, 0.92],
              rotate: [45, 45, 45],
            }}
            transition={{
              repeat: Infinity,
              duration: 2.4,
              ease: "easeInOut",
            }}
            className={`w-7 h-7 rounded-md flex items-center justify-center shadow-lg transition-colors ${
              isDark
                ? "bg-gradient-to-tr from-indigo-500 to-cyan-400 shadow-[0_0_20px_rgba(99,102,241,0.5)]"
                : "bg-gradient-to-tr from-indigo-600 to-sky-500 shadow-[0_0_16px_rgba(79,70,229,0.35)]"
            }`}
          >
            <div className={`w-2.5 h-2.5 rounded-sm ${isDark ? "bg-black/60" : "bg-white/80"}`} />
          </motion.div>
        </div>

        {/* Creative Text Section */}
        <div className="mt-7 flex flex-col items-center gap-2.5 text-center min-w-[280px]">
          {/* Studio Tag */}
          <span
            className={`font-mono text-[10px] tracking-[0.35em] uppercase font-semibold pl-[0.35em] ${
              isDark ? "text-indigo-400" : "text-indigo-600"
            }`}
          >
            // GOKUL'S DIGITAL CANVAS
          </span>

          {/* Dynamic Animated Creative Phrase */}
          <div className="h-7 flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={phraseIndex}
                initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className={`font-space text-sm sm:text-base font-medium tracking-tight ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                {CREATIVE_PHRASES[phraseIndex]}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Minimalist 1px Precision Progress Shimmer Line */}
          <div
            className={`w-44 h-[2px] rounded-full relative overflow-hidden mt-1 ${
              isDark ? "bg-white/10" : "bg-slate-200"
            }`}
          >
            <motion.div
              className={`absolute inset-y-0 w-20 rounded-full ${
                isDark
                  ? "bg-gradient-to-r from-transparent via-cyan-400 to-indigo-500"
                  : "bg-gradient-to-r from-transparent via-indigo-600 to-sky-500"
              }`}
              animate={{ x: [-80, 180] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            />
          </div>

          {/* Telemetry Status Hint */}
          <span
            className={`font-mono text-[9px] tracking-[0.2em] uppercase mt-1 ${
              isDark ? "text-white/40" : "text-slate-400"
            }`}
          >
            INITIALIZING CANVAS · READY
          </span>
        </div>
      </motion.div>
    </div>
  );
}
