import { motion } from "motion/react";

export function Loader() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#020306] select-none overflow-hidden transition-colors duration-500">
      {/* Deep Space Subtle Gravitational Warp Distortion Aura */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[520px] h-[520px] rounded-full bg-gradient-to-tr from-amber-500/[0.04] via-indigo-500/[0.03] to-cyan-500/[0.03] blur-[100px] animate-pulse" />
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
          {/* Gravitational Lensing Outer Halo (Gargantua warped photon ring) */}
          <div className="absolute inset-3 rounded-full border border-amber-400/20 blur-[1px]" />
          <div className="absolute inset-2 rounded-full border border-amber-300/10 blur-[2px]" />

          {/* Upper Gravitational Lensing Arc (Bending light behind the black hole) */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
            viewBox="0 0 176 176"
          >
            <defs>
              <linearGradient id="gargantuaLens" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0" />
                <stop offset="25%" stopColor="#fbbf24" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#ffffff" stopOpacity="0.95" />
                <stop offset="75%" stopColor="#f59e0b" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="accretionGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#d97706" stopOpacity="0.1" />
                <stop offset="30%" stopColor="#fbbf24" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
                <stop offset="70%" stopColor="#f59e0b" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#b45309" stopOpacity="0.1" />
              </linearGradient>
            </defs>

            {/* Upper warped arc of the accretion disk */}
            <path
              d="M 28 88 C 28 42, 148 42, 148 88"
              fill="none"
              stroke="url(#gargantuaLens)"
              strokeWidth="1.75"
              className="opacity-80 blur-[0.5px]"
            />
            {/* Lower subtle counter-lensing arc */}
            <path
              d="M 38 88 C 38 124, 138 124, 138 88"
              fill="none"
              stroke="url(#gargantuaLens)"
              strokeWidth="1"
              className="opacity-40"
            />

            {/* Horizontal Accretion Disk Ring (Relativistic Doppler asymmetry: left side brighter) */}
            <ellipse
              cx="88"
              cy="88"
              rx="76"
              ry="16"
              fill="none"
              stroke="url(#accretionGrad)"
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
              const r = 74; // Orbit radius
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
                      isCommandModule
                        ? "w-1.5 h-1.5 bg-amber-200 shadow-[0_0_8px_#fbbf24]"
                        : "w-1 h-1 bg-white/70 shadow-[0_0_4px_rgba(255,255,255,0.8)]"
                    }`}
                  />
                </div>
              );
            })}
          </motion.div>

          {/* Pure Black Hole Event Horizon Singularity (Total light absorption) */}
          <div className="relative w-20 h-20 rounded-full bg-[#000000] shadow-[0_0_24px_rgba(251,191,36,0.25),inset_0_0_12px_rgba(0,0,0,1)] flex items-center justify-center border border-amber-400/40">
            {/* Razor-thin Photon Sphere Rim */}
            <div className="absolute inset-0 rounded-full border border-amber-200/50 shadow-[0_0_10px_rgba(251,191,36,0.6)]" />

            {/* Absolute Void Center */}
            <div className="w-16 h-16 rounded-full bg-black" />
          </div>
        </div>

        {/* Minimalist Interstellar Typography & Hairline Telemetry */}
        <div className="mt-8 flex flex-col items-center gap-2 text-center">
          <span className="font-mono text-[11px] tracking-[0.45em] uppercase text-white/90 font-light pl-[0.45em]">
            G A R G A N T U A
          </span>

          {/* Minimal 1px Hairline Slingshot Progress */}
          <div className="w-36 h-[1px] bg-white/10 relative overflow-hidden my-1">
            <motion.div
              className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-transparent via-amber-300 to-transparent"
              animate={{ x: [-50, 150] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            />
          </div>

          <span className="font-mono text-[9px] tracking-[0.25em] text-white/40 uppercase">
            EVENT HORIZON // T-MINUS
          </span>
        </div>
      </motion.div>
    </div>
  );
}
