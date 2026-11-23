import { RiDoubleQuotesL } from "react-icons/ri";
import type { testimonial } from "../../types";

function TestimonialCard({ testimonial }: { testimonial: testimonial }) {
  const initials = testimonial.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      style={{ isolation: "isolate" }}
      className="group relative w-[330px] sm:w-[420px] md:w-[450px] h-[410px] sm:h-[395px] flex flex-col justify-between p-5 sm:p-6 mx-3 rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur-xl shadow-[0_4px_20px_rgba(99,102,241,0.05)] dark:shadow-none hover:border-indigo-400/60 hover:shadow-[0_0_35px_rgba(99,102,241,0.22)] transition-all duration-300 select-none overflow-hidden hover:-translate-y-1"
    >
      {/* Specular Ambient Aura */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Top Header: Quote Icon */}
      <div className="relative z-10 flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-white/5">
        <RiDoubleQuotesL className="text-2xl text-indigo-500/80 dark:text-indigo-400/70" />
      </div>

      {/* Testimonial Quote */}
      <div className="relative z-10 my-2 flex-1 overflow-y-auto scrollbar-none">
        <p className="text-xs sm:text-[12.5px] leading-relaxed text-slate-700 dark:text-slate-300 font-normal">
          "{testimonial.testimonial}"
        </p>
      </div>

      {/* Author Footer */}
      <div className="relative z-10 pt-3 border-t border-slate-200/60 dark:border-white/5 flex items-center gap-3">
        {testimonial.image ? (
          <img
            src={testimonial.image}
            alt={testimonial.name}
            className="h-10 w-10 sm:h-11 sm:w-11 object-cover rounded-2xl border border-indigo-200 dark:border-white/15 shadow-sm"
          />
        ) : (
          <div className="flex h-10 w-10 sm:h-11 sm:w-11 flex-shrink-0 items-center justify-center rounded-2xl border border-indigo-200/60 dark:border-white/15 bg-indigo-50/90 dark:bg-white/10 text-indigo-600 dark:text-indigo-300 font-mono font-bold text-xs shadow-sm">
            {initials}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="font-space text-sm font-bold text-slate-900 dark:text-white truncate">
            {testimonial.name}
          </p>
          <p className="font-mono text-[11px] text-slate-500 dark:text-slate-400 truncate">
            {testimonial.jobTitle} · {testimonial.company}
          </p>
        </div>
      </div>
    </div>
  );
}

export default TestimonialCard;
