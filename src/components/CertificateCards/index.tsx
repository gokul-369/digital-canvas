import { memo } from "react";
import type { IconType } from "react-icons";
import type { achievement } from "../../types";

interface CertificateCardProps extends achievement {
  index?: number;
}

function CertificateCard({
  title,
  company,
  subTitle,
  year,
  type,
  icon: iconData,
  index = 0,
}: CertificateCardProps) {
  const Icon: IconType = iconData;
  const isAward = type === "award";
  const num = (index + 1).toString().padStart(2, "0");

  return (
    <article
      style={{ isolation: "isolate", backfaceVisibility: "hidden" }}
      className="group relative flex flex-col justify-between rounded-3xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0e1017] p-6 transition-all duration-200 hover:border-indigo-500/70 hover:shadow-[0_8px_30px_rgba(99,102,241,0.12)] dark:hover:shadow-[0_8px_30px_rgba(99,102,241,0.2)] select-none will-change-[border-color,box-shadow]"
    >
      {/* Top Header: Index & Year Badge */}
      <div className="flex items-center justify-between pb-3">
        <span className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
          // {num} · {type.toUpperCase()}
        </span>
        <span
          className={`font-mono text-[11px] px-3 py-1 rounded-full border font-semibold transition-colors duration-200 ${
            isAward
              ? "border-amber-300/60 dark:border-amber-400/30 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-300 group-hover:border-amber-400"
              : "border-indigo-200 dark:border-indigo-400/30 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 group-hover:border-indigo-400"
          }`}
        >
          {year}
        </span>
      </div>

      {/* Main Info */}
      <div className="my-4 flex items-start gap-4">
        <div
          className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border transition-colors duration-200 shadow-sm ${
            isAward
              ? "border-amber-300/60 dark:border-amber-400/30 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-300 group-hover:border-amber-400"
              : "border-indigo-200 dark:border-indigo-400/30 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 group-hover:border-indigo-400"
          }`}
        >
          <Icon className="h-6 w-6" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-space text-lg font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors duration-200">
            {title}
          </h3>
          <p className="mt-1 font-mono text-xs font-medium uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            {company}
          </p>
        </div>
      </div>

      {/* Editorial Subtitle */}
      {subTitle && (
        <div className="mt-2 rounded-2xl border border-slate-200/80 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02] p-3.5 transition-colors duration-200 group-hover:border-indigo-500/30">
          <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300 font-light">
            {subTitle}
          </p>
        </div>
      )}
    </article>
  );
}

export default memo(CertificateCard);
