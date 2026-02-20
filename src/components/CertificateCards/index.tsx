import type { IconType } from "react-icons";
import { spotlight, type achievement } from "../../types";
import SpotlightCard from "../SpotLightCard";

function CertificateCard({
  title,
  company,
  subTitle,
  year,
  type,
  icon: iconData,
}: achievement) {
  const Icon: IconType = iconData;
  return (
    <SpotlightCard
      className="relative h-full w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 px-4 py-3 shadow-[0_12px_30px_rgba(0,0,0,0.55)] backdrop-blur-xl md:px-5 md:py-4"
      spotlightColor={spotlight.INSPIRATIONS}
    >
      <article className="relative flex h-full min-h-[150px] flex-col justify-between gap-3">
        <div className="flex items-start justify-between gap-3">
          {
            <Icon className="bottom-0 right-0 absolute text-green-500/25 h-20 w-20" />
          }
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-400">
              {type}
            </p>
            <h3 className="mt-1 text-sm font-medium text-slate-50 md:text-base">
              {title}
            </h3>
            <p className="mt-1 text-xs text-slate-400">{company}</p>
          </div>

          <div className="inline-flex h-7 items-center rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 text-[10px] font-medium text-emerald-200">
            <span className="mr-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {year}
          </div>
        </div>

        {subTitle && (
          <p className="mt-1 max-w-64 text-xs leading-relaxed text-slate-300">
            {subTitle}
          </p>
        )}
      </article>
    </SpotlightCard>
  );
}

export default CertificateCard;
