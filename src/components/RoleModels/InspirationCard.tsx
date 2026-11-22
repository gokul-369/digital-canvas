import { memo } from "react";
import type { roleModels } from "../../types";
import { RiDoubleQuotesL } from "react-icons/ri";

const principleMap: Record<string, { principle: string; tag: string; aura: string }> = {
  "Steve Jobs": {
    principle: "Simplicity is the ultimate sophistication",
    tag: "MINIMALISM & DESIGN",
    aura: "from-indigo-500/15 via-sky-500/10 to-transparent",
  },
  "Cristiano Ronaldo": {
    principle: "Relentless discipline beats talent when talent sleeps",
    tag: "RELENTLESS RESILIENCE",
    aura: "from-amber-500/15 via-orange-500/10 to-transparent",
  },
  "Bruce Lee": {
    principle: "Absorb what is useful, discard what is not",
    tag: "MASTERY THROUGH DISCIPLINE",
    aura: "from-red-500/15 via-amber-500/10 to-transparent",
  },
  "Peter McKinnon": {
    principle: "An image without a story is just visual noise",
    tag: "VISUAL STORYTELLING",
    aura: "from-purple-500/15 via-pink-500/10 to-transparent",
  },
  "Lewis Hamilton": {
    principle: "Composure under pressure reveals true character",
    tag: "ELITE COMPOSURE",
    aura: "from-emerald-500/15 via-teal-500/10 to-transparent",
  },
  "Christopher Nolan": {
    principle: "Structure, scale, and non-linear narrative",
    tag: "ARCHITECTURAL CINEMA",
    aura: "from-blue-500/15 via-indigo-500/10 to-transparent",
  },
};

interface InspirationPosterProps {
  item: roleModels;
  index: number;
}

function InspirationPoster({ item, index }: InspirationPosterProps) {
  const meta = principleMap[item.name] || {
    principle: "Philosophy of craft",
    tag: "CORE PRINCIPLE",
    aura: "from-indigo-500/15 to-transparent",
  };
  const num = (index + 1).toString().padStart(2, "0");

  return (
    <article
      style={{ isolation: "isolate" }}
      className="group relative flex flex-col justify-between rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur-xl p-7 transition-all duration-300 hover:border-indigo-400/60 hover:shadow-[0_20px_50px_-15px_rgba(99,102,241,0.25)] select-none will-change-transform overflow-hidden"
    >
      {/* Dynamic Ambient Poster Aura */}
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-b ${meta.aura} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
      />

      {/* Top Header: Minimal Index */}
      <div className="relative z-10 flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-white/5">
        <span className="font-mono text-sm font-bold text-slate-400 dark:text-slate-500 tracking-wider">
          #{num}
        </span>
      </div>

      {/* Heroic Poster Portrait */}
      <div className="relative z-10 my-6 flex flex-col items-center">
        <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200/80 dark:border-white/15 bg-slate-900 shadow-md">
          <img
            src={item.image}
            alt={item.name}
            className={`w-full h-full object-cover filter grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500 ease-out ${
              item.name === "Peter McKinnon" ? "object-left" : "object-center"
            }`}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
          
          <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
            <div>
              <h3 className="font-space text-2xl font-bold tracking-tight text-white drop-shadow-md">
                {item.name}
              </h3>
              <p className="font-mono text-[11px] text-white/70 uppercase tracking-wider">
                {item.title}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Handwritten Signature Quote */}
      <div className="relative z-10 rounded-2xl border border-slate-200/60 dark:border-white/5 bg-slate-50/80 dark:bg-black/30 p-4 transition-colors group-hover:border-indigo-500/30">
        <RiDoubleQuotesL className="text-xl text-indigo-500/70 dark:text-indigo-400/60 mb-1" />
        <p className="font-caveat text-xl lg:text-2xl leading-snug text-slate-800 dark:text-slate-200 tracking-wide font-normal">
          "{item.description}"
        </p>
        <p className="font-mono text-[10px] text-indigo-600 dark:text-indigo-400 mt-2 uppercase tracking-widest font-semibold">
          // PRINCIPLE: {meta.principle}
        </p>
      </div>
    </article>
  );
}

export default memo(InspirationPoster);
