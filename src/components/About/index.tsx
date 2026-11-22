import BlurText from "../../animations/Text/BlurText";
import type { ThemeClassSet } from "../../types";
import ProfileCard from "../ProfileCard/ProfileCard";
import ProfilePicture from "../../assets/profile.webp";
import { bio, educationItems } from "../../data";
import TextType from "../../animations/Text/TypeWriter";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";
import { MdOutlineMailOutline } from "react-icons/md";
import {
  IoSchoolOutline,
  IoSparklesOutline,
  IoTrophyOutline,
  IoCodeSlashOutline,
  IoHardwareChipOutline,
  IoSpeedometerOutline,
  IoCameraOutline,
  IoBarbellOutline,
  IoFilmOutline,
  IoFootballOutline,
  IoTerminalOutline,
} from "react-icons/io5";
import SectionHeader from "../SectionHeader";

const interestPills = [
  { name: "Frontend & Motion Systems", category: "Engineering", icon: IoCodeSlashOutline },
  { name: "GenAI & MCP Servers", category: "Intelligence", icon: IoHardwareChipOutline },
  { name: "Formula 1 & Motorsports", category: "Adrenaline", icon: IoSpeedometerOutline },
  { name: "35mm Analog Photography", category: "Visual Craft", icon: IoCameraOutline },
  { name: "Iron & Athletic Conditioning", category: "Discipline", icon: IoBarbellOutline },
  { name: "Cinema & Visual Narrative", category: "Storytelling", icon: IoFilmOutline },
  { name: "Football & Tactics", category: "Strategy", icon: IoFootballOutline },
  { name: "Developer Automation", category: "Productivity", icon: IoTerminalOutline },
];

