import { navLinks } from "../../data";
import useTheme from "../../hooks/useTheme";
import { HashLink } from "react-router-hash-link";
import { scrollWithLenis } from "../../utils/scroll";
import { PiMoonStarsLight } from "react-icons/pi";
import { GoSun } from "react-icons/go";
import { HiOutlineBars3 } from "react-icons/hi2";
import { IoCloseOutline } from "react-icons/io5";
import { useMotionValueEvent, useScroll, motion, AnimatePresence } from "motion/react";
import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";

function Nav() {
  const { toggleTheme, theme: themeName, themeClassSet: theme } = useTheme();
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastYRef = useRef(0);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname, location.hash]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const diff = latest - lastYRef.current;
    if (Math.abs(diff) < 8) return;

    if (diff > 0 && latest > 80) {
      setVisible((prev) => (prev ? false : prev));
      setMobileOpen(false);
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

  const activeLink = navLinks.find((l) => isActive(l.value)) ?? navLinks[0];

  return (
    <>
      {/* Desktop Floating Pill Nav (md+) */}
      <motion.nav
        initial={{ opacity: 1 }}
        animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : -12 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        style={{ pointerEvents: visible ? "auto" : "none" }}
        className="hidden md:inline-flex gap-5 items-center justify-around rounded-full border border-slate-200/90 dark:border-white/15 backdrop-blur-xl px-5 py-2 text-xs text-slate-800 dark:text-gray-200 bg-white/85 dark:bg-white/[0.06] shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(15,23,42,0.45)] transition-colors duration-200"
      >
        <span className="inline-flex justify-center items-center gap-4">
          {navLinks.map((link) => {
            const active = isActive(link.value);
            return (
              <HashLink
                to={link.value}
                scroll={scrollWithLenis}
                key={link.name}
                className={`relative text-sm transition-all duration-300 ${
                  active
                    ? "text-indigo-600 dark:text-indigo-400 font-medium"
                    : `font-thin ${theme.textPrimary} hover:text-indigo-500`
                }`}
              >
                {link.name}
                {active && (
                  <motion.span
                    layoutId="nav-active-dot"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-indigo-500"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
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

      {/* Mobile Compact Floating Bar + Drawer (< md) */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : -12 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        style={{ pointerEvents: visible ? "auto" : "none" }}
        className="md:hidden relative w-[calc(100%-2rem)] max-w-md mx-auto"
      >
        <div className="flex items-center justify-between rounded-full border border-slate-200/90 dark:border-white/15 backdrop-blur-xl px-4 py-2 bg-white/85 dark:bg-slate-950/75 shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
          {/* Active Page / Brand Indicator */}
          <HashLink
            to="/#home"
            scroll={scrollWithLenis}
            className="flex items-center gap-2.5 pl-1"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-space text-xs font-bold tracking-wide text-slate-900 dark:text-white">
              gokul.ink
            </span>
            <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500">
              / {activeLink.name.toLowerCase()}
            </span>
          </HashLink>

          {/* Right Controls: Theme Toggle + Hamburger */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle color theme"
              className="p-2 rounded-full border border-slate-200/70 dark:border-white/10 bg-slate-100/60 dark:bg-white/[0.05] text-slate-700 dark:text-slate-200 active:scale-95 transition-transform cursor-pointer"
            >
              {themeName === "dark" ? (
                <GoSun className="w-4 h-4" />
              ) : (
                <PiMoonStarsLight className="w-4 h-4" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileOpen}
              className="p-2 rounded-full border border-slate-200/70 dark:border-white/10 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 active:scale-95 transition-transform cursor-pointer"
            >
              {mobileOpen ? (
                <IoCloseOutline className="w-4 h-4" />
              ) : (
                <HiOutlineBars3 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              {/* Invisible tap-outside backdrop */}
              <div
                onClick={() => setMobileOpen(false)}
                className="fixed inset-0 -z-10"
              />
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="mt-2.5 p-3 rounded-3xl border border-slate-200/90 dark:border-white/15 bg-white/95 dark:bg-slate-950/90 backdrop-blur-2xl shadow-2xl grid grid-cols-2 gap-2"
              >
                {navLinks.map((link, idx) => {
                  const active = isActive(link.value);
                  return (
                    <HashLink
                      key={link.name}
                      to={link.value}
                      scroll={scrollWithLenis}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl border transition-all ${
                        active
                          ? "border-indigo-500/40 bg-indigo-500/15 text-indigo-600 dark:text-indigo-300 font-semibold"
                          : "border-slate-200/60 dark:border-white/[0.06] bg-slate-50/70 dark:bg-white/[0.03] text-slate-700 dark:text-slate-300 hover:border-indigo-400/30"
                      }`}
                    >
                      <span className="font-space text-xs">{link.name}</span>
                      <span className="font-mono text-[10px] opacity-50">
                        0{idx + 1}
                      </span>
                    </HashLink>
                  );
                })}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}

export default Nav;
