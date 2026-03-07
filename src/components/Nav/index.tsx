import { navLinks } from "../../data";
import useTheme from "../../hooks/useTheme";
import { HashLink } from "react-router-hash-link";
import { PiMoonStarsLight } from "react-icons/pi";
import { GoSun } from "react-icons/go";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useScroll, useTransform, motion } from "motion/react";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { isMobile } from "../../utils/styleFactory";

gsap.registerPlugin(ScrollTrigger);

function Nav() {
  const [open, setOpen] = useState(false);
  const { toggleTheme, theme: themeName, themeClassSet: theme } = useTheme();
  const navRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  const opacity = useTransform(scrollY, [1, 120], [1, 0]);
  const pointerEvents = useTransform(scrollY, [1, 100], ["all", "none"]);

  const menuIconOpacity = useTransform(scrollY, [80, 140], [0, 1]);

  const tweenRef = useRef<gsap.core.Tween | null>(null);
  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const ctx = gsap.context(() => {
      tweenRef.current = gsap.fromTo(
        nav,
        { top: 0 },
        {
          width: isMobile ? 38 : 48,
          height: isMobile ? 38 : 48,
          borderRadius: 999,
          right: 16,
          ease: "power2.out",
          scrollTrigger: {
            trigger: document.body,
            start: "top top",
            end: "+=200",
            scrub: 0.6,
          },
        },
      );
    }, nav);

    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    const handleScroll = () => {
      if (open && window.scrollY > 20) {
        const nav = navRef.current;
        if (!nav) return;

        gsap.set(nav, { clearProps: "transform,xPercent,x,left" });

        setOpen(false);

        const trigger = tweenRef.current?.scrollTrigger;
        if (trigger) {
          trigger.enable();
          trigger.refresh();
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [open]);

  const handleMenuClick = () => {
    const nav = navRef.current;
    if (!nav) return;

    if (!open) {
      // OPEN NAV — disable trigger but do NOT reset progress,
      // so closing can resume from the exact scroll state
      tweenRef.current?.scrollTrigger?.disable(false);

      gsap.to(nav, {
        left: "50%",
        right: "auto",
        xPercent: -50,
        width: "auto",
        height: "auto",
        borderRadius: 999,
        duration: 0.4,
        ease: "power2.out",
      });

      setOpen(true);
    } else {
      const scrollProgress = Math.min(window.scrollY / 200, 1);

      gsap.to(nav, {
        left: "auto",
        right: 16,
        xPercent: 0,
        top: 0,
        width: 48,
        height: 48,
        borderRadius: 999,
        duration: 0.4,
        ease: "power2.inOut",
        onComplete: () => {
          gsap.set(nav, { clearProps: "left,xPercent,x" });

          const trigger = tweenRef.current?.scrollTrigger;
          if (trigger) {
            // Sync tween to current scroll before enabling — prevents the jump
            tweenRef.current?.progress(scrollProgress, true);
            trigger.enable(false);
            trigger.refresh();
          }
        },
      });

      setOpen(false);
    }
  };

  return (
    <nav
      ref={navRef}
      className="inline-flex absolute gap-4 items-center justify-around rounded-full border border-white/15 backdrop-blur-md px-4 py-2 text-xs text-gray-200
    bg-white/5 dark:bg-white/5
    shadow-[0_8px_30px_rgba(15,23,42,0.45)]
    transition-colors duration-200
    "
    >
      <motion.span
        className="inline-flex justify-center items-center gap-4"
        style={{
          opacity: open ? 1 : opacity,
          pointerEvents: open ? "all" : pointerEvents,
        }}
      >
        {navLinks.map((link) => (
          <HashLink
            to={link.value}
            smooth
            key={link.name}
            className={`text-sm font-thin ${theme.textPrimary} hover:text-indigo-500 transition-all duration-300`}
          >
            {link.name}
          </HashLink>
        ))}
      </motion.span>

      <motion.span
        className={`absolute md:text-lg text-xs ${theme.textPrimary}`}
        style={{
          cursor: "pointer",
          opacity: open ? 0 : menuIconOpacity,
          pointerEvents: open ? "none" : "auto",
        }}
        onClick={handleMenuClick}
      >
        <HiOutlineMenuAlt3 />
      </motion.span>

      {themeName === "dark" ? (
        <GoSun
          onClick={toggleTheme}
          className={`${theme.textPrimary} font-bold transition-transform duration-300 ease-in-out transform hover:rotate-90 text-sm cursor-pointer`}
        />
      ) : (
        <PiMoonStarsLight
          onClick={toggleTheme}
          className={`${theme.textPrimary} font-bold text-center cursor-pointer text-sm transition-transform duration-300 ease-in-out transform hover:-rotate-45`}
        />
      )}
    </nav>
  );
}

export default Nav;
