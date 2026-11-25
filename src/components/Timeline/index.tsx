import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import type { experience } from "../../types";
import { HiOutlineCalendar } from "react-icons/hi2";
import { IoSparklesOutline } from "react-icons/io5";
import tcsLogo from "../../assets/companies/tcs.svg";
import paperfliteLogo from "../../assets/companies/paperflite.png";
import novacLogo from "../../assets/companies/novac-mark.svg";

interface CompanyMetadata {
  monogram: string;
  badge: string;
  aura: string;
  glowBorder: string;
  tags: string[];
}

const companyConfig: Record<string, CompanyMetadata> = {
  "Tata Consultancy Services": {
    monogram: "TCS",
    badge: "Enterprise Scale · UK Banking",
    aura: "from-sky-500/15 via-indigo-500/10 to-transparent",
    glowBorder: "hover:border-sky-400/70 hover:shadow-[0_12px_40px_rgba(56,189,248,0.22)]",
    tags: ["React", "TypeScript", "GenAI MCP", "SPAs", "VISA Click to Pay", "Card Controls"],
  },
  Paperflite: {
    monogram: "PFL",
    badge: "B2B SaaS · AI CLI Hackathon",
    aura: "from-indigo-500/15 via-purple-500/10 to-transparent",
    glowBorder: "hover:border-indigo-400/70 hover:shadow-[0_12px_40px_rgba(99,102,241,0.22)]",
    tags: ["React", "Realtime Analytics", "Data Viz", "Gemini 3.1 CLI", "Seek AI"],
  },
  "Novac Technology Solutions": {
    monogram: "NTS",
    badge: "FinTech & Payments · Leadership",
    aura: "from-amber-500/15 via-orange-500/10 to-transparent",
    glowBorder: "hover:border-amber-400/70 hover:shadow-[0_12px_40px_rgba(245,158,11,0.22)]",
    tags: ["React", "Payment Gateways", "Team Lead (5 Devs)", "PDF Engines", "Architecture"],
  },
};

const COMPANY_LOGOS: Record<string, string> = {
  "Tata Consultancy Services": tcsLogo,
  Paperflite: paperfliteLogo,
  "Novac Technology Solutions": novacLogo,
};

export function CompanyLogo({ company, fallback }: { company: string; fallback: string }) {
  const logoSrc = COMPANY_LOGOS[company];

  if (logoSrc) {
    return (
      <img
        src={logoSrc}
        alt={`${company} logo`}
        loading="lazy"
        className="w-full h-full object-contain"
      />
    );
  }

  return <span>{fallback}</span>;
}

