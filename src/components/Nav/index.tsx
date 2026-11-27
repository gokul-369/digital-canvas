import { navLinks } from "../../data";
import useTheme from "../../hooks/useTheme";
import { HashLink } from "react-router-hash-link";
import { scrollWithLenis, scrollToTop } from "../../utils/scroll";
import { PiMoonStarsLight } from "react-icons/pi";
import { GoSun } from "react-icons/go";
import {
  HiOutlineHome,
  HiOutlineBriefcase,
  HiOutlineCommandLine,
  HiOutlineRocketLaunch,
  HiOutlineXMark,
} from "react-icons/hi2";
import { IoCameraOutline, IoBookOutline } from "react-icons/io5";
import { useMotionValueEvent, useScroll, motion, AnimatePresence } from "motion/react";
import { useState, useRef, useEffect, type ComponentType } from "react";
import { useLocation } from "react-router-dom";

const MOBILE_ICONS: Record<string, ComponentType<{ className?: string }>> = {
  Home: HiOutlineHome,
  Experience: HiOutlineBriefcase,
  Skills: HiOutlineCommandLine,
  Projects: HiOutlineRocketLaunch,
  Gallery: IoCameraOutline,
  Books: IoBookOutline,
};

function Nav() {
  const { toggleTheme, theme: themeName, themeClassSet: theme } = useTheme();
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(true);
  const [isMobileDockOpen, setIsMobileDockOpen] = useState(true);
  const lastYRef = useRef(0);
  const location = useLocation();

  // Start expanded on mount so user sees the dock, then smoothly collapse into a circle
  useEffect(() => {
    const timer = setTimeout(() => setIsMobileDockOpen(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const diff = latest - lastYRef.current;
    if (Math.abs(diff) < 8) return;

    if (diff > 0 && latest > 80) {
      setVisible((prev) => (prev ? false : prev));
    } else if (diff < 0) {
      setVisible((prev) => (!prev ? true : prev));
    }

    lastYRef.current = latest;
  });

  const isActive = (linkValue: string) => {
    if (linkValue === "/#home") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(linkValue);
  };

  const handleLinkClick = (linkValue: string) => {
    // Scroll immediately if switching routes or smoothly if staying on current route
    const sameRoute = isActive(linkValue);
    scrollToTop(!sameRoute);
  };

  return (
    <>
      {/* Desktop Floating Top Pill Nav (md+) */}
      <div className="hidden md:flex fixed top-7 left-0 w-full items-center justify-center z-40 pointer-events-none">
        <motion.nav
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : -12 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          style={{ pointerEvents: visible ? "auto" : "none" }}
          className="inline-flex gap-5 items-center justify-around rounded-full border border-slate-200/90 dark:border-white/15 backdrop-blur-xl px-5 py-2 text-xs text-slate-800 dark:text-gray-200 bg-white/85 dark:bg-white/[0.06] shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(15,23,42,0.45)] transition-colors duration-200"
        >
          <span className="inline-flex justify-center items-center gap-4">
            {navLinks.map((link) => {
              const active = isActive(link.value);
              return (
                <HashLink
                  to={link.value}
                  scroll={scrollWithLenis}
                  onClick={() => handleLinkClick(link.value)}
                  key={link.name}
                  className={`relative text-sm transition-all duration-300 ${
                    active
                      ? "text-indigo-600 dark:text-indigo-400 font-medium"
                      : `font-thin ${theme.textPrimary} hover:text-indigo-500`
                  }`}
                >
                  {link.name}
                </HashLink>
              );
            })}
          </span>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle color theme"
            className="p-1 rounded-full hover:bg-slate-200/60 dark:hover:bg-white/10 transition-colors cursor-pointer"
          >
            {themeName === "dark" ? (
              <GoSun
                className={`${theme.textPrimary} font-bold transition-transform duration-300 ease-in-out hover:rotate-90 text-sm`}
              />
            ) : (
              <PiMoonStarsLight
                className={`${theme.textPrimary} font-bold transition-transform duration-300 ease-in-out hover:-rotate-45 text-sm`}
              />
            )}
          </button>
        </motion.nav>
      </div>

      {/* Mobile Collapsible Floating Dock (< md) — starts expanded on mount, then collapses into a circle */}
      <div className="md:hidden fixed bottom-5 left-0 w-full flex items-center justify-center z-40 px-3 pointer-events-none">
        <AnimatePresence mode="wait">
          {isMobileDockOpen ? (
            <motion.nav
              key="mobile-dock-expanded"
              initial={{ opacity: 0, scale: 0.75, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.75, y: 12 }}
              transition={{ type: "spring", stiffness: 360, damping: 28 }}
              aria-label="Mobile navigation dock"
              className="pointer-events-auto flex w-full max-w-[380px] items-center justify-between p-1.5 rounded-full border border-slate-200/90 dark:border-white/15 bg-white/95 dark:bg-slate-950/90 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.18)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.7)]"
            >
              {navLinks.map((link) => {
                const active = isActive(link.value);
                const Icon = MOBILE_ICONS[link.name] ?? HiOutlineHome;

                return (
                  <HashLink
                    key={link.name}
                    to={link.value}
                    scroll={scrollWithLenis}
                    onClick={() => {
                      handleLinkClick(link.value);
                      setIsMobileDockOpen(false);
                    }}
                    aria-label={link.name}
                    className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-200 active:scale-90 ${
                      active
                        ? "text-white"
                        : "text-slate-600 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-white"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="mobile-dock-active"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        className="absolute inset-0 rounded-full bg-indigo-600 shadow-md shadow-indigo-500/25"
                      />
                    )}
                    <Icon className="relative z-10 w-5 h-5 shrink-0" />
                  </HashLink>
                );
              })}

              <span className="w-px h-5 bg-slate-300/80 dark:bg-white/15 shrink-0" />

              <button
                type="button"
                onClick={toggleTheme}
                aria-label="Toggle color theme"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-600 dark:text-slate-300 hover:text-indigo-500 dark:hover:text-white active:scale-90 transition-all cursor-pointer"
              >
                {themeName === "dark" ? (
                  <GoSun className="w-5 h-5" />
                ) : (
                  <PiMoonStarsLight className="w-5 h-5" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsMobileDockOpen(false)}
                aria-label="Collapse navigation menu"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white active:scale-90 transition-all cursor-pointer"
              >
                <HiOutlineXMark className="w-5 h-5" />
              </button>
            </motion.nav>
          ) : (
            <motion.button
              key="mobile-dock-collapsed"
              type="button"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 380, damping: 26 }}
              onClick={() => setIsMobileDockOpen(true)}
              aria-label="Expand navigation menu"
              className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full border border-indigo-400/40 bg-indigo-600 text-white shadow-[0_10px_30px_rgba(79,70,229,0.45)] cursor-pointer"
            >
              {(() => {
                const activeLink = navLinks.find((l) => isActive(l.value));
                const ActiveIcon =
                  (activeLink && MOBILE_ICONS[activeLink.name]) || HiOutlineHome;
                return <ActiveIcon className="w-5 h-5" />;
              })()}
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

export default Nav;
