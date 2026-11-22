import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { workExperiences } from "../../data";
import { groupExperiencesByCompany } from "../../utils/groupByCompany";
import { Timeline, TimelineItem } from "../Timeline";
import SectionHeader from "../SectionHeader";
import {
  HiOutlineBriefcase,
  HiOutlineCalendar,
  HiOutlineCpuChip,
  HiOutlineSparkles,
  HiOutlineBuildingOffice2,
  HiOutlineCommandLine,
} from "react-icons/hi2";
import { FiCheckCircle } from "react-icons/fi";

interface CompanyHighlight {
  title: string;
  subtitle: string;
  metric: string;
}

interface CompanyCockpitMeta {
  monogram: string;
  badge: string;
  tenure: string;
  roleCount: string;
  accentColor: string;
  activeGlow: string;
  tagline: string;
  highlights: CompanyHighlight[];
  tags: string[];
}

const cockpitMetadata: Record<string, CompanyCockpitMeta> = {
  "Tata Consultancy Services": {
    monogram: "TCS",
    badge: "Enterprise Scale · Premium UK Banking",
    tenure: "2025 — Present",
    roleCount: "Current Venture",
    accentColor: "sky",
    activeGlow: "border-sky-400 shadow-[0_8px_30px_rgba(56,189,248,0.2)]",
    tagline: "Designated Front-End Engineer for a Premium UK Bank & VISA Click to Pay",
    highlights: [
      {
        title: "Premium UK Bank",
        subtitle: "Single Page Applications for Card Controls (usage & limits)",
        metric: "Enterprise SPA",
      },
      {
        title: "VISA Click to Pay",
        subtitle: "Zero-latency payment flows for global VISA cardholders",
        metric: "Global Fintech",
      },
      {
        title: "GenAI MCP Architect",
        subtitle: "Authoring custom Model Context Protocol servers & tools",
        metric: "GenAI & LLMs",
      },
    ],
    tags: [
      "React",
      "TypeScript",
      "GenAI MCP",
      "VISA Payments",
      "UK Banking SPA",
      "Card Controls",
      "Distributed State",
    ],
  },
  Paperflite: {
    monogram: "PFL",
    badge: "B2B SaaS · AI Hackathon Champion",
    tenure: "2024 — 2025",
    roleCount: "2 Sequential Roles",
    accentColor: "indigo",
    activeGlow: "border-indigo-400 shadow-[0_8px_30px_rgba(99,102,241,0.2)]",
    tagline: "Product revamps, realtime analytics telemetry, and Gemini AI CLI creation",
    highlights: [
      {
        title: "Product Revamp",
        subtitle: "Migrated legacy frontend architectures to modern high-performance codebases",
        metric: "Full Revamp",
      },
      {
        title: "Realtime Analytics",
        subtitle: "Data visualization nodules handling high-throughput telemetry streams",
        metric: "Realtime Viz",
      },
      {
        title: "Gemini Hackathon",
        subtitle: "Built AI CLI that automated test case generation via Gemini 3.1",
        metric: "Hackathon Winner",
      },
    ],
    tags: [
      "React",
      "Realtime Analytics",
      "Gemini 3.1 CLI",
      "Seek AI",
      "Data Visualization",
      "Defect Zero",
      "SaaS",
    ],
  },
  "Novac Technology Solutions": {
    monogram: "NTS",
    badge: "FinTech & Leadership · 3 Years",
    tenure: "2021 — 2024",
    roleCount: "3 Progressive Roles",
    accentColor: "amber",
    activeGlow: "border-amber-400 shadow-[0_8px_30px_rgba(245,158,11,0.2)]",
    tagline: "Led 5 engineers, built high-volume payment gateways for Shriram Chits core",
    highlights: [
      {
        title: "Engineering Lead",
        subtitle: "Led squad of 5 software engineers delivering core payment systems",
        metric: "5 Devs Led",
      },
      {
        title: "Shriram Chits Core",
        subtitle: "Customer Portal, Admin Portal, and complex chit fund payment gateways",
        metric: "FinTech Core",
      },
      {
        title: "Reusable Architecture",
        subtitle: "R&D on performance React libraries, PDF engines, and scalable UI systems",
        metric: "Design Systems",
      },
    ],
    tags: [
      "React",
      "Team Leadership",
      "Payment Gateways",
      "PDF Generation",
      "Enterprise Scrum",
      "Finance Core",
    ],
  },
};

