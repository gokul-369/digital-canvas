import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { skills } from "../../data";
import { IoSearchOutline } from "react-icons/io5";

interface CategorizedSkill {
  name: string;
  imagePath: string;
  category: "languages" | "frontend" | "tooling" | "devops" | "backend";
  categoryLabel: string;
}

const CATEGORIES = [
  { id: "all", label: "All Stack" },
  { id: "languages", label: "Core Languages" },
  { id: "frontend", label: "Frontend & UI" },
  { id: "backend", label: "Databases & Realtime" },
  { id: "devops", label: "DevOps & Cloud" },
  { id: "tooling", label: "Tooling & APIs" },
] as const;

export default function SkillsPyramid() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const allSkills: CategorizedSkill[] = useMemo(() => {
    const categoryMap: Array<{ id: CategorizedSkill["category"]; label: string }> = [
      { id: "languages", label: "Core Language" },
      { id: "frontend", label: "Frontend" },
      { id: "tooling", label: "Tooling" },
      { id: "devops", label: "DevOps / Cloud" },
      { id: "backend", label: "Database / Realtime" },
    ];

    return skills.flatMap((row, rowIndex) => {
      const cat = categoryMap[rowIndex] || categoryMap[0];
      return row.map((skill) => ({
        name: skill.name,
        imagePath: skill.imagePath,
        category: cat.id,
        categoryLabel: cat.label,
      }));
    });
  }, []);

  const filteredSkills = useMemo(() => {
    return allSkills.filter((skill) => {
      const matchesTab = activeTab === "all" || skill.category === activeTab;
      const matchesSearch =
        searchQuery.trim() === "" ||
        skill.name.toLowerCase().includes(searchQuery.toLowerCase().trim());
      return matchesTab && matchesSearch;
    });
  }, [allSkills, activeTab, searchQuery]);

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col items-center">
      {/* Category Tabs & Search Bar */}
      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 mb-10 z-10">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 p-1.5 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 backdrop-blur-md">
          {CATEGORIES.map((cat) => {
            const isActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveTab(cat.id)}
                className={`relative text-xs px-3.5 py-1.5 rounded-xl font-medium transition-colors duration-200 cursor-pointer select-none ${
                  isActive
                    ? "text-white"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="skills-pyramid-tab"
                    className="absolute inset-0 bg-indigo-600 rounded-xl shadow-md shadow-indigo-500/25 -z-0"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Live Filter Search */}
        <div className="relative w-full md:w-64">
          <IoSearchOutline
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter technologies..."
            className="w-full pl-9 pr-4 py-2 rounded-2xl text-xs bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      {/* Interactive Tech Grid */}
      <motion.div
        layout
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 w-full"
      >
        <AnimatePresence mode="popLayout">
          {filteredSkills.map((skill) => (
            <motion.div
              layout
              key={skill.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -5, scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="group relative flex flex-col items-center justify-center p-4 rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white/85 dark:bg-white/[0.03] backdrop-blur-md shadow-sm dark:shadow-none hover:shadow-xl dark:hover:border-indigo-500/40 hover:border-indigo-300 transition-all duration-300 cursor-pointer select-none"
            >
              {/* Subtle Ambient Hover Glow */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl bg-indigo-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="relative h-10 w-10 md:h-11 md:w-11 flex items-center justify-center mb-2.5">
                <img
                  src={skill.imagePath}
                  alt={skill.name}
                  className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-110 drop-shadow-sm"
                  loading="lazy"
                />
              </div>

              <span className="font-space text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors text-center">
                {skill.name}
              </span>

              <span className="font-mono text-[10px] text-slate-600 dark:text-slate-400 uppercase tracking-wider mt-1 text-center">
                {skill.categoryLabel}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredSkills.length === 0 && (
        <div className="py-16 text-center text-slate-400 font-mono text-sm">
          No technologies matching "{searchQuery}"
        </div>
      )}
    </div>
  );
}
