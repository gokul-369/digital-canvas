import { motion } from "motion/react";
import { useState, useEffect } from "react";

const PHASES = [
  "INITIALIZING QUANTUM CANVAS",
  "SYNTHESIZING 3D GEOMETRY",
  "CALIBRATING LIGHT SPECTRUM",
  "SYSTEM CORE NOMINAL",
];

export function Loader() {
  const [phaseIndex, setPhaseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhaseIndex((prev) => (prev + 1) % PHASES.length);
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#f8fafc] dark:bg-[#030407] transition-colors duration-300 select-none">
      {/* Ambient background bloom */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full bg-gradient-to-tr from-cyan-500/20 via-indigo-500/20 to-purple-500/20 blur-[90px] animate-pulse" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col items-center gap-6 p-7 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-white/[0.03] backdrop-blur-2xl shadow-[0_8px_32px_rgba(99,102,241,0.08)] dark:shadow-none"
      >
        {/* Orbital Gyroscope Node */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          {/* Outer ring */}
          <motion.div
            className="absolute inset-0 rounded-full border border-indigo-400/40 dark:border-cyan-400/30"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
          >
            {/* Orbiting beacon satellite */}
            <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-indigo-600 dark:bg-cyan-300 shadow-[0_0_8px_rgba(79,70,229,0.9)] dark:shadow-[0_0_8px_#38bdf8]" />
          </motion.div>

          {/* Middle segmented counter-rotating ring */}
          <motion.div
            className="absolute inset-2 rounded-full border-2 border-dashed border-indigo-500/60 dark:border-indigo-400/60"
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
          />

          {/* Inner luminous core */}
          <div className="relative flex items-center justify-center">
            <span className="absolute w-6 h-6 rounded-full bg-indigo-500/30 dark:bg-cyan-400/30 animate-ping opacity-60" />
            <span className="relative w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-indigo-600 to-cyan-400 dark:from-cyan-300 dark:to-indigo-400 shadow-[0_0_12px_rgba(79,70,229,0.8)] dark:shadow-[0_0_16px_#38bdf8]" />
          </div>
        </div>

        {/* Telemetry Branding & Progress */}
        <div className="flex flex-col items-center gap-2.5 text-center">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[11px] tracking-[0.25em] uppercase font-bold text-slate-800 dark:text-white">
              GOKUL RAO // ARCHITECTURE
            </span>
          </div>

          {/* Precision progress bar */}
          <div className="w-44 h-1 rounded-full bg-slate-200/90 dark:bg-white/10 overflow-hidden relative">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 rounded-full"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
            />
          </div>

          {/* Cycling Status Label */}
          <span className="font-mono text-[10px] tracking-wider text-slate-500 dark:text-slate-400 transition-opacity duration-200 h-3 flex items-center">
            {PHASES[phaseIndex]}
          </span>
        </div>
      </motion.div>
    </div>
  );
}
