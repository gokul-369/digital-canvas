import { motion } from "motion/react";

interface SectionHeaderProps {
  tag?: string;
  title: string;
  accent: string;
  description?: string;
  className?: string;
}

export default function SectionHeader({
  tag,
  title,
  accent,
  description,
  className = "",
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`text-center max-w-2xl mx-auto mb-16 ${className}`}
    >
      {tag && (
        <p className="text-xs uppercase tracking-[0.25em] text-indigo-600 dark:text-indigo-400 font-mono mb-3">
          // {tag}
        </p>
      )}
      <h2 className="text-3xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white drop-shadow-sm">
        {title}{" "}
        <span className="font-caveat text-4xl lg:text-6xl text-indigo-600 dark:text-indigo-400 font-bold tracking-normal inline-block drop-shadow-sm">
          {accent}
        </span>
      </h2>
      {description && (
        <p className="mt-4 text-xs lg:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-light drop-shadow-sm">
          {description}
        </p>
      )}
    </motion.div>
  );
}
