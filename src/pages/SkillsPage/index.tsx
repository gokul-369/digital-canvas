import { useState, useMemo, lazy, Suspense, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { skills } from "../../data";
import SectionHeader from "../../components/SectionHeader";
import InteractiveAmbient from "../../components/Backgrounds/InteractiveAmbient";
import useNavigateTop from "../../hooks/useNavigateToTop";
import useTheme from "../../hooks/useTheme";

const GitHubGraph = lazy(() => import("../../components/GitHubGraph"));
import {
  IoSearchOutline,
  IoSparklesOutline,
  IoTerminalOutline,
  IoLayersOutline,
  IoCubeOutline,
  IoFlashOutline,
} from "react-icons/io5";

interface SkillItem {
  name: string;
  imagePath: string;
  category: "frontend" | "core" | "cloud" | "data_ai";
  categoryLabel: string;
  tier: "Daily Driver" | "Core Architecture" | "Scale & Infra" | "Ecosystem";
}

const DOMAIN_CATEGORIES = [
  { id: "all", label: "All Stack", icon: IoLayersOutline },
  { id: "frontend", label: "Frontend & UI Systems", icon: IoSparklesOutline },
  { id: "core", label: "Languages & Runtime", icon: IoTerminalOutline },
  { id: "cloud", label: "Cloud & DevOps", icon: IoCubeOutline },
  { id: "data_ai", label: "Data, Realtime & AI", icon: IoFlashOutline },
] as const;

function SkillsPage() {
  useNavigateTop();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSkill, setActiveSkill] = useState<SkillItem | null>(null);

  const categorizedSkills: SkillItem[] = useMemo(() => {
    const [row1, row2, row3, row4, row5] = skills;
    const list: SkillItem[] = [];

    row1?.forEach((s) => {
      list.push({
        name: s.name,
        imagePath: s.imagePath,
        category: "core",
        categoryLabel: "Core & Runtime",
        tier: s.name === "TypeScript" || s.name === "JavaScript" ? "Daily Driver" : "Core Architecture",
      });
    });

    row2?.forEach((s) => {
      list.push({
        name: s.name,
        imagePath: s.imagePath,
        category: "frontend",
        categoryLabel: "Frontend Architecture",
        tier: s.name === "React" || s.name === "Next.js" ? "Daily Driver" : "Core Architecture",
      });
    });

    row3?.forEach((s) => {
      const isCloud = s.name === "GitHub Actions" || s.name === "Docker";
      list.push({
        name: s.name,
        imagePath: s.imagePath,
        category: isCloud ? "cloud" : "core",
        categoryLabel: isCloud ? "CI/CD & DevOps" : "Engineering Tooling",
        tier: "Daily Driver",
      });
    });

    row4?.forEach((s) => {
      list.push({
        name: s.name,
        imagePath: s.imagePath,
        category: "cloud",
        categoryLabel: "Cloud & Infra",
        tier: "Scale & Infra",
      });
    });

    row5?.forEach((s) => {
      list.push({
        name: s.name,
        imagePath: s.imagePath,
        category: "data_ai",
        categoryLabel: "Data & AI Systems",
        tier: s.name.includes("Ollama") || s.name.includes("MCP") ? "Daily Driver" : "Core Architecture",
      });
    });

    return list;
  }, []);

  const filteredSkills = useMemo(() => {
    return categorizedSkills.filter((item) => {
      const matchesTab = activeTab === "all" || item.category === activeTab;
      const matchesSearch =
        searchQuery.trim() === "" ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        item.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase().trim());
      return matchesTab && matchesSearch;
    });
  }, [categorizedSkills, activeTab, searchQuery]);

  return (
    <main className="relative min-h-dvh w-full overflow-hidden pt-28 pb-32">
      <InteractiveAmbient variant="skills" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 z-10 flex flex-col items-center">
        {/* Section Header */}
        <SectionHeader
          tag="Architectural Matrix"
          title="Technologies that power my"
          accent="production craft"
          description="From zero-latency interfaces and distributed frontends to AI orchestration, realtime streams, and cloud infrastructure."
          className="mb-12"
        />

        {/* High-Level Overview Metrics - Liquid Cosmic Glass */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-4xl mb-12">
          <div className="p-5 rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur-xl shadow-sm dark:shadow-none flex flex-col items-center text-center hover:border-sky-400/50 hover:shadow-[0_0_30px_rgba(56,189,248,0.2)] transition-all">
            <span className="font-space text-3xl font-bold text-sky-600 dark:text-sky-400">
              35+
            </span>
            <span className="font-mono text-xs text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">
              Battle-Tested Tech
            </span>
          </div>

          <div className="p-5 rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur-xl shadow-sm dark:shadow-none flex flex-col items-center text-center hover:border-indigo-400/50 hover:shadow-[0_0_30px_rgba(99,102,241,0.2)] transition-all">
            <span className="font-space text-3xl font-bold text-indigo-600 dark:text-indigo-400">
              5+ Yrs
            </span>
            <span className="font-mono text-xs text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">
              Production Code
            </span>
          </div>

          <div className="p-5 rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur-xl shadow-sm dark:shadow-none flex flex-col items-center text-center hover:border-amber-400/50 hover:shadow-[0_0_30px_rgba(245,158,11,0.2)] transition-all">
            <span className="font-space text-3xl font-bold text-amber-600 dark:text-amber-400">
              Enterprise
            </span>
            <span className="font-mono text-xs text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">
              Scale & Quality
            </span>
          </div>

          <div className="p-5 rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur-xl shadow-sm dark:shadow-none flex flex-col items-center text-center hover:border-purple-400/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] transition-all">
            <span className="font-space text-3xl font-bold text-purple-600 dark:text-purple-400">
              GenAI
            </span>
            <span className="font-mono text-xs text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">
              LLMs & MCP Tools
            </span>
          </div>
        </div>

        {/* Domain Tabs & Search - Cosmic Glass */}
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          <div className="flex flex-wrap items-center justify-center gap-1.5 p-1.5 rounded-2xl bg-white/70 dark:bg-white/[0.04] backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-sm">
            {DOMAIN_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeTab === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveTab(cat.id)}
                  className={`relative inline-flex items-center gap-2 text-xs px-3.5 py-2 rounded-xl font-medium transition-colors duration-200 cursor-pointer select-none ${
                    isActive
                      ? "text-white"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="skills-page-tab"
                      className="absolute inset-0 bg-indigo-600 rounded-xl shadow-md shadow-indigo-500/25 -z-0"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <Icon size={14} className="relative z-10" />
                  <span className="relative z-10">{cat.label}</span>
                </button>
              );
            })}
          </div>

          <div className="relative w-full md:w-72">
            <IoSearchOutline
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stack, framework, tool..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs bg-white/70 dark:bg-white/[0.04] focus:bg-white/70 dark:focus:bg-white/[0.04] backdrop-blur-xl border border-slate-200/80 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500/70 focus:ring-1 focus:ring-indigo-500/30 transition-[border-color,box-shadow] shadow-sm"
            />
          </div>
        </div>

        {/* Grid of Cosmic Liquid Glass Skill Cards with 3D Hover Reflections */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + (searchQuery ? `-${searchQuery}` : "")}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full"
          >
            {filteredSkills.map((skill) => {
              const isSelected = activeSkill?.name === skill.name;
              return (
                <div
                  key={skill.name}
                  style={{ isolation: "isolate" }}
                  onClick={() => setActiveSkill(isSelected ? null : skill)}
                  className={`group relative flex flex-col justify-between p-5 rounded-3xl border transition-all duration-300 cursor-pointer select-none overflow-hidden bg-white/70 dark:bg-white/[0.03] backdrop-blur-xl hover:-translate-y-1 ${
                    isSelected
                      ? "border-indigo-500 ring-2 ring-indigo-500/30 shadow-xl"
                      : "border-slate-200/80 dark:border-white/10 hover:border-indigo-400/60 hover:shadow-[0_0_30px_rgba(99,102,241,0.22)] shadow-[0_4px_24px_rgba(0,0,0,0.03)] dark:shadow-none"
                  }`}
                >
                  {/* Subtle Liquid Gradient Specular Sheen */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Top Row: Category tag & Active Pulse */}
                  <div className="relative z-10 flex items-center justify-between w-full mb-3">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate max-w-[90px]">
                      {skill.categoryLabel}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500/80 ring-4 ring-emerald-500/10" />
                  </div>

                  {/* Icon & Title */}
                  <div className="relative z-10 flex flex-col items-center my-3">
                    <div className="relative h-12 w-12 flex items-center justify-center p-2 rounded-2xl bg-slate-50/90 dark:bg-white/[0.05] border border-slate-200/60 dark:border-white/10 group-hover:scale-110 group-hover:border-indigo-400/40 transition-all duration-300 shadow-sm">
                      <img
                        src={skill.imagePath}
                        alt={skill.name}
                        className="h-full w-full object-contain"
                        loading="lazy"
                      />
                    </div>

                    <h4 className="mt-3 font-space text-sm font-bold text-slate-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors text-center">
                      {skill.name}
                    </h4>
                  </div>

                  {/* Tier Badge */}
                  <div className="relative z-10 pt-2 border-t border-slate-200/60 dark:border-white/5 flex items-center justify-center">
                    <span className="font-mono text-[10px] text-indigo-600 dark:text-indigo-400 font-medium tracking-tight">
                      {skill.tier}
                    </span>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {filteredSkills.length === 0 && (
          <div className="py-20 text-center font-mono text-sm text-slate-400">
            No technologies found matching "{searchQuery}"
          </div>
        )}

        {/* GitHub Contribution Graph */}
        <div className="w-full mt-16 mb-4">
          <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/75 dark:bg-white/[0.03] backdrop-blur-2xl shadow-xl">
            <Suspense
              fallback={
                <div className="w-full h-32 flex items-center justify-center font-mono text-xs text-slate-400 animate-pulse">
                  Loading contribution graph…
                </div>
              }
            >
              <GitHubGraph isDark={isDark} />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}

export default memo(SkillsPage);