function About({ theme: _theme }: { theme?: ThemeClassSet }) {
  const [startTyping, setStartTyping] = useState(false);
  const [activeTab, setActiveTab] = useState<"me" | "education" | "interests">("me");

  return (
    <section
      id="about"
      className="relative w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-24 flex flex-col items-center bg-transparent"
    >
      <SectionHeader
        tag="Personal Dossier"
        title="It’s time to get to"
        accent="know me"
        description="A glimpse into who I am, where I studied, and what sparks my curiosity outside the code editor."
        className="mb-8 sm:mb-12"
      />

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start z-10">
        {/* Left Column: 3D Holographic Profile Dossier */}
        <div className="lg:col-span-5 flex flex-col items-center w-full">
          <ProfileCard
            className="w-full max-w-[270px] sm:max-w-[320px] lg:max-w-[340px] text-center touch-pan-y"
            name="Gokul"
            title="Software Engineer"
            handle="gokul-369"
            status="Github"
            contactText="View Profile"
            avatarUrl={ProfilePicture}
            showUserInfo={true}
            enableTilt={true}
            enableMobileTilt={true}
            onContactClick={() => {
              window.open("https://github.com/gokul-369", "_blank");
            }}
            behindGlowColor="hsla(245, 90%, 65%, 0.4)"
            behindGlowEnabled
            innerGradient="linear-gradient(145deg, rgba(99,102,241,0.18) 0%, rgba(168,85,247,0.15) 50%, rgba(56,189,248,0.12) 100%)"
          />

          {/* Dossier Status Pill */}
          <div className="mt-4 sm:mt-5 inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/70 dark:bg-white/[0.04] backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-xs text-slate-700 dark:text-slate-300 font-medium">
              STATUS: PRODUCTION READY · ACTIVE
            </span>
          </div>
        </div>

        {/* Right Column: Interactive Dossier Modules */}
        <div className="lg:col-span-7 flex flex-col w-full items-center lg:items-start">
          {/* Dossier Module Selector Tabs - Cosmic Glass */}
          <div className="w-full max-w-sm sm:max-w-none sm:w-fit grid grid-cols-3 sm:flex items-center gap-1 sm:gap-1.5 p-1 sm:p-1.5 rounded-2xl bg-white/70 dark:bg-white/[0.04] backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-sm mb-6 sm:mb-8">
            {[
              {
                id: "me",
                shortLabel: "Identity",
                fullLabel: "// 01 · Identity & Core",
              },
              {
                id: "education",
                shortLabel: "Academics",
                fullLabel: "// 02 · Academic Pedigree",
              },
              {
                id: "interests",
                shortLabel: "Passions",
                fullLabel: "// 03 · Passions & Craft",
              },
            ].map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id as typeof activeTab);
                    if (tab.id === "me") setStartTyping(false);
                  }}
                  className={`relative px-2 py-2 sm:px-4 sm:py-2 rounded-xl text-center text-xs font-mono font-medium transition-colors duration-200 cursor-pointer select-none ${
                    isSelected
                      ? "text-white"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="about-active-tab"
                      className="absolute inset-0 bg-indigo-600 rounded-xl shadow-md shadow-indigo-500/25 -z-0"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10 block sm:hidden text-[11px] font-semibold truncate">
                    {tab.shortLabel}
                  </span>
                  <span className="relative z-10 hidden sm:inline whitespace-nowrap">
                    {tab.fullLabel}
                  </span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: ME & IDENTITY */}
          <AnimatePresence mode="wait">
            {activeTab === "me" && (
              <motion.div
                key="me"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="flex flex-col space-y-6 w-full"
              >
                <div>
                  <BlurText
                    delay={180}
                    animateBy="tags"
                    direction="top"
                    onAnimationComplete={() => setStartTyping(true)}
                    className="text-3xl sm:text-4xl lg:text-5xl font-bold font-space text-slate-900 dark:text-white tracking-tight flex items-baseline"
                  >
                    <span>Hi, I am </span>
                    <span className="ml-3 text-indigo-600 dark:text-indigo-400">Gokul</span>
                  </BlurText>

                  <div className="h-8 mt-2 flex items-center">
                    {startTyping && (
                      <p className="text-base sm:text-lg font-mono text-slate-600 dark:text-slate-300">
                        I am also{" "}
                        <TextType
                          text={[
                            "A Frontend Architect",
                            "A 35mm Photographer",
                            "An F1 Enthusiast",
                            "A Gym & Iron Athlete",
                          ]}
                          typingSpeed={65}
                          pauseDuration={1400}
                          showCursor
                          cursorCharacter="_"
                          deletingSpeed={45}
                          textColors={[
                            "oklch(62.3% 0.214 259.815)",
                            "oklch(58.5% 0.233 277.117)",
                            "oklch(76.9% 0.188 70.08)",
                          ]}
                          cursorBlinkDuration={0.5}
                        />
                      </p>
                    )}
                  </div>
                </div>

                {/* Glassy Bio Narrative Plaque */}
                <div className="rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur-xl p-6 sm:p-7 shadow-sm">
                  <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300 font-normal">
                    {bio.description}
                  </p>
                </div>

                {/* Dossier Key Stats Matrix */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-4 rounded-2xl border border-slate-200/70 dark:border-white/5 bg-white/60 dark:bg-white/[0.02] backdrop-blur-md text-center">
                    <span className="font-space text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                      5+ Yrs
                    </span>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1">
                      Production Craft
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl border border-slate-200/70 dark:border-white/5 bg-white/60 dark:bg-white/[0.02] backdrop-blur-md text-center">
                    <span className="font-space text-2xl font-bold text-sky-600 dark:text-sky-400">
                      35+
                    </span>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1">
                      Battle Stack
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl border border-slate-200/70 dark:border-white/5 bg-white/60 dark:bg-white/[0.02] backdrop-blur-md text-center">
                    <span className="font-space text-2xl font-bold text-amber-600 dark:text-amber-400">
                      Rank #1
                    </span>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1">
                      Dept Topper
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl border border-slate-200/70 dark:border-white/5 bg-white/60 dark:bg-white/[0.02] backdrop-blur-md text-center">
                    <span className="font-space text-2xl font-bold text-purple-600 dark:text-purple-400">
                      35mm
                    </span>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1">
                      Prime Glass
                    </p>
                  </div>
                </div>

                {/* Social Connect Dock */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <a
                    href="https://linkedin.com/in/gokul-c-40773a1b6"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-white/[0.04] backdrop-blur-md text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-white hover:border-indigo-400/50 transition-all text-xs font-mono font-medium shadow-sm active:scale-95"
                  >
                    <FaLinkedin className="text-base text-blue-500" />
                    <span>LinkedIn</span>
                  </a>
                  <a
                    href="https://github.com/gokul-369"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-white/[0.04] backdrop-blur-md text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-white hover:border-indigo-400/50 transition-all text-xs font-mono font-medium shadow-sm active:scale-95"
                  >
                    <FaGithub className="text-base text-slate-800 dark:text-white" />
                    <span>GitHub</span>
                  </a>
                  <a
                    href="mailto:gokul369@outlook.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-white/[0.04] backdrop-blur-md text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-white hover:border-indigo-400/50 transition-all text-xs font-mono font-medium shadow-sm active:scale-95"
                  >
                    <MdOutlineMailOutline className="text-base text-indigo-500" />
                    <span>gokul369@outlook.com</span>
                  </a>
                  <a
                    href="https://www.instagram.com/gokul__369/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-white/[0.04] backdrop-blur-md text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-white hover:border-indigo-400/50 transition-all text-xs font-mono font-medium shadow-sm active:scale-95"
                  >
                    <FaInstagram className="text-base text-pink-500" />
                    <span>Instagram</span>
                  </a>
                </div>
              </motion.div>
            )}

            {/* TAB 2: ACADEMIC PEDIGREE */}
            {activeTab === "education" && (
              <motion.div
                key="education"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="space-y-4 w-full"
              >
                {educationItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="group relative flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur-xl shadow-sm transition-all duration-300 hover:border-indigo-400/60 hover:shadow-[0_0_30px_rgba(99,102,241,0.18)]"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border border-indigo-200/60 dark:border-indigo-400/30 bg-indigo-50/80 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shadow-sm">
                        {idx === 0 ? (
                          <IoSchoolOutline size={22} />
                        ) : idx === 1 ? (
                          <IoSparklesOutline size={22} />
                        ) : (
                          <IoTrophyOutline size={22} />
                        )}
                      </div>

                      <div>
                        <h4 className="font-space text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                          {item.title}
                        </h4>
                        <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          {item.subTitle}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 sm:mt-0 sm:ml-4 flex-shrink-0">
                      <span className="font-mono text-[10px] px-3 py-1 rounded-full border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-300 uppercase tracking-wider font-semibold">
                        // ACCREDITATION
                      </span>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* TAB 3: PASSIONS & CRAFT */}
            {activeTab === "interests" && (
              <motion.div
                key="interests"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full"
              >
                {interestPills.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.name}
                      className="group flex items-center justify-between p-4 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur-xl shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-400/60 hover:shadow-[0_0_25px_rgba(99,102,241,0.18)]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 dark:bg-white/5 border border-indigo-200/60 dark:border-white/10 text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
                          <Icon size={18} />
                        </div>
                        <div>
                          <h5 className="font-space text-sm font-semibold text-slate-800 dark:text-white">
                            {item.name}
                          </h5>
                          <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            {item.category}
                          </span>
                        </div>
                      </div>

                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 opacity-40 group-hover:opacity-100 group-hover:scale-125 transition-all" />
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

export default About;
