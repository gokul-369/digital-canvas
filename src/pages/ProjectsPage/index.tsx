import {
  useState,
  useEffect,
  useCallback,
  lazy,
  Suspense,
  type FC,
} from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { manifest } from "../../routes/manifest";
import { projectsList, type ProjectItem } from "../../data/projects";
import { ProjectShowcase3D } from "../../components/Projects/ProjectShowcase3D";
import InteractiveAmbient from "../../components/Backgrounds/InteractiveAmbient";
import SectionHeader from "../../components/SectionHeader";
import useTheme from "../../hooks/useTheme";
import { TechLogo } from "../../components/TechLogo";

const GitHubGraph = lazy(() => import("../../components/GitHubGraph"));
import {
  HiOutlineServer,
  HiOutlineRadio,
  HiOutlineSparkles,
  HiOutlineBriefcase,
} from "react-icons/hi2";
import {
  FiCheckCircle,
  FiExternalLink,
  FiGithub,
  FiLock,
  FiArrowRight,
} from "react-icons/fi";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

const ProjectsPage: FC = () => {
  const { theme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");

  const selectedProject: ProjectItem =
    projectsList[currentIndex] || projectsList[0];

  const handleNext = useCallback(() => {
    setDirection("next");
    setCurrentIndex((prev) => (prev + 1) % projectsList.length);
  }, []);

  const handlePrev = useCallback(() => {
    setDirection("prev");
    setCurrentIndex(
      (prev) => (prev - 1 + projectsList.length) % projectsList.length,
    );
  }, []);

  const handleSelectIndex = useCallback(
    (index: number) => {
      setDirection(index > currentIndex ? "next" : "prev");
      setCurrentIndex(index);
    },
    [currentIndex],
  );

  // Keyboard navigation listener (Left / Right arrow keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  const getCategoryIcon = (category: ProjectItem["category"]) => {
    if (category.toLowerCase().includes("observability")) {
      return <HiOutlineRadio className="w-4 h-4 text-sky-400" />;
    }
    if (
      category.toLowerCase().includes("creative") ||
      category.toLowerCase().includes("webgl")
    ) {
      return <HiOutlineSparkles className="w-4 h-4 text-emerald-400" />;
    }
    return <HiOutlineServer className="w-4 h-4 text-purple-400" />;
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden pt-28 pb-24 px-4 sm:px-6 lg:px-12 flex flex-col items-center">
      {/* Dynamic Cosmic Ambient Background */}
      <InteractiveAmbient variant="home" />

      {/* Header Section */}
      <div className="w-full max-w-5xl z-10 flex flex-col items-center text-center mb-6">
        <SectionHeader
          tag="AUTONOMOUS LABS & PERSONAL SYSTEMS"
          title="Personal Projects &"
          accent="Systems Architecture"
          description="A curated look into personal engineering platforms, endpoint observability tooling, and hardened cloud infrastructure. Professional & enterprise systems are cataloged separately."
          className="mb-8"
        />

        {/* Clean Next / Prev Controller Bar (No Tabs, Icon-Only Buttons) */}
        <div className="w-full flex items-center justify-between px-1 sm:px-2">
          {/* Active Project Counter, Label & Mini-Pills */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="px-3.5 sm:px-4 py-2 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-white/[0.04] backdrop-blur-md text-slate-800 dark:text-slate-200 shadow-sm flex items-center gap-2 sm:gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-xs font-bold tracking-wider">
                PROJECT 0{currentIndex + 1} / 0{projectsList.length}
              </span>
            </div>

            <span className="hidden sm:inline-block px-2.5 py-1 rounded-xl font-mono text-[10px] uppercase font-bold tracking-wider border border-sky-400/30 bg-sky-500/10 text-sky-600 dark:text-sky-300">
              Personal Lab
            </span>

            {/* Quick mini-indicator pills */}
            <div className="hidden sm:flex items-center gap-1.5 pl-1">
              {projectsList.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => handleSelectIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === currentIndex
                      ? "w-8 bg-sky-500"
                      : "w-2.5 bg-slate-300 dark:bg-white/20 hover:bg-slate-400 dark:hover:bg-white/40"
                  }`}
                  aria-label={`Go to project ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Right Action: Professional Experience Link + Icon-Only Prev/Next Buttons */}
          <div className="flex items-center gap-2">
            <Link
              to={manifest.experience}
              className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-2xl border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-semibold transition-all group mr-1"
            >
              <HiOutlineBriefcase className="w-4 h-4 text-indigo-500" />
              <span>EXPERIENCE</span>
              <FiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <button
              onClick={handlePrev}
              className="p-2.5 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-white/[0.04] backdrop-blur-md text-slate-700 dark:text-slate-200 hover:border-sky-400 hover:text-sky-500 hover:shadow-md transition-all duration-200 cursor-pointer flex items-center justify-center group select-none active:scale-95"
              aria-label="Previous Project"
            >
              <IoChevronBack className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={handleNext}
              className="p-2.5 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-white/[0.04] backdrop-blur-md text-slate-700 dark:text-slate-200 hover:border-sky-400 hover:text-sky-500 hover:shadow-md transition-all duration-200 cursor-pointer flex items-center justify-center group select-none active:scale-95"
              aria-label="Next Project"
            >
              <IoChevronForward className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* 3D Showcase & Project Dossier Container */}
      <div className="w-full max-w-5xl z-10 flex flex-col items-center gap-8">
        {/* 3D Interactive Project Canvas (Smooth Sliding Animation on Next / Prev) */}
        <div className="w-full">
          <ProjectShowcase3D
            project={selectedProject}
            direction={direction}
            theme={theme}
            onOpenLive={() => window.open(selectedProject.liveUrl, "_blank")}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        </div>

        {/* Detailed Engineering Breakdown & Architecture HUD (Smooth Animated Transition) */}
        <div className="w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedProject.id}
              initial={{
                opacity: 0,
                x: direction === "next" ? 25 : -25,
                filter: "blur(6px)",
              }}
              animate={{
                opacity: 1,
                x: 0,
                filter: "blur(0px)",
              }}
              exit={{
                opacity: 0,
                x: direction === "next" ? -25 : 25,
                filter: "blur(6px)",
              }}
              transition={{
                duration: 0.35,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Left Column: Project Overview & Deep Architecture (2 cols) */}
              <div className="lg:col-span-2 flex flex-col gap-6 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/75 dark:bg-white/[0.03] backdrop-blur-2xl shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200/60 dark:border-white/[0.08]">
                  <div>
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(selectedProject.category)}
                      <span className="font-mono text-xs uppercase tracking-widest text-sky-500 font-bold">
                        // {selectedProject.category}
                      </span>
                    </div>
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
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl font-mono text-xs font-medium border border-slate-200/80 dark:border-white/10 bg-slate-100/80 dark:bg-white/[0.04] text-slate-800 dark:text-slate-200 shadow-sm hover:border-sky-400/40 transition-colors"
                      >
                        <TechLogo name={tech} size={15} />
                        <span>{tech}</span>
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
                        VERIFIED LIVE
                      </span>
                    </div>

                    <div className="space-y-3 mt-4">
                      {selectedProject.metrics.map((metric) => (
                        <div
                          key={metric.label}
                          className="p-3 rounded-2xl bg-slate-100/60 dark:bg-white/[0.02] border border-slate-200/50 dark:border-white/[0.05] flex justify-between items-center gap-3"
                        >
                          <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400 shrink-0">
                            {metric.label}
                          </span>
                          <div className="flex items-center gap-2 min-w-0">
                            <TechLogo name={metric.value} size={16} />
                            <span className="font-mono text-xs font-bold text-slate-900 dark:text-white truncate">
                              {metric.value}
                            </span>
                          </div>
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
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                              Repository:{" "}
                            </span>
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
                  <span className="text-sky-500 font-bold block mb-1">
                    // SECURE NETWORKING
                  </span>
                  All container clusters are provisioned through Dokploy on
                  Oracle Cloud Infrastructure with strict ingress boundaries and
                  SSL encryption.
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Open Source Commit Graph */}
        <div className="w-full p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/75 dark:bg-white/[0.03] backdrop-blur-2xl shadow-xl">
          <Suspense
            fallback={
              <div className="w-full h-36 flex items-center justify-center font-mono text-xs text-slate-400 animate-pulse">
                Loading GitHub contribution graph…
              </div>
            }
          >
            <GitHubGraph isDark={theme === "dark"} />
          </Suspense>
        </div>

        {/* Enterprise & Professional Experience Bridge Banner */}
        <div className="w-full mt-2 p-6 sm:p-8 rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-slate-900/60 backdrop-blur-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                ENTERPRISE & COMMERCIAL SYSTEMS
              </span>
            </div>
            <h3 className="font-space text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Looking for Professional Engineering & Client Platforms?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              The projects above represent independent engineering labs and
              autonomous infrastructure. Commercial production work—including
              front-end platforms for a tier-1 UK Bank, VISA Click to Pay
              integrations, and AI MCP servers at{" "}
              <strong>Tata Consultancy Services</strong>,{" "}
              <strong>Paperflite</strong>, and{" "}
              <strong>Novac Technology Solutions</strong>—is documented in the
              Professional Experience timeline.
            </p>
          </div>

          <Link
            to={manifest.experience}
            className="shrink-0 px-6 py-3.5 rounded-2xl font-mono text-xs font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 shadow-lg hover:shadow-[0_0_25px_rgba(99,102,241,0.4)] transition-all flex items-center gap-2.5 cursor-pointer group"
          >
            <span>VIEW WORK EXPERIENCE</span>
            <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
