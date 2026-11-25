import type { ThemeClassSet } from "../../types";
import { hero } from "../../data";
import Fade from "../../animations/Fade";
import Button from "../Button";
import BlurText from "../../animations/Text/BlurText";
import { HashLink } from "react-router-hash-link";
import { scrollWithLenis } from "../../utils/scroll";

import { IoChevronDownOutline } from "react-icons/io5";
import { useNavigate } from "react-router";
import { useAppContext } from "../../context/AppContext";
import { LuMail } from "react-icons/lu";
import { HiOutlineBriefcase } from "react-icons/hi2";

import LiquidEther from "../Backgrounds/LiquidEther";
import { isMobile } from "../../utils/styleFactory";
import useTheme from "../../hooks/useTheme";

type HeroProps = {
  theme: ThemeClassSet;
  colors: string[];
};

function Hero({ theme, colors }: HeroProps) {
  const navigate = useNavigate();
  const { openCollaborate } = useAppContext();
  const { theme: currentTheme } = useTheme();
  const isDark = currentTheme === "dark";

  return (
    <section id={"home"} className="h-dvh relative w-full bg-transparent overflow-hidden">
      {/* LiquidEther with smooth feathered bottom dissolve into Home ambient background */}
      <div
        className="absolute inset-0 h-full w-full pointer-events-none -z-0 opacity-40 dark:opacity-100 transition-opacity duration-500"
        style={{
          maskImage:
            "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 98%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 98%)",
        }}
      >
        <LiquidEther
          colors={colors}
          mouseForce={isMobile ? (isDark ? 7 : 4) : (isDark ? 11 : 6)}
          isViscous
          iterationsViscous={isMobile ? 6 : 8}
          iterationsPoisson={isMobile ? 8 : 12}
          resolution={0.2}
          autoIntensity={isDark ? (isMobile ? 1.2 : 1.6) : (isMobile ? 0.5 : 0.7)}
          autoResumeDelay={1500}
          autoRampDuration={0.3}
          isBounce
        />
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        {/* main hero content */}
        <main className="content flex flex-col gap-6 px-8 lg:px-44">
          <BlurText
            className="text-center"
            animateBy="tags"
            delay={200}
            direction="top"
          >
            <div
              className={`lg:text-lg text-xs tracking-widest uppercase font-thin ${theme.textPrimary}`}
              dangerouslySetInnerHTML={{ __html: hero.title }}
            />
          </BlurText>
          <Fade variant="fade-up" delay={300} className={"mt-2 text-center"}>
            <h3
              className={`${theme.headerGradient} bg-clip-text text-5xl md:text-7xl lg:text-8xl font-sacramento font-normal tracking-normal text-transparent leading-[1.5] md:leading-[1.6] py-6 px-4 -my-4 inline-block overflow-visible`}
            >
              {hero.punchLine}
            </h3>

            <h4 className={`mt-4 lg:text-lg text-xs ${theme.textSecondary}`}>
              {hero.shortDescription}
            </h4>
          </Fade>
          <Fade variant="fade-up" delay={500} className={"text-center"}>
            <div
              className={`${theme.textSecondary} max-w-2xl lg:text-base text-xs mx-auto leading-relaxed`}
              dangerouslySetInnerHTML={{ __html: hero.longDescription }}
            />
            <div className="inline-flex gap-5 items-center justify-center mt-10">
              <Button
                text="Get in touch"
                variant="primary"
                icon={<LuMail className="ml-1" />}
                onClick={openCollaborate}
              />
              <Button
                text="View Work"
                icon={<HiOutlineBriefcase className="ml-1" />}
                variant="tertiary"
                onClick={() => {
                  navigate("/experience");
                }}
              />
            </div>
          </Fade>
        </main>

        <HashLink to={"/#about"} scroll={scrollWithLenis}>
          <IoChevronDownOutline
            className={`absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce z-20 ${theme.textPrimary}`}
          />
        </HashLink>
      </div>
    </section>
  );
}

export default Hero;