export function TimelineItem({
  roles,
  company,
}: {
  roles: experience[];
  company: string;
}) {
  const config = companyConfig[company] || {
    monogram: company.slice(0, 3).toUpperCase(),
    badge: "Production Engineering",
    aura: "from-indigo-500/15 to-transparent",
    glowBorder: "hover:border-indigo-400/70",
    tags: ["React", "TypeScript"],
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative w-full"
    >
      {/* Three UI Cosmic Glass Workstation Card */}
      <div
        style={{ isolation: "isolate" }}
        className={`group relative rounded-3xl p-5 sm:p-7 md:p-9 border border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur-xl shadow-[0_4px_24px_rgba(99,102,241,0.06)] dark:shadow-none transition-all duration-300 hover:-translate-y-1 overflow-hidden ${config.glowBorder}`}
      >
        {/* Dynamic Specular Background Aura */}
        <div
          className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${config.aura} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
        />

        {/* Company Header Plaque */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 sm:pb-6 border-b border-slate-200/60 dark:border-white/5">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 sm:h-12 sm:w-12 p-1.5 flex-shrink-0 items-center justify-center rounded-2xl border border-slate-200/80 dark:border-white/15 bg-white/95 font-mono font-bold text-sm text-indigo-600 shadow-sm group-hover:scale-105 transition-transform overflow-hidden">
              <CompanyLogo company={company} fallback={config.monogram} />
            </div>
            <div>
              <h3 className="font-space text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {company}
              </h3>
              <p className="font-mono text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                {config.badge}
              </p>
            </div>
          </div>

          {/* Key Tech Stack Chips (Three UI Style) */}
          <div className="flex flex-wrap items-center gap-1.5">
            {config.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-[10px] px-2.5 py-1 rounded-lg border border-slate-200/60 dark:border-white/5 bg-slate-50/80 dark:bg-white/[0.04] text-slate-600 dark:text-slate-300 font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Roles List */}
        <div className="relative z-10 mt-6 space-y-8">
          {roles.map((exp: experience, idx: number) => (
            <div
              key={idx}
              className={`${
                idx > 0 ? "pt-6 border-t border-slate-200/50 dark:border-white/5" : ""
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 shadow-sm" />
                  <h4 className="font-space text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    {exp.role}
                  </h4>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-slate-200/70 dark:border-white/10 bg-slate-50/80 dark:bg-white/5 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                  <HiOutlineCalendar className="text-xs text-indigo-500" />
                  <span>{exp.duration}</span>
                </div>
              </div>

              {/* Accomplishment Highlights */}
              <ul className="space-y-3 mt-3">
                {exp.description.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed"
                  >
                    <IoSparklesOutline className="text-indigo-500/70 dark:text-indigo-400/60 text-xs mt-1 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function Timeline({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 20%", "end 75%"],
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.6,
  });

  const pointerY = useTransform(smooth, [0, 1], ["0%", "100%"]);
  const tailOpacity = useTransform(smooth, [0, 0.04], [0, 1]);

  return (
    <div ref={ref} className="relative max-w-4xl mx-auto w-full my-8">
      {/* Subtle Spine Track Base - perfectly matches comet travel bounds (top-6 bottom-6) so no line protrudes past the comet */}
      <div className="absolute left-3 sm:left-4 top-6 bottom-6 w-[2px] bg-slate-300 dark:bg-white/10 rounded-full hidden md:block" />

      {/* Orbit Rail Track Container - top-6 bottom-6 provides 24px padding so the comet head is never cut off at start & finish */}
      <div className="absolute left-3 sm:left-4 top-6 bottom-6 w-10 -translate-x-1/2 pointer-events-none overflow-visible hidden md:block z-20">
        {/* Realistic Cosmic Comet with Tapered Fading Ion & Dust Tail */}
        <motion.div
          style={{ top: pointerY }}
          className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none"
        >
          {/* FADING REAL COMET TAIL: Trails upward behind the descending comet head (260px long, fading to 0 opacity) */}
          <motion.div
            style={{ opacity: tailOpacity }}
            className="absolute bottom-2 left-1/2 -translate-x-1/2 w-6 h-64 pointer-events-none flex flex-col items-center justify-end"
          >
            {/* Outer Diffuse Cometary Dust Sheath (Subtle, refined light mode & luminous dark mode) */}
            <div className="w-5 h-64 bg-gradient-to-t from-indigo-400/25 via-purple-300/10 dark:from-cyan-400/50 dark:via-indigo-500/20 via-30% to-transparent blur-[3px]" />

            {/* Inner Ion Beam (Soft refined indigo in light mode / Radiant Cyan-White in dark mode) */}
            <div className="absolute bottom-0 w-[2px] h-60 bg-gradient-to-t from-indigo-500/60 via-indigo-400/35 via-25% via-violet-400/20 dark:from-white dark:via-sky-300/80 dark:via-25% dark:via-cyan-400/40 via-60% to-transparent shadow-[0_0_6px_rgba(99,102,241,0.35)] dark:shadow-[0_0_12px_rgba(56,189,248,0.9)]" />

            {/* Dispersing Sparkling Stardust Particles drifting upwards along the tail */}
            <span className="absolute bottom-6 -left-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400/60 dark:bg-cyan-200 dark:shadow-[0_0_8px_#38bdf8] animate-dust-1 opacity-75" />
            <span className="absolute bottom-14 right-1 w-1 h-1 rounded-full bg-purple-400/50 dark:bg-indigo-200 dark:shadow-[0_0_6px_#818cf8] animate-dust-2 opacity-70" />
            <span className="absolute bottom-24 -left-2 w-1.5 h-1.5 rounded-full bg-amber-400/40 dark:bg-amber-200 dark:shadow-[0_0_6px_#fbbf24] animate-dust-3 opacity-55" />
            <span className="absolute bottom-36 right-1.5 w-1 h-1 rounded-full bg-sky-400/40 dark:bg-sky-200 dark:shadow-[0_0_6px_#38bdf8] animate-dust-1 opacity-40" />
            <span className="absolute bottom-48 -left-1 w-1 h-1 rounded-full bg-slate-400/30 dark:bg-white dark:shadow-[0_0_6px_#ffffff] animate-dust-2 opacity-25" />
          </motion.div>

          {/* COMET HEAD (Refined, elegant nucleus in light mode / Radiant Gas Coma in dark mode) */}
          <div className="relative flex items-center justify-center">
            {/* Pulsing Outer Coma Halo */}
            <span className="absolute h-7 w-7 rounded-full bg-indigo-400/15 dark:bg-cyan-400/25 animate-ping opacity-50" />
            <span className="absolute h-5 w-5 rounded-full bg-gradient-to-tr from-indigo-400/40 to-violet-400/30 dark:from-cyan-400 dark:to-indigo-500 opacity-70 blur-[2px]" />

            {/* Stellar Core - Refined Indigo with Soft Glow in Light Mode, Brilliant White in Dark Mode */}
            <span className="relative h-3 w-3 rounded-full bg-indigo-500/85 dark:bg-white shadow-[0_0_6px_rgba(99,102,241,0.4)] dark:shadow-[0_0_12px_#ffffff,0_0_24px_#38bdf8,0_0_40px_#818cf8]" />
          </div>
        </motion.div>
      </div>

      {/* Experience Chapters */}
      <div className="space-y-10 md:pl-12">{children}</div>
    </div>
  );
}
