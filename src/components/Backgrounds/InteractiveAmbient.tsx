import { useEffect, useRef, memo } from "react";
import useTheme from "../../hooks/useTheme";

interface InteractiveAmbientProps {
  variant?: "home" | "experience" | "gallery" | "skills" | "books";
  className?: string;
}

interface CosmicStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  color: string;
  twinkleSpeed: number;
  twinklePhase: number;
  hasGlowHalo: boolean;
}

interface ShiningComet {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  headRadius: number;
  alpha: number;
  maxAlpha: number;
  progress: number;
  duration: number;
  active: boolean;
}

interface SunlightMote {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  rgb: string;
  swaySpeed: number;
  swayPhase: number;
  swayAmplitude: number;
}

function InteractiveAmbient({
  variant = "home",
  className = "",
}: InteractiveAmbientProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Retina / High-DPI support
    const updateCanvasSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    updateCanvasSize();

    let mouseX = -1000;
    let mouseY = -1000;
    let targetMouseX = -1000;
    let targetMouseY = -1000;
    let isVisible = true;
    let isScrolling = false;
    let scrollTimeout: number;

    const isMobile = width < 640;
    const isTablet = width >= 640 && width < 1024;

    // Responsive particle densities
    const starCount = isMobile ? 65 : isTablet ? 110 : 160;
    const moteCount = isMobile ? 60 : isTablet ? 95 : 135;

    // Authentic astronomical stellar classes
    const darkStarColors = [
      "#ffffff", // Class A: pure diamond white
      "#ffffff",
      "#f8fafc",
      "#e0f2fe", // Class B: brilliant blue-white
      "#bae6fd",
      "#fef3c7", // Class F/G: warm solar white
      "#fde68a", // Class K: soft stellar gold
      "#e9d5ff", // Soft nebula lilac tint
    ];

    const stars: CosmicStar[] = isDark
      ? Array.from({ length: starCount }, (_, idx) => {
          const isBright = idx < Math.floor(starCount * 0.12); // 12% focal bright stars
          const isMedium = !isBright && idx < Math.floor(starCount * 0.35); // 23% medium stars

          const radius = isBright
            ? Math.random() * 0.6 + 1.6 // 1.6px - 2.2px
            : isMedium
              ? Math.random() * 0.4 + 1.0 // 1.0px - 1.4px
              : Math.random() * 0.35 + 0.6; // 0.6px - 0.95px field stars

          return {
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.02, // very slow, serene cosmic drift
            vy: (Math.random() - 0.5) * 0.02,
            radius,
            baseAlpha: isBright
              ? 0.95
              : isMedium
                ? Math.random() * 0.25 + 0.65
                : Math.random() * 0.3 + 0.45,
            color: darkStarColors[Math.floor(Math.random() * darkStarColors.length)],
            twinkleSpeed: Math.random() * 0.9 + 0.4,
            twinklePhase: Math.random() * Math.PI * 2,
            hasGlowHalo: isBright,
          };
        })
      : [];

    // Shining Comets System in Night Mode
    let activeComet: ShiningComet | null = null;
    let cometCooldown = Math.floor(Math.random() * 160 + 100);

    const spawnComet = (): ShiningComet => {
      const angle = Math.PI * 0.22 + (Math.random() - 0.5) * 0.15; // ~35° to 45° trajectory
      const startX = Math.random() * (width * 0.75) + 20;
      const startY = Math.random() * (height * 0.25) - 40;
      const speed = Math.random() * 4 + 7.5; // 7.5 to 11.5 px/frame
      const length = Math.random() * 80 + 140; // 140px - 220px luminous tail
      const maxAlpha = Math.random() * 0.3 + 0.7; // 0.7 to 1.0

      return {
        x: startX,
        y: startY,
        length,
        speed,
        angle,
        headRadius: Math.random() * 0.8 + 2.0,
        alpha: 0,
        maxAlpha,
        progress: 0,
        duration: 140 + Math.random() * 50,
        active: true,
      };
    };

    // LIGHT MODE: Ethereal floating luminous sunlight motes
    const lightMoteRGBs = [
      "251, 191, 36", // Solar Gold
      "245, 158, 11", // Warm Sunlit Amber
      "56, 189, 248", // Morning Sky Cyan
      "99, 102, 241", // Soft Periwinkle
      "168, 85, 247", // Lilac Mist
      "244, 114, 182", // Soft Rose Bloom
      "255, 255, 255", // Luminous Opal
    ];

    const motes: SunlightMote[] = !isDark
      ? Array.from({ length: moteCount }, () => ({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.08,
          vy: -(Math.random() * 0.28 + 0.14),
          radius: Math.random() * 4.5 + 2.5,
          baseAlpha: Math.random() * 0.4 + 0.4,
          rgb: lightMoteRGBs[Math.floor(Math.random() * lightMoteRGBs.length)],
          swaySpeed: Math.random() * 0.7 + 0.5,
          swayPhase: Math.random() * Math.PI * 2,
          swayAmplitude: Math.random() * 0.4 + 0.2,
        }))
      : [];

    const handleResize = () => {
      updateCanvasSize();
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };

    const handleMouseLeave = () => {
      targetMouseX = -1000;
      targetMouseY = -1000;
    };

    const handleScroll = () => {
      isScrolling = true;
      clearTimeout(scrollTimeout);
      scrollTimeout = window.setTimeout(() => {
        isScrolling = false;
      }, 100);
    };

    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    if (containerRef.current) observer.observe(containerRef.current);

    let lastTime = performance.now();

    const render = (time: number) => {
      animationFrameId = requestAnimationFrame(render);
      if (!isVisible || isScrolling) return;

      const delta = time - lastTime;
      if (delta < 16) return;
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      // Smooth mouse presence
      mouseX += (targetMouseX - mouseX) * 0.08;
      mouseY += (targetMouseY - mouseY) * 0.08;

      if (isDark) {
        // RENDER DARK MODE: Clean, High-Performance Cosmic Stars
        for (let i = 0; i < starCount; i++) {
          const s = stars[i];

          // Natural slow drift
          s.x += s.vx;
          s.y += s.vy;
          if (s.x < 0) s.x = width;
          else if (s.x > width) s.x = 0;
          if (s.y < 0) s.y = height;
          else if (s.y > height) s.y = 0;

          // Natural organic twinkling
          const twinkle = Math.sin(time * 0.0018 * s.twinkleSpeed + s.twinklePhase);
          const currentAlpha = Math.max(0.2, Math.min(1.0, s.baseAlpha + twinkle * 0.28));

          // Proximity to cursor
          const dx = mouseX - s.x;
          const dy = mouseY - s.y;
          const dist = Math.hypot(dx, dy);
          const proximity = Math.max(0, 1 - dist / 140);

          if (proximity > 0) {
            // SHINE EFFECT: Star blooms into a radiant starlight flare
            const shineAlpha = Math.min(1.0, currentAlpha + proximity * 0.7);
            const haloRadius = s.radius * (3.5 + proximity * 5.0);

            const gradient = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, haloRadius);
            gradient.addColorStop(0, `rgba(255, 255, 255, ${shineAlpha})`);
            gradient.addColorStop(0.3, `rgba(224, 242, 254, ${shineAlpha * 0.7})`);
            gradient.addColorStop(1, "transparent");

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(s.x, s.y, haloRadius, 0, Math.PI * 2);
            ctx.fill();

            // Brilliant Core
            ctx.fillStyle = "#ffffff";
            ctx.globalAlpha = shineAlpha;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.radius * (1 + proximity * 0.5), 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1.0;
          } else if (s.hasGlowHalo) {
            // Focal star optical corona halo
            const haloRadius = s.radius * 3.0;
            const gradient = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, haloRadius);
            gradient.addColorStop(0, `rgba(255, 255, 255, ${currentAlpha})`);
            gradient.addColorStop(0.4, `rgba(224, 242, 254, ${currentAlpha * 0.35})`);
            gradient.addColorStop(1, "transparent");

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(s.x, s.y, haloRadius, 0, Math.PI * 2);
            ctx.fill();

            // Core
            ctx.fillStyle = "#ffffff";
            ctx.globalAlpha = currentAlpha;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1.0;
          } else {
            // ALL FIELD STARS RENDERED: Clean, crisp, lightweight pinpricks
            ctx.fillStyle = s.color;
            ctx.globalAlpha = currentAlpha;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1.0;
          }
        }
      } else {
        // RENDER LIGHT MODE: Luminous Sunlight Motes with Shimmer & Proximity Bloom
        for (let i = 0; i < moteCount; i++) {
          const m = motes[i];

          m.y += m.vy;
          m.x += Math.sin(time * 0.001 * m.swaySpeed + m.swayPhase) * m.swayAmplitude + m.vx;

          if (m.y < -m.radius * 2) {
            m.y = height + m.radius * 2;
            m.x = Math.random() * width;
          } else if (m.y > height + m.radius * 2) {
            m.y = -m.radius * 2;
            m.x = Math.random() * width;
          }
          if (m.x < -m.radius * 2) m.x = width + m.radius * 2;
          else if (m.x > width + m.radius * 2) m.x = -m.radius * 2;

          const dx = mouseX - m.x;
          const dy = mouseY - m.y;
          const dist = Math.hypot(dx, dy);
          const proximity = Math.max(0, 1 - dist / 150);

          const shimmer = Math.sin(time * 0.0018 * m.swaySpeed + m.swayPhase) * 0.15;
          const alpha = Math.max(0.25, Math.min(0.95, m.baseAlpha + shimmer + proximity * 0.45));
          const currentRadius = m.radius * (1 + proximity * 0.35);

          const gradient = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, currentRadius);
          gradient.addColorStop(0, `rgba(${m.rgb}, ${alpha})`);
          gradient.addColorStop(0.5, `rgba(${m.rgb}, ${alpha * 0.6})`);
          gradient.addColorStop(1, `rgba(${m.rgb}, 0)`);

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(m.x, m.y, currentRadius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // RENDER SHINING COMETS IN BOTH MODES (Dark: Electric Cyan/White, Light: Iridescent Prismatic Flare)
      cometCooldown--;
      if (cometCooldown <= 0 && activeComet === null) {
        activeComet = spawnComet();
        cometCooldown = Math.floor(Math.random() * 260 + 180);
      }

      if (activeComet && activeComet.active) {
        const c = activeComet;
        c.progress++;

        c.x += Math.cos(c.angle) * c.speed;
        c.y += Math.sin(c.angle) * c.speed;

        const p = c.progress / c.duration;
        if (p < 0.15) {
          c.alpha = (p / 0.15) * c.maxAlpha;
        } else if (p > 0.65) {
          c.alpha = ((1 - p) / 0.35) * c.maxAlpha;
        } else {
          c.alpha = c.maxAlpha;
        }

        if (p >= 1 || c.x > width + 250 || c.y > height + 250) {
          c.active = false;
          activeComet = null;
        } else {
          const tailX = c.x - Math.cos(c.angle) * c.length;
          const tailY = c.y - Math.sin(c.angle) * c.length;

          const tailGrad = ctx.createLinearGradient(c.x, c.y, tailX, tailY);
          if (isDark) {
            tailGrad.addColorStop(0, `rgba(255, 255, 255, ${c.alpha * 0.95})`);
            tailGrad.addColorStop(0.15, `rgba(224, 242, 254, ${c.alpha * 0.75})`);
            tailGrad.addColorStop(0.4, `rgba(56, 189, 248, ${c.alpha * 0.4})`);
            tailGrad.addColorStop(0.75, `rgba(99, 102, 241, ${c.alpha * 0.15})`);
            tailGrad.addColorStop(1, "transparent");
          } else {
            tailGrad.addColorStop(0, `rgba(79, 70, 229, ${c.alpha * 0.9})`);
            tailGrad.addColorStop(0.2, `rgba(99, 102, 241, ${c.alpha * 0.75})`);
            tailGrad.addColorStop(0.5, `rgba(56, 189, 248, ${c.alpha * 0.45})`);
            tailGrad.addColorStop(1, "transparent");
          }

          ctx.strokeStyle = tailGrad;
          ctx.lineWidth = c.headRadius * 1.5;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(c.x, c.y);
          ctx.lineTo(tailX, tailY);
          ctx.stroke();

          // Coma flare
          const flareGrad = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.headRadius * 5);
          if (isDark) {
            flareGrad.addColorStop(0, `rgba(255, 255, 255, ${c.alpha * 0.9})`);
            flareGrad.addColorStop(0.3, `rgba(186, 230, 253, ${c.alpha * 0.6})`);
            flareGrad.addColorStop(1, "transparent");
          } else {
            flareGrad.addColorStop(0, `rgba(79, 70, 229, ${c.alpha * 0.85})`);
            flareGrad.addColorStop(0.3, `rgba(129, 140, 248, ${c.alpha * 0.55})`);
            flareGrad.addColorStop(1, "transparent");
          }

          ctx.fillStyle = flareGrad;
          ctx.beginPath();
          ctx.arc(c.x, c.y, c.headRadius * 5, 0, Math.PI * 2);
          ctx.fill();

          // Core
          ctx.fillStyle = isDark ? "#ffffff" : "#4f46e5";
          ctx.globalAlpha = c.alpha;
          ctx.beginPath();
          ctx.arc(c.x, c.y, c.headRadius, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1.0;
        }
      }

      ctx.globalAlpha = 1.0;
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mouseleave", handleMouseLeave);
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, [variant, isDark]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`fixed inset-0 pointer-events-none -z-10 overflow-hidden ${className}`}
    >
      {/* Volumetric Atmospheric Glow Curtains tailored for each module */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          background: isDark
            ? variant === "gallery"
              ? "radial-gradient(ellipse 75% 45% at 50% -10%, rgba(16, 185, 129, 0.20) 0%, transparent 65%), radial-gradient(ellipse 65% 55% at 85% 35%, rgba(99, 102, 241, 0.22) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 15% 65%, rgba(168, 85, 247, 0.18) 0%, transparent 60%)"
              : variant === "skills"
                ? "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(168, 85, 247, 0.22) 0%, transparent 65%), radial-gradient(ellipse 70% 55% at 85% 35%, rgba(56, 189, 248, 0.20) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 15% 65%, rgba(99, 102, 241, 0.18) 0%, transparent 60%)"
                : variant === "experience"
                  ? "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(56, 189, 248, 0.22) 0%, transparent 65%), radial-gradient(ellipse 65% 55% at 85% 40%, rgba(99, 102, 241, 0.22) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 15% 65%, rgba(16, 185, 129, 0.18) 0%, transparent 60%)"
                  : "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(16, 185, 129, 0.22) 0%, transparent 65%), radial-gradient(ellipse 70% 55% at 85% 35%, rgba(99, 102, 241, 0.24) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 15% 65%, rgba(192, 132, 252, 0.18) 0%, transparent 60%)"
            : variant === "gallery"
              ? "radial-gradient(ellipse 75% 45% at 50% -10%, rgba(56, 189, 248, 0.35) 0%, transparent 70%), radial-gradient(ellipse 65% 55% at 85% 35%, rgba(129, 140, 248, 0.30) 0%, transparent 65%), radial-gradient(ellipse 60% 50% at 15% 65%, rgba(244, 114, 182, 0.25) 0%, transparent 65%)"
              : variant === "skills"
                ? "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(168, 85, 247, 0.35) 0%, transparent 70%), radial-gradient(ellipse 65% 55% at 85% 40%, rgba(56, 189, 248, 0.30) 0%, transparent 65%), radial-gradient(ellipse 60% 50% at 15% 65%, rgba(129, 140, 248, 0.25) 0%, transparent 65%)"
                : variant === "experience"
                  ? "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99, 102, 241, 0.36) 0%, transparent 70%), radial-gradient(ellipse 65% 55% at 85% 40%, rgba(56, 189, 248, 0.32) 0%, transparent 65%), radial-gradient(ellipse 60% 50% at 15% 65%, rgba(168, 85, 247, 0.25) 0%, transparent 65%)"
                  : "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(45, 212, 191, 0.32) 0%, transparent 70%), radial-gradient(ellipse 70% 55% at 85% 35%, rgba(129, 140, 248, 0.34) 0%, transparent 65%), radial-gradient(ellipse 60% 50% at 15% 65%, rgba(245, 158, 11, 0.24) 0%, transparent 65%)",
        }}
      />

      {/* Luminous Authentic Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-100"
      />

      {/* Atmospheric Vignette Depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isDark
            ? "radial-gradient(circle at 50% 50%, transparent 35%, rgba(3, 4, 7, 0.65) 100%)"
            : "radial-gradient(circle at 50% 50%, transparent 60%, rgba(226, 232, 240, 0.25) 100%)",
        }}
      />
    </div>
  );
}

export default memo(InteractiveAmbient);
