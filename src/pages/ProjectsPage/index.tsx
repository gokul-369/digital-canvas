import { useState, useId, type FC } from "react";
import { projectsList, type ProjectItem } from "../../data/projects";
import { ProjectShowcase3D } from "../../components/Projects/ProjectShowcase3D";
import InteractiveAmbient from "../../components/Backgrounds/InteractiveAmbient";
import SectionHeader from "../../components/SectionHeader";
import useTheme from "../../hooks/useTheme";
import { HiOutlineServer, HiOutlineRadio, HiOutlineSparkles } from "react-icons/hi2";
import { FiCheckCircle, FiExternalLink, FiGithub, FiLock } from "react-icons/fi";

const ProjectsPage: FC = () => {
  const { theme } = useTheme();
  const [selectedProjectId, setSelectedProjectId] = useState<string>("vigilens");
  const tabListId = useId();

  const selectedProject =
    projectsList.find((p) => p.id === selectedProjectId) || projectsList[0];

  const getCategoryIcon = (category: ProjectItem["category"]) => {
    if (category.toLowerCase().includes("observability")) {
      return <HiOutlineRadio className="w-4 h-4 text-sky-400" />;
    }
    if (category.toLowerCase().includes("creative") || category.toLowerCase().includes("webgl")) {
      return <HiOutlineSparkles className="w-4 h-4 text-emerald-400" />;
    }
    return <HiOutlineServer className="w-4 h-4 text-purple-400" />;
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden pt-28 pb-24 px-4 sm:px-6 lg:px-12 flex flex-col items-center">
      {/* Dynamic Cosmic Ambient Background */}
      <InteractiveAmbient variant="home" />

      {/* Header Section */}
      <div className="w-full max-w-5xl z-10 flex flex-col items-center text-center mb-10">
        <SectionHeader
          tag="// SELECTED WORKS & INFRASTRUCTURE"
          title="Featured Projects &"
          accent="Production Systems"
          description="A curated look into production platforms, endpoint observability tooling, and hardened cloud infrastructure built for reliability."
          className="mb-8"
        />

        {/* Project Selector Tabs */}
        <div
          role="tablist"
          id={tabListId}
          aria-label="Project Selection"
          className="flex items-center justify-center gap-2 p-1.5 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur-xl shadow-lg"
        >
          {projectsList.map((proj, idx) => {
            const isSelected = proj.id === selectedProject.id;
            return (
              <button
                key={proj.id}
                role="tab"
                aria-selected={isSelected}
                onClick={() => setSelectedProjectId(proj.id)}
                className={`relative px-5 py-2.5 rounded-xl font-mono text-xs font-semibold tracking-wide transition-all duration-300 flex items-center gap-2.5 cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? "bg-slate-900 text-white dark:bg-white/15 dark:text-white shadow-[0_0_20px_rgba(56,189,248,0.25)] border border-sky-400/40"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.05]"
                }`}
              >
                <span className="text-[11px] opacity-60">0{idx + 1}</span>
                {getCategoryIcon(proj.category)}
                <span>{proj.title}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </button>
            );
          })}
        </div>
      </div>

      {/* 3D Showcase & Project Dossier Container */}
      <div className="w-full max-w-5xl z-10 flex flex-col items-center gap-8">
        {/* 3D Interactive Project Canvas (Shows real screenshot with interactive tilt) */}
        <div className="w-full rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/60 dark:bg-white/[0.02] backdrop-blur-xl p-3 sm:p-4 shadow-2xl">
          <ProjectShowcase3D
            project={selectedProject}
            theme={theme}
            onOpenLive={() => window.open(selectedProject.liveUrl, "_blank")}
          />
        </div>

        {/* Detailed Engineering Breakdown & Architecture HUD */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Project Overview & Deep Architecture (2 cols) */}
          <div className="lg:col-span-2 flex flex-col gap-6 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/75 dark:bg-white/[0.03] backdrop-blur-2xl shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200/60 dark:border-white/[0.08]">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-sky-500 font-bold">
                  // {selectedProject.category}
                </span>
                <h2 className="font-space text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
                  {selectedProject.title}
                </h2>
              </div>

              <a
                href={selectedProject.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs font-semibold px-3 py-1.5 rounded-full border border-sky-400/40 bg-sky-500/10 text-sky-600 dark:text-sky-300 hover:bg-sky-500/20 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>{selectedProject.domainUrl}</span>
                <FiExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <p className="font-caveat text-xl text-sky-600 dark:text-sky-400 -mt-2">
              "{selectedProject.tagline}"
            </p>

            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {selectedProject.description}
            </p>

            {/* Architecture Highlights */}
            <div className="space-y-3 pt-2">
              <h3 className="font-mono text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 font-semibold">
                // ARCHITECTURAL IMPLEMENTATION
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {selectedProject.architectureHighlights.map((hl) => (
                  <div
                    key={hl.title}
                    className="p-3.5 rounded-2xl bg-slate-100/60 dark:bg-white/[0.02] border border-slate-200/50 dark:border-white/[0.05] flex items-start gap-3"
                  >
                    <FiCheckCircle className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                    <div>
                      <h4 className="font-space text-xs font-bold text-slate-900 dark:text-white">
                        {hl.title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                        {hl.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech Stack */}
            <div className="pt-4 border-t border-slate-200/60 dark:border-white/[0.08]">
              <h3 className="font-mono text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 font-semibold mb-3">
                // STACK & TOOLING
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedProject.stack.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 rounded-lg font-mono text-[11px] font-medium border border-slate-200/80 dark:border-white/10 bg-slate-100/80 dark:bg-white/[0.04] text-slate-700 dark:text-slate-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Deployment Specs & Actions (1 col) */}
          <div className="flex flex-col gap-6">
            {/* Deployment Specs Box */}
            <div className="p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/75 dark:bg-white/[0.03] backdrop-blur-2xl shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-white/[0.08]">
                  <span className="font-mono text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 font-semibold">
                    // DEPLOYMENT SPECS
                  </span>
                  <span className="flex items-center gap-1.5 font-mono text-xs font-bold text-emerald-500">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    LIVE ON OCI
                  </span>
                </div>

                <div className="space-y-3 mt-4">
                  {selectedProject.metrics.map((metric) => (
                    <div
                      key={metric.label}
                      className="p-3 rounded-2xl bg-slate-100/60 dark:bg-white/[0.02] border border-slate-200/50 dark:border-white/[0.05] flex justify-between items-center"
                    >
                      <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                        {metric.label}
                      </span>
                      <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                        {metric.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Launch Buttons */}
              <div className="mt-8 flex flex-col gap-3">
                <a
                  href={selectedProject.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 rounded-2xl font-mono text-xs font-bold tracking-wide text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 shadow-lg hover:shadow-[0_0_25px_rgba(56,189,248,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>OPEN {selectedProject.title.toUpperCase()}</span>
                  <FiExternalLink className="w-4 h-4" />
                </a>

                {selectedProject.isPrivate ? (
                  <div className="w-full py-3 px-4 rounded-2xl font-mono text-xs border border-slate-200/80 dark:border-white/10 bg-slate-100/70 dark:bg-white/[0.02] text-slate-600 dark:text-slate-400 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <FiLock className="w-4 h-4 text-amber-500 shrink-0" />
                      <div>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">Repository: </span>
                        <span>Closed Source</span>
                      </div>
                    </div>
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-bold">
                      Private
                    </span>
                  </div>
                ) : selectedProject.githubUrl ? (
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 rounded-2xl font-mono text-xs font-semibold tracking-wide border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/[0.03] text-slate-800 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.08] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <FiGithub className="w-4 h-4" />
                    <span>INSPECT OPEN SOURCE REPO</span>
                  </a>
                ) : null}
              </div>
            </div>

            {/* Quick Summary Note */}
            <div className="p-5 rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/75 dark:bg-white/[0.03] backdrop-blur-2xl shadow-xl font-mono text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              <span className="text-sky-500 font-bold block mb-1">// SECURE NETWORKING</span>
              All container clusters are provisioned through Dokploy on Oracle Cloud Infrastructure with strict ingress boundaries and SSL encryption.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
