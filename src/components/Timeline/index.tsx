import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import type { experience } from "../../types";
import { HiOutlineCalendar } from "react-icons/hi2";
import { IoSparklesOutline } from "react-icons/io5";

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
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border border-indigo-200/60 dark:border-white/10 bg-indigo-50/80 dark:bg-white/5 font-mono font-bold text-sm text-indigo-600 dark:text-indigo-400 shadow-sm group-hover:scale-105 transition-transform">
              {config.monogram}
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
    offset: ["start 80%", "end 80%"],
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.6,
  });

  const pointerY = useTransform(smooth, [0, 1], ["0%", "100%"]);

  return (
    <div ref={ref} className="relative max-w-4xl mx-auto w-full my-8">
      {/* Laser Spine Track */}
      <div className="absolute left-3 sm:left-4 top-0 bottom-0 w-[2px] bg-slate-200 dark:bg-white/10 hidden md:block" />

      {/* Illuminated Scroll Laser Beam */}
      <motion.div
        style={{ scaleY: smooth }}
        className="absolute left-3 sm:left-4 top-0 bottom-0 w-[2px] origin-top bg-gradient-to-b from-indigo-500 via-sky-400 to-amber-500 shadow-[0_0_12px_rgba(99,102,241,0.5)] transform-gpu hidden md:block"
      />

      {/* Glowing Orbit Beacon */}
      <motion.div
        style={{ top: pointerY }}
        className="absolute left-3 sm:left-4 -translate-x-1/2 h-4 w-4 rounded-full bg-indigo-500 shadow-md transform-gpu hidden md:flex items-center justify-center z-20"
      >
        <span className="absolute -inset-1 rounded-full animate-ping opacity-40 bg-indigo-400" />
        <span className="h-2 w-2 rounded-full bg-white" />
      </motion.div>

      {/* Experience Chapters */}
      <div className="space-y-10 md:pl-12">{children}</div>
    </div>
  );
}
