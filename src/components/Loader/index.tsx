import { motion } from "motion/react";
import useTheme from "../../hooks/useTheme";

export function Loader() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center select-none overflow-hidden transition-colors duration-500 ${
        isDark ? "bg-[#020306]" : "bg-[#f8fafc]"
      }`}
    >
      {/* Deep Space Subtle Gravitational Warp Distortion Aura */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div
          className={`w-[520px] h-[520px] rounded-full blur-[100px] animate-pulse ${
            isDark
              ? "bg-gradient-to-tr from-amber-500/[0.04] via-indigo-500/[0.03] to-cyan-500/[0.03]"
              : "bg-gradient-to-tr from-amber-500/[0.10] via-indigo-500/[0.08] to-cyan-500/[0.08]"
          }`}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.04 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col items-center"
      >
        {/* INTERSTELLAR MINIMALIST GARGANTUA & ENDURANCE RING */}
        <div className="relative w-44 h-44 flex items-center justify-center">
          {/* Gravitational Lensing Outer Halo */}
          <div
            className={`absolute inset-3 rounded-full border blur-[1px] ${
              isDark ? "border-amber-400/20" : "border-amber-500/30"
            }`}
          />
          <div
            className={`absolute inset-2 rounded-full border blur-[2px] ${
              isDark ? "border-amber-300/10" : "border-indigo-400/20"
            }`}
          />

          {/* Upper Gravitational Lensing Arc (Bending light behind the singularity) */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
            viewBox="0 0 176 176"
          >
            <defs>
              <linearGradient id="gargantuaLensDark" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0" />
                <stop offset="25%" stopColor="#fbbf24" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#ffffff" stopOpacity="0.95" />
                <stop offset="75%" stopColor="#f59e0b" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="gargantuaLensLight" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0" />
                <stop offset="25%" stopColor="#818cf8" stopOpacity="0.75" />
                <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.9" />
                <stop offset="75%" stopColor="#6366f1" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
              </linearGradient>

              <linearGradient id="accretionGradDark" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#d97706" stopOpacity="0.1" />
                <stop offset="30%" stopColor="#fbbf24" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
                <stop offset="70%" stopColor="#f59e0b" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#b45309" stopOpacity="0.1" />
              </linearGradient>
              <linearGradient id="accretionGradLight" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.1" />
                <stop offset="30%" stopColor="#6366f1" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.95" />
                <stop offset="70%" stopColor="#818cf8" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.1" />
              </linearGradient>
            </defs>

            {/* Upper warped arc */}
            <path
              d="M 28 88 C 28 42, 148 42, 148 88"
              fill="none"
              stroke={isDark ? "url(#gargantuaLensDark)" : "url(#gargantuaLensLight)"}
              strokeWidth="1.75"
              className={isDark ? "opacity-80 blur-[0.5px]" : "opacity-75 blur-[0.5px]"}
            />
            {/* Lower subtle counter-lensing arc */}
            <path
              d="M 38 88 C 38 124, 138 124, 138 88"
              fill="none"
              stroke={isDark ? "url(#gargantuaLensDark)" : "url(#gargantuaLensLight)"}
              strokeWidth="1"
              className={isDark ? "opacity-40" : "opacity-35"}
            />

            {/* Horizontal Accretion Disk Ring */}
            <ellipse
              cx="88"
              cy="88"
              rx="76"
              ry="16"
              fill="none"
              stroke={isDark ? "url(#accretionGradDark)" : "url(#accretionGradLight)"}
              strokeWidth="1.5"
              className="blur-[0.5px]"
            />
          </svg>

          {/* Rotating Endurance Module Ring (Minimalist 12-pod clockwork orbit) */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
          >
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i * 30 * Math.PI) / 180;
              const r = 74;
              const x = Math.cos(angle) * r;
              const y = Math.sin(angle) * r;
              const isCommandModule = i === 0;

              return (
                <div
                  key={i}
                  style={{
                    transform: `translate(${x}px, ${y}px)`,
                  }}
                  className="absolute flex items-center justify-center"
                >
                  <span
                    className={`block rounded-full transition-all ${
                      isDark
                        ? isCommandModule
                          ? "w-1.5 h-1.5 bg-amber-200 shadow-[0_0_8px_#fbbf24]"
                          : "w-1 h-1 bg-white/70 shadow-[0_0_4px_rgba(255,255,255,0.8)]"
                        : isCommandModule
                          ? "w-1.5 h-1.5 bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]"
                          : "w-1 h-1 bg-slate-500/80 shadow-[0_0_3px_rgba(100,116,139,0.5)]"
                    }`}
                  />
                </div>
              );
            })}
          </motion.div>

          {/* Singularity / Central Core Body */}
          <div
            className={`relative w-20 h-20 rounded-full flex items-center justify-center border transition-all ${
              isDark
                ? "bg-[#000000] border-amber-400/40 shadow-[0_0_24px_rgba(251,191,36,0.25),inset_0_0_12px_rgba(0,0,0,1)]"
                : "bg-white border-slate-200/90 shadow-[0_8px_28px_rgba(99,102,241,0.12),inset_0_0_12px_rgba(255,255,255,1)]"
            }`}
          >
            {/* Photon Sphere Rim */}
            <div
              className={`absolute inset-0 rounded-full border ${
                isDark
                  ? "border-amber-200/50 shadow-[0_0_10px_rgba(251,191,36,0.6)]"
                  : "border-indigo-400/40 shadow-[0_0_8px_rgba(99,102,241,0.35)]"
              }`}
            />

            {/* Core Center */}
            <div
              className={`w-16 h-16 rounded-full ${
                isDark ? "bg-black" : "bg-slate-50"
              }`}
            />
          </div>
        </div>

        {/* Minimalist Interstellar Typography & Hairline Telemetry */}
        <div className="mt-8 flex flex-col items-center gap-2 text-center">
          <span
            className={`font-mono text-[11px] tracking-[0.45em] uppercase font-light pl-[0.45em] ${
              isDark ? "text-white/90" : "text-slate-800"
            }`}
          >
            G A R G A N T U A
          </span>

          {/* Minimal 1px Hairline Slingshot Progress */}
          <div
            className={`w-36 h-[1px] relative overflow-hidden my-1 ${
              isDark ? "bg-white/10" : "bg-slate-200"
            }`}
          >
            <motion.div
              className={`absolute inset-y-0 left-0 w-12 ${
                isDark
                  ? "bg-gradient-to-r from-transparent via-amber-300 to-transparent"
                  : "bg-gradient-to-r from-transparent via-indigo-500 to-transparent"
              }`}
              animate={{ x: [-50, 150] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            />
          </div>

          <span
            className={`font-mono text-[9px] tracking-[0.25em] uppercase ${
              isDark ? "text-white/40" : "text-slate-400"
            }`}
          >
            {isDark ? "EVENT HORIZON // T-MINUS" : "SOLAR EQUINOX // SYNCHRONIZING"}
          </span>
        </div>
      </motion.div>
    </div>
  );
}
