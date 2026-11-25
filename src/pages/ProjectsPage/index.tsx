import { useState, useId, type FC } from "react";
import { projectsList, type ProjectItem } from "../../data/projects";
import { OrbitalConsole } from "../../components/Projects/OrbitalConsole";
import InteractiveAmbient from "../../components/Backgrounds/InteractiveAmbient";
import SectionHeader from "../../components/SectionHeader";
import useTheme from "../../hooks/useTheme";
import { HiOutlineServer, HiOutlineRadio, HiOutlineCpuChip } from "react-icons/hi2";
import { FiCheckCircle, FiExternalLink, FiGithub } from "react-icons/fi";

const ProjectsPage: FC = () => {
  const { theme } = useTheme();
  const [selectedProjectId, setSelectedProjectId] = useState<string>("vigilens");
  const tabListId = useId();

  const selectedProject =
    projectsList.find((p) => p.id === selectedProjectId) || projectsList[0];

  const getCategoryIcon = (category: ProjectItem["category"]) => {
    switch (category) {
      case "Observability & Telemetry":
        return <HiOutlineRadio className="w-4 h-4 text-sky-400" />;
      case "Cloud Infrastructure":
        return <HiOutlineServer className="w-4 h-4 text-purple-400" />;
      default:
        return <HiOutlineCpuChip className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden pt-28 pb-24 px-4 sm:px-6 lg:px-12 flex flex-col items-center">
      {/* Dynamic Cosmic Ambient Background */}
      <InteractiveAmbient variant="home" />

      {/* Page Title & Mission Header */}
      <div className="w-full max-w-5xl z-10 flex flex-col items-center text-center mb-8">
        <SectionHeader
          tag="// AVIONICS & SYSTEMS TELEMETRY"
          title="Orbital Nodes &"
          accent="Production Engineering"
          description="Hardware-inspired mission control console tracking live endpoint observability engines, hardened cloud VPS infrastructure, and distributed applications."
          className="mb-8"
        />

        {/* Hardware Blade Selector Tabs */}
        <div
          role="tablist"
          id={tabListId}
          aria-label="Hardware Blade Selector"
          className="w-full max-w-3xl flex items-center justify-center gap-2 p-1.5 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur-xl shadow-lg overflow-x-auto no-scrollbar"
        >
          {projectsList.map((proj, idx) => {
            const isSelected = proj.id === selectedProject.id;
            return (
              <button
                key={proj.id}
                role="tab"
                aria-selected={isSelected}
                onClick={() => setSelectedProjectId(proj.id)}
                className={`relative px-4 py-2.5 rounded-xl font-mono text-xs font-semibold tracking-wide transition-all duration-300 flex items-center gap-2.5 cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? "bg-slate-900 text-white dark:bg-white/15 dark:text-white shadow-[0_0_20px_rgba(56,189,248,0.25)] border border-sky-400/40"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.05]"
                }`}
              >
                <span className="text-[11px] opacity-60">0{idx + 1}</span>
                {getCategoryIcon(proj.category)}
                <span>{proj.title}</span>
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    proj.telemetry.status === "ONLINE" || proj.telemetry.status === "ACTIVE"
                      ? "bg-emerald-400 animate-pulse"
                      : "bg-amber-400"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Main 3D Space-Grade Console Viewport */}
      <div className="w-full max-w-5xl z-10 flex flex-col items-center">
        <OrbitalConsole project={selectedProject} theme={theme} className="mb-6" />

        {/* Deep-Dive Technical Telemetry HUD */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Left Column: Project Architecture & Specs (2 cols) */}
          <div className="lg:col-span-2 flex flex-col gap-5 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/75 dark:bg-white/[0.03] backdrop-blur-2xl shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200/60 dark:border-white/[0.08]">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-sky-500 font-bold">
                  // {selectedProject.category}
                </span>
                <h2 className="font-space text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
                  {selectedProject.title}
                </h2>
              </div>

              <span className="font-mono text-xs font-semibold px-3 py-1 rounded-full border border-sky-400/30 bg-sky-500/10 text-sky-600 dark:text-sky-300">
                {selectedProject.badge}
              </span>
            </div>

            <p className="font-caveat text-xl text-sky-600 dark:text-sky-400 -mt-1">
              "{selectedProject.tagline}"
            </p>

            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {selectedProject.description}
            </p>

            {/* Architecture Highlights */}
            <div className="mt-2">
              <h3 className="font-mono text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 font-semibold mb-3">
                // ENGINEERING HIGHLIGHTS & ARCHITECTURE
              </h3>
              <ul className="space-y-2.5">
                {selectedProject.highlights.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                    <FiCheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tech Stack Badges */}
            <div className="mt-3 pt-4 border-t border-slate-200/60 dark:border-white/[0.08]">
              <h3 className="font-mono text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 font-semibold mb-3">
                // SYSTEM STACK
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

          {/* Right Column: Real-Time Telemetry & Hardware Spec Deck (1 col) */}
          <div className="flex flex-col gap-5">
            {/* Live Metrics Box */}
            <div className="p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/75 dark:bg-white/[0.03] backdrop-blur-2xl shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-white/[0.08]">
                  <span className="font-mono text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 font-semibold">
                    // LIVE TELEMETRY
                  </span>
                  <span className="flex items-center gap-1.5 font-mono text-xs font-bold text-emerald-500">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    {selectedProject.telemetry.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="p-3 rounded-2xl bg-slate-100/60 dark:bg-white/[0.02] border border-slate-200/50 dark:border-white/[0.05]">
                    <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 uppercase">
                      Ping Latency
                    </span>
                    <p className="font-mono text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                      {selectedProject.telemetry.latencyMs}ms
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-100/60 dark:bg-white/[0.02] border border-slate-200/50 dark:border-white/[0.05]">
                    <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 uppercase">
                      Uptime
                    </span>
                    <p className="font-mono text-lg font-bold text-emerald-500 mt-0.5">
                      {selectedProject.telemetry.uptime}
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-100/60 dark:bg-white/[0.02] border border-slate-200/50 dark:border-white/[0.05]">
                    <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 uppercase">
                      Protocol
                    </span>
                    <p className="font-mono text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                      {selectedProject.telemetry.protocol}
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-100/60 dark:bg-white/[0.02] border border-slate-200/50 dark:border-white/[0.05]">
                    <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 uppercase">
                      Port
                    </span>
                    <p className="font-mono text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                      :{selectedProject.telemetry.port}
                    </p>
                  </div>
                </div>

                <div className="mt-4 p-3 rounded-2xl bg-slate-100/60 dark:bg-white/[0.02] border border-slate-200/50 dark:border-white/[0.05]">
                  <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 uppercase">
                    Node Location
                  </span>
                  <p className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    {selectedProject.telemetry.nodeLocation}
                  </p>
                </div>
              </div>

              {/* Action Links */}
              <div className="mt-6 flex flex-col gap-2.5">
                {selectedProject.liveUrl && (
                  <a
                    href={selectedProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 rounded-2xl font-mono text-xs font-bold tracking-wide text-white bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 hover:from-sky-400 hover:to-purple-500 shadow-lg hover:shadow-[0_0_25px_rgba(56,189,248,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>LAUNCH APPLICATION</span>
                    <FiExternalLink className="w-4 h-4" />
                  </a>
                )}

                {selectedProject.githubUrl && (
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-2xl font-mono text-xs font-semibold tracking-wide border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/[0.03] text-slate-800 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.08] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <FiGithub className="w-4 h-4" />
                    <span>INSPECT SOURCE CODE</span>
                  </a>
                )}
              </div>
            </div>

            {/* Hardware Rack Specs Box */}
            <div className="p-5 rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/75 dark:bg-white/[0.03] backdrop-blur-2xl shadow-xl">
              <span className="font-mono text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 font-semibold">
                // HARDWARE ENCLOSURE
              </span>
              <div className="mt-3 space-y-2 font-mono text-xs text-slate-600 dark:text-slate-400">
                <div className="flex justify-between py-1 border-b border-slate-200/40 dark:border-white/[0.04]">
                  <span>Rack Unit:</span>
                  <span className="text-slate-900 dark:text-white font-bold">{selectedProject.hardwareSpec.rackUnit} Blade</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/40 dark:border-white/[0.04]">
                  <span>Processing:</span>
                  <span className="text-slate-900 dark:text-white font-bold">{selectedProject.hardwareSpec.freq}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Power Draw:</span>
                  <span className="text-slate-900 dark:text-white font-bold">{selectedProject.hardwareSpec.power}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