export default function WorkExperience() {
  const groupedExperiences = groupExperiencesByCompany(workExperiences);
  const [selectedCompanyIdx, setSelectedCompanyIdx] = useState(0);
  const [activeRoleIdx, setActiveRoleIdx] = useState(0);
  const [viewMode, setViewMode] = useState<"timeline" | "cockpit">("timeline");

  const currentGroup = groupedExperiences[selectedCompanyIdx] || groupedExperiences[0];
  const meta = cockpitMetadata[currentGroup.company] || {
    monogram: currentGroup.company.slice(0, 3).toUpperCase(),
    badge: "Production Engineering",
    tenure: "Production",
    roleCount: `${currentGroup.roles.length} Roles`,
    accentColor: "indigo",
    activeGlow: "border-indigo-400",
    tagline: "Engineering resilient web architectures",
    highlights: [],
    tags: ["React", "TypeScript"],
  };

  const currentRole = currentGroup.roles[activeRoleIdx] || currentGroup.roles[0];

  return (
    <section
      className="flex py-16 sm:py-24 px-4 sm:px-6 lg:px-20 flex-col w-full items-center justify-center relative bg-transparent"
      id="experience"
    >
      <SectionHeader
        tag="Engineering Dossier"
        title="Experience in shipping"
        accent="what matters"
        description="From core frontend architecture to scaling distributed interfaces across UK banking, B2B SaaS, and high-volume FinTech."
        className="mb-8"
      />

      {/* Mode Switcher: Continuous Flow (Default) vs Interactive Cockpit */}
      <div className="inline-flex max-w-full items-center gap-1.5 sm:gap-2 p-1.5 rounded-2xl bg-white/70 dark:bg-white/[0.04] backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-sm mb-8 sm:mb-12">
        <button
          type="button"
          onClick={() => setViewMode("timeline")}
          className={`relative flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-mono font-medium transition-colors duration-200 cursor-pointer select-none ${
            viewMode === "timeline"
              ? "text-white"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          {viewMode === "timeline" && (
            <motion.div
              layoutId="exp-mode-active"
              className="absolute inset-0 bg-indigo-600 rounded-xl shadow-md shadow-indigo-600/25 -z-0"
              transition={{ type: "spring", stiffness: 400, damping: 32 }}
            />
          )}
          <HiOutlineCommandLine className="relative z-10 text-sm" />
          <span className="relative z-10">Continuous Flow</span>
        </button>
        <button
          type="button"
          onClick={() => setViewMode("cockpit")}
          className={`relative flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-mono font-medium transition-colors duration-200 cursor-pointer select-none ${
            viewMode === "cockpit"
              ? "text-white"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          {viewMode === "cockpit" && (
            <motion.div
              layoutId="exp-mode-active"
              className="absolute inset-0 bg-indigo-600 rounded-xl shadow-md shadow-indigo-600/25 -z-0"
              transition={{ type: "spring", stiffness: 400, damping: 32 }}
            />
          )}
          <HiOutlineCpuChip className="relative z-10 text-sm" />
          <span className="relative z-10">Interactive Cockpit</span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === "cockpit" ? (
          <motion.div
            key="cockpit"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-5xl space-y-6 sm:space-y-8"
          >
            {/* Company Switcher Tabs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {groupedExperiences.map((item, idx) => {
                const isSelected = idx === selectedCompanyIdx;
                const companyMeta = cockpitMetadata[item.company] || {
                  monogram: item.company.slice(0, 3).toUpperCase(),
                  badge: "Engineering",
                  tenure: "Experience",
                  roleCount: `${item.roles.length} Roles`,
                  activeGlow: "border-indigo-400 shadow-[0_8px_30px_rgba(99,102,241,0.2)]",
                };

                return (
                  <button
                    key={item.company}
                    type="button"
                    onClick={() => {
                      setSelectedCompanyIdx(idx);
                      setActiveRoleIdx(0);
                    }}
                    className={`group relative text-left p-4 sm:p-5 rounded-2xl border transition-all duration-300 cursor-pointer backdrop-blur-xl ${
                      isSelected
                        ? `bg-white dark:bg-white/[0.08] ${companyMeta.activeGlow}`
                        : "border-slate-200/80 dark:border-white/10 bg-white/60 dark:bg-white/[0.02] hover:border-slate-300 dark:hover:border-white/20 hover:bg-white/80 dark:hover:bg-white/[0.04]"
                    }`}
                  >
                    {isSelected && (
                      <motion.div
                        layoutId="active-company-glow"
                        className="absolute inset-0 rounded-2xl border-2 border-indigo-500 dark:border-indigo-400 pointer-events-none -z-0"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <div className="flex items-center justify-between mb-3 relative z-10">
                      <div
                        className={`flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl font-mono font-bold text-xs sm:text-sm border transition-transform group-hover:scale-105 ${
                          isSelected
                            ? "bg-indigo-50 dark:bg-white/10 border-indigo-300 dark:border-white/20 text-indigo-600 dark:text-indigo-400"
                            : "bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {companyMeta.monogram}
                      </div>

                      <span className="font-mono text-[10px] px-2.5 py-1 rounded-full border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 font-semibold">
                        {companyMeta.tenure}
                      </span>
                    </div>

                    <h4 className="font-space font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate relative z-10">
                      {item.company}
                    </h4>
                    <p className="font-mono text-[11px] sm:text-xs text-indigo-600 dark:text-indigo-400 font-medium truncate mt-0.5 relative z-10">
                      {companyMeta.badge}
                    </p>
                  </button>
                );
              })}
            </div>

          {/* Active Workstation Stage */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentGroup.company}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="rounded-3xl border border-slate-200/90 dark:border-white/15 bg-white/80 dark:bg-white/[0.03] backdrop-blur-2xl shadow-xl dark:shadow-none p-5 sm:p-7 md:p-9 overflow-hidden"
            >
              {/* Header Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/70 dark:border-white/10">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75 animate-ping" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
                    </span>
                    <span className="font-mono text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-semibold">
                      // {meta.roleCount} · {meta.tenure}
                    </span>
                  </div>
                  <h3 className="font-space text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
                    {currentGroup.company}
                  </h3>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 max-w-xl">
                    {meta.tagline}
                  </p>
                </div>

                {/* Tech Chips */}
                <div className="flex flex-wrap items-center gap-1.5 max-w-md">
                  {meta.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-[10px] px-2.5 py-1 rounded-lg border border-slate-200/70 dark:border-white/10 bg-slate-50/90 dark:bg-white/[0.04] text-slate-700 dark:text-slate-300 font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* 3 Featured Architectural Highlights */}
              {meta.highlights.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  {meta.highlights.map((h, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-2xl border border-slate-200/70 dark:border-white/10 bg-slate-50/60 dark:bg-white/[0.02] flex flex-col justify-between space-y-2 hover:border-indigo-400/50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] uppercase font-semibold text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                          {h.metric}
                        </span>
                        <HiOutlineSparkles className="text-sm text-indigo-500/60" />
                      </div>
                      <div>
                        <h5 className="font-space font-bold text-sm text-slate-900 dark:text-white">
                          {h.title}
                        </h5>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-1">
                          {h.subtitle}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Role Navigation Ladder (for multiple roles) */}
              {currentGroup.roles.length > 1 && (
                <div className="mt-8 pt-6 border-t border-slate-200/70 dark:border-white/10">
                  <div className="flex items-center gap-2 mb-4">
                    <HiOutlineBriefcase className="text-sm text-indigo-500" />
                    <span className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                      Career Progression at {currentGroup.company}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {currentGroup.roles.map((role, rIdx) => {
                      const isRoleActive = rIdx === activeRoleIdx;
                      return (
                        <button
                          key={rIdx}
                          type="button"
                          onClick={() => setActiveRoleIdx(rIdx)}
                          className={`relative px-4 py-2 rounded-xl text-xs font-mono transition-colors duration-200 cursor-pointer flex items-center gap-2 border select-none ${
                            isRoleActive
                              ? "border-indigo-400/80 text-indigo-600 dark:text-indigo-300 shadow-sm"
                              : "border-slate-200/70 dark:border-white/10 bg-slate-50/70 dark:bg-white/[0.02] text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/20"
                          }`}
                        >
                          {isRoleActive && (
                            <motion.div
                              layoutId={`role-active-${currentGroup.company}`}
                              className="absolute inset-0 bg-indigo-50 dark:bg-indigo-500/20 rounded-xl -z-0"
                              transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            />
                          )}
                          <span
                            className={`relative z-10 w-1.5 h-1.5 rounded-full ${
                              isRoleActive ? "bg-indigo-500" : "bg-slate-400 dark:bg-slate-600"
                            }`}
                          />
                          <span className="relative z-10 font-bold">{role.role}</span>
                          <span className="relative z-10 text-[10px] opacity-75 font-normal">
                            ({role.duration})
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Active Role Responsibilities */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentRole.role}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="mt-8 pt-6 border-t border-slate-200/70 dark:border-white/10"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-white/5 border border-indigo-200 dark:border-white/10 text-indigo-600 dark:text-indigo-400">
                        <HiOutlineBuildingOffice2 className="text-base" />
                      </div>
                      <div>
                        <h4 className="font-space text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                          {currentRole.role}
                        </h4>
                        <p className="font-mono text-xs text-slate-500 dark:text-slate-400">
                          {currentRole.duration}
                        </p>
                      </div>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                      <HiOutlineCalendar className="text-xs text-indigo-500" />
                      <span>{currentRole.duration}</span>
                    </div>
                  </div>

                  {/* Bullet Points */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-3.5 mt-4">
                    {currentRole.description.map((item, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-2xl border border-slate-200/60 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] flex items-start gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed group hover:border-indigo-300 dark:hover:border-white/15 transition-colors"
                      >
                        <FiCheckCircle className="text-indigo-500 text-sm mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      ) : (
        /* Continuous Flow Timeline */
        <motion.div
          key="timeline"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="w-full"
        >
          <Timeline>
            {groupedExperiences.map((item, index) => (
              <TimelineItem key={index} roles={item.roles} company={item.company} />
            ))}
          </Timeline>
        </motion.div>
      )}
    </AnimatePresence>
    </section>
  );
}
