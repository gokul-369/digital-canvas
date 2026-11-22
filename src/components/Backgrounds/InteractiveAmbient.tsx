import { useEffect, useRef, memo } from "react";
import useTheme from "../../hooks/useTheme";

interface InteractiveAmbientProps {
  variant?: "home" | "experience" | "gallery";
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
    const starCount = isMobile ? 65 : isTablet ? 105 : 160;
    const moteCount = isMobile ? 35 : isTablet ? 55 : 85;

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
          const isBright = idx < Math.floor(starCount * 0.06);
          const isMedium = !isBright && idx < Math.floor(starCount * 0.22);

          const radius = isBright
            ? Math.random() * 0.6 + 1.8 // 1.8px - 2.4px
            : isMedium
              ? Math.random() * 0.5 + 1.1 // 1.1px - 1.6px
              : Math.random() * 0.4 + 0.5; // 0.5px - 0.9px micro-pinpricks

          return {
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.02, // very slow, serene cosmic drift
            vy: (Math.random() - 0.5) * 0.02,
            radius,
            baseAlpha: isBright
              ? 0.95
              : isMedium
                ? Math.random() * 0.35 + 0.55
                : Math.random() * 0.4 + 0.35,
            color: darkStarColors[Math.floor(Math.random() * darkStarColors.length)],
            twinkleSpeed: Math.random() * 0.9 + 0.4,
            twinklePhase: Math.random() * Math.PI * 2,
            hasGlowHalo: isBright,
          };
        })
      : [];

    // Shining Comets System in Night Mode
    let activeComet: ShiningComet | null = null;
    let cometCooldown = Math.floor(Math.random() * 180 + 120); // First comet appears shortly after load

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
          vx: (Math.random() - 0.5) * 0.06,
          vy: -(Math.random() * 0.25 + 0.12),
          radius: Math.random() * 3.5 + 2.0,
          baseAlpha: Math.random() * 0.35 + 0.25,
          rgb: lightMoteRGBs[Math.floor(Math.random() * lightMoteRGBs.length)],
          swaySpeed: Math.random() * 0.7 + 0.5,
          swayPhase: Math.random() * Math.PI * 2,
          swayAmplitude: Math.random() * 0.35 + 0.15,
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
        // RENDER DARK MODE: Anchored Cosmic Stars with Starlight Shine on Mouse Proximity
        for (let i = 0; i < starCount; i++) {
          const s = stars[i];

          // Natural slow drift (fixed position, no mouse drag/movement force)
          s.x += s.vx;
          s.y += s.vy;
          if (s.x < 0) s.x = width;
          else if (s.x > width) s.x = 0;
          if (s.y < 0) s.y = height;
          else if (s.y > height) s.y = 0;

          // Natural organic twinkling
          const twinkle = Math.sin(time * 0.0018 * s.twinkleSpeed + s.twinklePhase);
          const currentAlpha = Math.max(0.15, Math.min(1.0, s.baseAlpha + twinkle * 0.28));

          // Proximity to cursor: Stay in place, but shine brightly!
          const dx = mouseX - s.x;
          const dy = mouseY - s.y;
          const dist = Math.hypot(dx, dy);
          const proximity = Math.max(0, 1 - dist / 140); // 0 when far, up to 1 near mouse

          if (proximity > 0) {
            // SHINE EFFECT: Star blooms into a radiant starlight flare
            const shineAlpha = Math.min(1.0, currentAlpha + proximity * 0.7);
            const haloRadius = s.radius * (3.5 + proximity * 5.0);

            const gradient = ctx.createRadialGradient(
              s.x,
              s.y,
              0,
              s.x,
              s.y,
              haloRadius
            );
            gradient.addColorStop(0, `rgba(255, 255, 255, ${shineAlpha})`);
            gradient.addColorStop(0.25, `rgba(224, 242, 254, ${shineAlpha * 0.8})`);
            gradient.addColorStop(0.65, `rgba(99, 102, 241, ${shineAlpha * (0.25 + proximity * 0.35)})`);
            gradient.addColorStop(1, "transparent");

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(s.x, s.y, haloRadius, 0, Math.PI * 2);
            ctx.fill();

            // High-intensity brilliant white core
            ctx.fillStyle = "#ffffff";
            ctx.globalAlpha = shineAlpha;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.radius * (1 + proximity * 0.5), 0, Math.PI * 2);
            ctx.fill();
          } else if (s.hasGlowHalo) {
            // Natural optical corona / point-spread halo for focal stars
            const haloRadius = s.radius * 3.5;
            const gradient = ctx.createRadialGradient(
              s.x,
              s.y,
              0,
              s.x,
              s.y,
              haloRadius
            );
            gradient.addColorStop(0, `rgba(255, 255, 255, ${currentAlpha})`);
            gradient.addColorStop(0.35, `rgba(224, 242, 254, ${currentAlpha * 0.4})`);
            gradient.addColorStop(1, "transparent");

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(s.x, s.y, haloRadius, 0, Math.PI * 2);
            ctx.fill();

            // Core
            ctx.fillStyle = "#ffffff";
            ctx.globalAlpha = currentAlpha;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.radius * 0.7, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // Clean pinpoint star
            ctx.fillStyle = s.color;
            ctx.globalAlpha = currentAlpha;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // RENDER SHINING COMETS IN NIGHT MODE
        cometCooldown--;
        if (cometCooldown <= 0 && activeComet === null) {
          activeComet = spawnComet();
          cometCooldown = Math.floor(Math.random() * 320 + 260); // 4.5 to 9.5 seconds interval
        }

        if (activeComet && activeComet.active) {
          const c = activeComet;
          c.progress++;

          // Move along trajectory
          c.x += Math.cos(c.angle) * c.speed;
          c.y += Math.sin(c.angle) * c.speed;

          // Silky smooth fade envelope
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
            // Tail calculation
            const tailX = c.x - Math.cos(c.angle) * c.length;
            const tailY = c.y - Math.sin(c.angle) * c.length;

            // Luminous ion & dust streak
            const tailGrad = ctx.createLinearGradient(c.x, c.y, tailX, tailY);
            tailGrad.addColorStop(0, `rgba(255, 255, 255, ${c.alpha * 0.95})`);
            tailGrad.addColorStop(0.12, `rgba(224, 242, 254, ${c.alpha * 0.75})`);
            tailGrad.addColorStop(0.35, `rgba(56, 189, 248, ${c.alpha * 0.4})`);
            tailGrad.addColorStop(0.7, `rgba(99, 102, 241, ${c.alpha * 0.15})`);
            tailGrad.addColorStop(1, "transparent");

            ctx.strokeStyle = tailGrad;
            ctx.lineWidth = c.headRadius * 1.5;
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.moveTo(c.x, c.y);
            ctx.lineTo(tailX, tailY);
            ctx.stroke();

            // Glowing radiant coma around the comet nucleus
            const flareGrad = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.headRadius * 6);
            flareGrad.addColorStop(0, `rgba(255, 255, 255, ${c.alpha * 0.9})`);
            flareGrad.addColorStop(0.25, `rgba(186, 230, 253, ${c.alpha * 0.6})`);
            flareGrad.addColorStop(0.6, `rgba(99, 102, 241, ${c.alpha * 0.2})`);
            flareGrad.addColorStop(1, "transparent");

            ctx.fillStyle = flareGrad;
            ctx.beginPath();
            ctx.arc(c.x, c.y, c.headRadius * 6, 0, Math.PI * 2);
            ctx.fill();

            // High-intensity white nucleus core
            ctx.fillStyle = "#ffffff";
            ctx.globalAlpha = c.alpha;
            ctx.beginPath();
            ctx.arc(c.x, c.y, c.headRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1.0;
          }
        }
      } else {
        // RENDER LIGHT MODE: Luminous Sunlight Motes with Shimmer & Proximity Bloom
        for (let i = 0; i < moteCount; i++) {
          const m = motes[i];

          // Buoyant upward drift with thermal sinusoidal sway (no dragging with mouse)
          m.y += m.vy;
          m.x += Math.sin(time * 0.001 * m.swaySpeed + m.swayPhase) * m.swayAmplitude + m.vx;

          // Wrap boundaries smoothly
          if (m.y < -m.radius * 2) {
            m.y = height + m.radius * 2;
            m.x = Math.random() * width;
          } else if (m.y > height + m.radius * 2) {
            m.y = -m.radius * 2;
            m.x = Math.random() * width;
          }
          if (m.x < -m.radius * 2) m.x = width + m.radius * 2;
          else if (m.x > width + m.radius * 2) m.x = -m.radius * 2;

          // Proximity shine boost on mouse hover
          const dx = mouseX - m.x;
          const dy = mouseY - m.y;
          const dist = Math.hypot(dx, dy);
          const proximity = Math.max(0, 1 - dist / 130);

          // Soft shimmering opacity
          const shimmer = Math.sin(time * 0.0016 * m.swaySpeed + m.swayPhase) * 0.12;
          const alpha = Math.max(0.12, Math.min(0.85, m.baseAlpha + shimmer + proximity * 0.45));
          const currentRadius = m.radius * (1 + proximity * 0.4);

          // Soft feathered photographic bokeh circle
          const gradient = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, currentRadius);
          gradient.addColorStop(0, `rgba(${m.rgb}, ${alpha})`);
          gradient.addColorStop(0.45, `rgba(${m.rgb}, ${alpha * 0.5})`);
          gradient.addColorStop(1, `rgba(${m.rgb}, 0)`);

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(m.x, m.y, currentRadius, 0, Math.PI * 2);
          ctx.fill();
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
      className={`fixed inset-0 pointer-events-none -z-20 overflow-hidden ${className}`}
    >
      {/* Volumetric Atmospheric Glow Curtains */}
      <div
        className="absolute inset-0 transition-opacity duration-1000"
        style={{
          background: isDark
            ? variant === "gallery"
              ? "radial-gradient(ellipse 75% 45% at 50% -10%, rgba(16, 185, 129, 0.16) 0%, transparent 65%), radial-gradient(ellipse 65% 55% at 85% 35%, rgba(99, 102, 241, 0.18) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 15% 65%, rgba(168, 85, 247, 0.15) 0%, transparent 60%)"
              : variant === "experience"
                ? "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(56, 189, 248, 0.16) 0%, transparent 65%), radial-gradient(ellipse 65% 55% at 85% 40%, rgba(99, 102, 241, 0.18) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 15% 65%, rgba(16, 185, 129, 0.13) 0%, transparent 60%)"
                : "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(16, 185, 129, 0.16) 0%, transparent 65%), radial-gradient(ellipse 70% 55% at 85% 35%, rgba(99, 102, 241, 0.18) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 15% 65%, rgba(192, 132, 252, 0.14) 0%, transparent 60%)"
            : variant === "gallery"
              ? "radial-gradient(ellipse 75% 45% at 50% -10%, rgba(56, 189, 248, 0.16) 0%, transparent 65%), radial-gradient(ellipse 65% 55% at 85% 35%, rgba(129, 140, 248, 0.14) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 15% 65%, rgba(244, 114, 182, 0.10) 0%, transparent 60%)"
              : variant === "experience"
                ? "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99, 102, 241, 0.16) 0%, transparent 65%), radial-gradient(ellipse 65% 55% at 85% 40%, rgba(56, 189, 248, 0.14) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 15% 65%, rgba(192, 132, 252, 0.10) 0%, transparent 60%)"
                : "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(45, 212, 191, 0.14) 0%, transparent 65%), radial-gradient(ellipse 70% 55% at 85% 35%, rgba(165, 180, 252, 0.15) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 15% 65%, rgba(251, 191, 36, 0.10) 0%, transparent 60%)",
        }}
      />

      {/* Luminous Authentic Particle Canvas (Cosmic & Shining Comets in Dark / Sunlight Motes in Light) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-90"
      />

      {/* Atmospheric Vignette Depth */}
      <div
        className="absolute inset-0"
        style={{
          background: isDark
            ? "radial-gradient(circle at 50% 50%, transparent 25%, rgba(3, 4, 7, 0.88) 100%)"
            : "radial-gradient(circle at 50% 50%, transparent 55%, rgba(248, 250, 252, 0.35) 100%)",
        }}
      />
    </div>
  );
}

export default memo(InteractiveAmbient);
