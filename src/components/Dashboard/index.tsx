import { memo } from "react";
import type { ThemeClassSet } from "../../types";
import SpotlightCard from "../SpotLightCard";
import { MdArrowRightAlt } from "react-icons/md";
import { RiDoubleQuotesL } from "react-icons/ri";
import { IoCameraOutline, IoBookOutline } from "react-icons/io5";
import { HiOutlineBriefcase } from "react-icons/hi";
import { HiOutlineCommandLine, HiOutlineRocketLaunch } from "react-icons/hi2";
import { HashLink } from "react-router-hash-link";
import { FiAward } from "react-icons/fi";
import { useAppContext } from "../../context/AppContext";
import { manifest } from "../../routes/manifest";
import { scrollWithLenis } from "../../utils/scroll";
import SectionHeader from "../SectionHeader";

function Dashboard({ theme: _theme }: { theme?: ThemeClassSet }) {
  const { openCollaborate } = useAppContext();

  return (
    <section className="relative w-full flex flex-col items-center px-4 sm:px-6 lg:px-24 py-16 sm:py-24 bg-transparent">
      <SectionHeader
        tag="Navigation & Modules"
        title="Curated corners of my"
        accent="digital canvas"
        description="Jump directly into production architecture, 3D visual journals, peer testimonials, or collaborative inquiries."
        className="mb-10 sm:mb-14"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 z-10 w-full max-w-6xl">
        {/* CARD 1: Experience & Scale (Sky Theme) */}
        <div className="col-span-1 md:col-span-2">
          <SpotlightCard
            className="h-full rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur-xl hover:border-sky-400 hover:shadow-[0_4px_20px_rgba(56,189,248,0.12)] flex flex-col justify-between transition-all duration-300"
            spotlightColor="rgba(56, 189, 248, 0.45)"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-white/[0.08]">
                <span className="font-mono text-xs uppercase tracking-wider text-sky-600 dark:text-sky-400 font-semibold">
                  // 01 · CAREER & IMPACT
                </span>
                <span className="font-mono text-[11px] px-3 py-1 rounded-full border border-sky-400/40 bg-sky-500/10 text-sky-600 dark:text-sky-300 font-semibold">
                  5+ Yrs Production
                </span>
              </div>

              <h3 className="font-space text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-4">
                My Journey in Shipping at Scale
              </h3>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
                From core frontend architectures and zero-latency state systems to enterprise engineering at TCS and Paperflite. Discover how I build for performance.
              </p>
            </div>

            <div className="mt-8 flex items-center justify-between">
              <HashLink
                to={manifest.experience}
                scroll={scrollWithLenis}
                className="inline-flex items-center gap-2 text-xs font-mono font-medium text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors cursor-pointer group"
              >
                <span>Explore career timeline</span>
                <MdArrowRightAlt className="text-lg group-hover:translate-x-1.5 transition-transform" />
              </HashLink>
              <HiOutlineBriefcase className="h-9 w-9 text-sky-500/30" />
            </div>
          </SpotlightCard>
        </div>

        {/* CARD 2: Tech Matrix / Skills (Indigo Theme) */}
        <div className="col-span-1">
          <SpotlightCard
            className="h-full rounded-3xl p-7 border border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur-xl hover:border-indigo-400 hover:shadow-[0_4px_20px_rgba(99,102,241,0.12)] flex flex-col justify-between transition-all duration-300"
            spotlightColor="rgba(99, 102, 241, 0.45)"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-white/[0.08]">
                <span className="font-mono text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-semibold">
                  // 02 · STACK MATRIX
                </span>
                <span className="font-mono text-[11px] px-3 py-1 rounded-full border border-indigo-400/40 bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 font-semibold">
                  35+ Tech
                </span>
              </div>

              <h3 className="font-space text-xl font-bold tracking-tight text-slate-900 dark:text-white mt-4">
                Architectural Tooling
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                React, TypeScript, Next.js, GenAI MCP servers, Docker, and distributed realtime interfaces.
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <HashLink
                to={manifest.skills}
                scroll={scrollWithLenis}
                className="inline-flex items-center gap-2 text-xs font-mono font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors cursor-pointer group"
              >
                <span>View stack cockpit</span>
                <MdArrowRightAlt className="text-lg group-hover:translate-x-1.5 transition-transform" />
              </HashLink>
              <HiOutlineCommandLine className="h-8 w-8 text-indigo-500/30" />
            </div>
          </SpotlightCard>
        </div>

        {/* CARD 3: 3D Visual Journal (Amber Theme) */}
        <div className="col-span-1">
          <SpotlightCard
            className="h-full rounded-3xl p-7 border border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur-xl hover:border-amber-400 hover:shadow-[0_4px_20px_rgba(245,158,11,0.12)] flex flex-col justify-between transition-all duration-300"
            spotlightColor="rgba(245, 158, 11, 0.45)"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-white/[0.08]">
                <span className="font-mono text-xs uppercase tracking-wider text-amber-600 dark:text-amber-400 font-semibold">
                  // 03 · 3D GALLERY
                </span>
                <span className="font-mono text-[11px] px-3 py-1 rounded-full border border-amber-400/40 bg-amber-500/10 text-amber-600 dark:text-amber-300 font-semibold">
                  35mm RAW
                </span>
              </div>

              <h3 className="font-space text-xl font-bold tracking-tight text-slate-900 dark:text-white mt-4">
                Visual Journal
              </h3>
              <p className="mt-2 font-caveat text-xl text-amber-600 dark:text-amber-400">
                "Moments I chose to freeze in time."
              </p>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                A 3D interactive collection of light, street, and compositions captured through prime glass.
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <HashLink
                to={manifest.gallery}
                scroll={scrollWithLenis}
                className="inline-flex items-center gap-2 text-xs font-mono font-medium text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors cursor-pointer group"
              >
                <span>Enter 3D gallery</span>
                <MdArrowRightAlt className="text-lg group-hover:translate-x-1.5 transition-transform" />
              </HashLink>
              <IoCameraOutline className="h-8 w-8 text-amber-500/30" />
            </div>
          </SpotlightCard>
        </div>

        {/* CARD 4: Voices & Testimonials (Blue Theme) */}
        <div className="col-span-1">
          <SpotlightCard
            className="h-full rounded-3xl p-7 border border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur-xl hover:border-blue-400 hover:shadow-[0_4px_20px_rgba(59,130,246,0.12)] flex flex-col justify-between transition-all duration-300"
            spotlightColor="rgba(59, 130, 246, 0.45)"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-white/[0.08]">
                <span className="font-mono text-xs uppercase tracking-wider text-blue-600 dark:text-blue-400 font-semibold">
                  // 04 · PERSPECTIVES
                </span>
                <span className="font-mono text-[11px] px-3 py-1 rounded-full border border-blue-400/40 bg-blue-500/10 text-blue-600 dark:text-blue-300 font-semibold">
                  Peer Reviews
                </span>
              </div>

              <h3 className="font-space text-xl font-bold tracking-tight text-slate-900 dark:text-white mt-4">
                Voices & Feedback
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                Unfiltered testimonials and recommendations from colleagues, tech leads, and teammates I’ve built with.
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <HashLink
                to={manifest.testimonials}
                scroll={scrollWithLenis}
                className="inline-flex items-center gap-2 text-xs font-mono font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer group"
              >
                <span>Read testimonials</span>
                <MdArrowRightAlt className="text-lg group-hover:translate-x-1.5 transition-transform" />
              </HashLink>
              <RiDoubleQuotesL className="h-8 w-8 text-blue-500/30" />
            </div>
          </SpotlightCard>
        </div>

        {/* CARD 5: Recognition & Honors (Purple Theme) */}
        <div className="col-span-1">
          <SpotlightCard
            className="h-full rounded-3xl p-7 border border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur-xl hover:border-purple-400 hover:shadow-[0_4px_20px_rgba(168,85,247,0.12)] flex flex-col justify-between transition-all duration-300"
            spotlightColor="rgba(168, 85, 247, 0.45)"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-white/[0.08]">
                <span className="font-mono text-xs uppercase tracking-wider text-purple-600 dark:text-purple-400 font-semibold">
                  // 05 · RECOGNITION
                </span>
                <span className="font-mono text-[11px] px-3 py-1 rounded-full border border-purple-400/40 bg-purple-500/10 text-purple-600 dark:text-purple-300 font-semibold">
                  9 Milestones
                </span>
              </div>

              <h3 className="font-space text-xl font-bold tracking-tight text-slate-900 dark:text-white mt-4">
                Honors & Accolades
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                Department topper, physics symposium medalist, hackathon winner, and outstanding enterprise contributions.
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <HashLink
                to={manifest.awards}
                scroll={scrollWithLenis}
                className="inline-flex items-center gap-2 text-xs font-mono font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors cursor-pointer group"
              >
                <span>Explore honors</span>
                <MdArrowRightAlt className="text-lg group-hover:translate-x-1.5 transition-transform" />
              </HashLink>
              <FiAward className="h-8 w-8 text-purple-500/30" />
            </div>
          </SpotlightCard>
        </div>

        {/* CARD 6: 3D Literary Codex / Reading Shelf (Full width banner matching Card 7) */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3">
          <SpotlightCard
            className="h-full rounded-3xl p-7 sm:p-8 border border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur-xl hover:border-indigo-400 hover:shadow-[0_4px_20px_rgba(99,102,241,0.12)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 transition-all duration-300"
            spotlightColor="rgba(99, 102, 241, 0.45)"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-200/60 dark:border-white/[0.08]">
                <span className="font-mono text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-semibold">
                  // 06 · 3D LIBRARY
                </span>
                <span className="font-mono text-[11px] px-3 py-1 rounded-full border border-indigo-400/40 bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                  12 Volumes
                </span>
              </div>

              <div className="mt-4 flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
                <h3 className="font-space text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Literary Codex
                </h3>
                <p className="font-caveat text-xl text-indigo-600 dark:text-indigo-400">
                  "Ideas that shaped how I think."
                </p>
              </div>

              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                A tactile 3D interactive bookshelf of existential classics, Russian literature, Eastern philosophy, and behavioral psychology.
              </p>
            </div>

            <div className="flex items-center gap-4 flex-shrink-0">
              <HashLink
                to={manifest.books}
                scroll={scrollWithLenis}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-semibold shadow-md shadow-indigo-500/25 transition-all group"
              >
                <span>Enter 3D library</span>
                <MdArrowRightAlt className="text-base group-hover:translate-x-1.5 transition-transform" />
              </HashLink>
              <IoBookOutline className="h-10 w-10 text-indigo-500/30 hidden sm:block" />
            </div>
          </SpotlightCard>
        </div>

        {/* CARD 7: Interactive Terminal / Direct Inquiries (Emerald Theme) */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3">
          <SpotlightCard
            onClick={openCollaborate}
            spotlightColor="rgba(16, 185, 129, 0.45)"
            className="w-full rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur-xl hover:border-emerald-400 hover:shadow-[0_4px_20px_rgba(16,185,129,0.12)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 cursor-pointer transition-all duration-300 select-none overflow-hidden hover:-translate-y-1 group"
          >
            <div className="relative z-10 flex items-center gap-5">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-400/40 dark:border-emerald-400/30 text-emerald-600 dark:text-emerald-400 shadow-sm group-hover:scale-105 transition-transform">
                <HiOutlineRocketLaunch className="h-7 w-7" />
              </div>
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold">
                  // 07 · INITIATE TRANSMISSION
                </span>
                <h3 className="font-space text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
                  Have a challenging product or architecture in mind?
                </h3>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                  Open the collaborative inquiry terminal to connect directly with me.
                </p>
              </div>
            </div>

            <div className="relative z-10 flex-shrink-0">
              <button
                type="button"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 text-white font-mono text-xs font-semibold shadow-md shadow-emerald-500/25 group-hover:bg-emerald-500 transition-colors pointer-events-none"
              >
                <span>Send Dispatch</span>
                <MdArrowRightAlt className="text-base group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </SpotlightCard>
        </div>
      </div>
    </section>
  );
}

export default memo(Dashboard);
